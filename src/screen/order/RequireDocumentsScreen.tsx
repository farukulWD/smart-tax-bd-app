'use client';

import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { skipToken } from '@reduxjs/toolkit/query';
import { useGetMyFilesQuery, useUploadFileMutation } from '@/src/services/fileApi';
import {
  useGetTaxOrderByIdQuery,
  useUploadTaxStepTwoDocumentsMutation,
  useSkipUploadStepTwoMutation,
} from '@/src/services/orderApi';
import { AppStackParamList } from '@/src/navigation/AppStack';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import { File, Directory, Paths } from 'expo-file-system';
import { AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react-native';
import ProtectedScreen from '@/src/navigation/ProtectedScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { toast } from '@/src/utils/ToastConfig';
import DocumentCard from '@/src/components/order/DocumentCard';
import UploadOptionModal from '@/src/components/order/UploadOptionModal';
import { isImageUrl, isPdfUrl } from '@/src/utils/commonFunction';
import { PreviewFile } from '@/src/types/commonTypes';
import PreviewModal from '@/src/components/order/PreviewModal';
import { useThemeColors } from '@/src/theme/useThemeColors';

type LocalPreview = { doc: string; uri: string; name: string; isImage: boolean };

// axiosBaseQuery puts the raw axios message (a plain string) in `error.data`
// whenever the server did not answer with JSON — timeouts, 413s and network
// drops all land here, so reading `error.data.message` alone loses the reason.
const errorMessage = (error: any, fallback: string) => {
  const data = error?.data;
  const detail =
    (typeof data === 'string' && data) ||
    data?.message ||
    data?.error ||
    error?.message ||
    error?.error;
  const status = error?.status;

  if (!detail) return status ? `${fallback} (${status})` : fallback;
  return status ? `${detail} (${status})` : detail;
};

const RequireDocumentsScreen = () => {
  const route = useRoute<RouteProp<AppStackParamList, 'RequireDocuments'>>();
  const navigation = useNavigation<any>();
  const { colors } = useThemeColors();
  const taxId = route.params?.taxId;
  const { top, bottom } = useSafeAreaInsets();

  const [activeDoc, setActiveDoc] = useState('');
  const [localPreview, setLocalPreview] = useState<LocalPreview | null>(null);
  const [isLocalUploading, setIsLocalUploading] = useState(false);
  const [pendingDoc, setPendingDoc] = useState('');
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const [previewFile, setPreviewFile] = useState<PreviewFile | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const [uploadFile] = useUploadFileMutation();
  const [uploadTaxStepTwoDocuments, { isLoading: isSubmittingStepTwo }] =
    useUploadTaxStepTwoDocumentsMutation();
  const [skipUpload, { isLoading: isSkipping }] = useSkipUploadStepTwoMutation();

  const { data, refetch: refetchOrder } = useGetTaxOrderByIdQuery(taxId ?? skipToken);
  const {
    data: myFilesResponse,
    isLoading: isFilesLoading,
    refetch: refetchMyFiles,
  } = useGetMyFilesQuery(undefined, { skip: !taxId });

  const requiredDocuments: string[] = data?.data?.required_documents || [];
  const myFiles: any[] = myFilesResponse?.data || [];

  const latestFileByType = requiredDocuments.reduce(
    (acc, docType) => {
      const matching = myFiles
        .filter((f) => f.type === docType)
        .sort(
          (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );
      if (matching[0]) acc[docType] = matching[0];
      return acc;
    },
    {} as Record<string, any>
  );

  const uploadedDocTypes = Object.keys(latestFileByType);
  const missingDocuments = requiredDocuments.filter((doc) => !uploadedDocTypes.includes(doc));
  const stepTwoReady = requiredDocuments.length > 0 && missingDocuments.length === 0;

  // ── handlers ────────────────────────────────────────────────────────────────

  const openPreview = (url: string, name: string, type: PreviewFile['type']) => {
    setPreviewFile({ url, name, type });
    setIsPreviewOpen(true);
  };

  const downloadFile = async (url: string, name?: string) => {
    try {
      setIsDownloading(true);

      const uniqueName = `${Date.now()}_${name || 'download'}`;
      const destination = new Directory(Paths.cache, uniqueName);

      destination.create();

      const { uri } = await File.downloadFileAsync(url, destination, {});

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { dialogTitle: name || uniqueName });
      } else {
        toast.success('Download complete');
      }
    } catch (err: any) {
      console.log('err', JSON.stringify(err, null, 2));
      toast.error(err?.message || 'Download failed');
    } finally {
      setIsDownloading(false);
    }
  };

  const uploadAsset = async (doc: string, uri: string, name: string, mimeType: string) => {
    setActiveDoc(doc);
    setIsLocalUploading(true);
    try {
      const formData = new FormData();
      formData.append('data', JSON.stringify({ name: doc, type: doc, orderId: taxId }));
      formData.append('file', {
        uri,
        name,
        type: mimeType || 'application/octet-stream',
      } as any);

      await uploadFile(formData).unwrap();
      toast.success(`${doc} uploaded`);
      try {
        await refetchMyFiles();
      } catch (_) {}
      try {
        await refetchOrder();
      } catch (_) {}
    } catch (error: any) {
      console.log('upload error', JSON.stringify(error, null, 2));
      toast.error(errorMessage(error, 'Upload failed'));
    } finally {
      setIsLocalUploading(false);
      setActiveDoc('');
      setLocalPreview(null);
    }
  };

  const resetUploadState = () => {
    setIsLocalUploading(false);
    setActiveDoc('');
    setLocalPreview(null);
  };

  const pickFromFiles = async (doc: string) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets?.[0]) {
        resetUploadState();
        return;
      }

      const asset = result.assets[0];
      const mimeType = asset.mimeType || 'application/octet-stream';

      // optimistic thumbnail from the local file while the upload runs
      setLocalPreview({
        doc,
        uri: asset.uri,
        name: asset.name,
        isImage: mimeType.startsWith('image/') || isImageUrl(asset.uri),
      });

      await uploadAsset(doc, asset.uri, asset.name, mimeType);
    } catch (error: any) {
      toast.error(errorMessage(error, 'Document upload failed'));
      resetUploadState();
    }
  };

  const captureFromCamera = async (doc: string) => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission required', 'Camera access is needed to take a photo.');
        resetUploadState();
        return;
      }

      // Compressed on purpose: a raw full-size capture was large enough to be
      // rejected by the upload endpoint. expo-image-picker re-encodes before
      // resolving, so the capture takes a moment — the card is already marked
      // busy by startUpload() so the spinner is on screen when we come back.
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 0.8,
      });

      if (result.canceled || !result.assets?.[0]) {
        resetUploadState();
        return;
      }

      const asset = result.assets[0];
      const fileName = asset.fileName || `${doc.replace(/\s+/g, '_')}.jpg`;

      setLocalPreview({ doc, uri: asset.uri, name: fileName, isImage: true });

      await uploadAsset(doc, asset.uri, fileName, asset.mimeType || 'image/jpeg');
    } catch (error: any) {
      toast.error(errorMessage(error, 'Camera upload failed'));
      resetUploadState();
    }
  };

  // The native camera/file picker resolves only after it has written and
  // compressed the file, which takes a while. Marking the card busy before the
  // picker is launched means the spinner is already on screen the moment the
  // picker closes, instead of appearing seconds later.
  const startUpload = (doc: string, launch: (doc: string) => Promise<void>) => {
    setActiveDoc(doc);
    setIsLocalUploading(true);
    launch(doc);
  };

  const handleDocPress = (doc: string) => {
    if (isLocalUploading) return;

    setPendingDoc(doc);
    setShowUploadOptions(true);
  };

  const handleSkipUpload = async () => {
    if (!taxId) return;
    try {
      await skipUpload(taxId).unwrap();
      navigation.navigate('OrderPaymentStatus', { taxId });
    } catch (error: any) {
      toast.error(errorMessage(error, 'Failed to skip upload'));
    }
  };

  const handleSubmitStepTwo = async () => {
    if (!taxId) return;

    if (!stepTwoReady) {
      const missing = missingDocuments.join(', ');
      toast.error(
        missing
          ? `Upload required documents first: ${missing}`
          : 'Upload all required documents first'
      );
      return;
    }

    const documentIds = requiredDocuments.map((doc) => latestFileByType[doc]?._id).filter(Boolean);

    if (!documentIds.length) {
      toast.error('No uploaded document IDs found');
      return;
    }

    try {
      await uploadTaxStepTwoDocuments({ taxId, documentIds }).unwrap();
      navigation.navigate('OrderPaymentStatus', { taxId });
      try {
        await refetchOrder();
      } catch (_) {}
    } catch (error: any) {
      toast.error(errorMessage(error, 'Step 2 submission failed'));
    }
  };

  // ── render ───────────────────────────────────────────────────────────────────

  return (
    <ProtectedScreen>
      <View style={{ paddingTop: top, paddingBottom: bottom }} className="flex-1 bg-background">
        <View className="m-4 mt-0">
          <Text className="text-2xl font-bold tracking-tight text-foreground">
            Step 2: Documents
          </Text>
          <Text className="text-sm text-mutedForeground">
            Upload and submit the required tax documents.
          </Text>
        </View>
        <View className="flex-1 overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          {/* Card */}
          {/* Card header */}
          <View className="border-b border-border px-5 pb-3 pt-5">
            <Text className="text-base font-bold text-foreground">Required Documents</Text>
          </View>
          <ScrollView
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
            showsVerticalScrollIndicator={false}>
            {/* Header */}

            {/* Document grid */}
            <View className="flex-1 p-4">
              {requiredDocuments.length === 0 ? (
                <View className="items-center gap-2 py-10">
                  <ActivityIndicator color={colors.primary} />
                  <Text className="text-sm text-mutedForeground">Loading required documents…</Text>
                </View>
              ) : (
                <View className="flex-1 flex-row flex-wrap" style={{ margin: -6 }}>
                  {requiredDocuments.map((doc) => {
                    const file = latestFileByType[doc];
                    const fileUrl = file?.file;
                    const isImg = !!fileUrl && isImageUrl(fileUrl);
                    const isPdf = !!fileUrl && isPdfUrl(fileUrl);

                    return (
                      <DocumentCard
                        key={doc}
                        doc={doc}
                        file={file}
                        isUploading={isLocalUploading}
                        isActive={isLocalUploading && activeDoc === doc}
                        localPreview={localPreview?.doc === doc ? localPreview : null}
                        onPress={() => handleDocPress(doc)}
                        onReplace={() => handleDocPress(doc)}
                        onView={() =>
                          openPreview(
                            fileUrl,
                            file?.name || doc,
                            isImg ? 'image' : isPdf ? 'pdf' : 'other'
                          )
                        }
                      />
                    );
                  })}
                </View>
              )}

              {/* Missing notice */}
              {!stepTwoReady && missingDocuments.length > 0 && (
                <View className="mt-4 flex-row items-center gap-2 rounded-xl border border-warning/30 bg-warning/10 px-4 py-3">
                  <AlertCircle size={15} color={colors.warning} />
                  <Text className="flex-1 text-xs text-warning">
                    Missing: <Text className="font-semibold">{missingDocuments.join(', ')}</Text>
                  </Text>
                </View>
              )}

              {stepTwoReady && (
                <View className="mt-4 flex-row items-center gap-2 rounded-xl border border-success/30 bg-success/10 px-4 py-3">
                  <CheckCircle2 size={15} color={colors.success} />
                  <Text className="text-xs font-medium text-success">
                    All documents uploaded — ready to proceed!
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
        {/* Submit button */}
        <TouchableOpacity
          onPress={handleSubmitStepTwo}
          disabled={isSubmittingStepTwo || isFilesLoading || !stepTwoReady}
          className={[
            'mx-4 mt-3 flex-row items-center justify-center gap-2 rounded-2xl py-3',
            isSubmittingStepTwo || isFilesLoading || !stepTwoReady
              ? 'bg-primary/50'
              : 'bg-primary',
          ].join(' ')}
          activeOpacity={0.8}>
          {(isSubmittingStepTwo || isFilesLoading) && (
            <ActivityIndicator size="small" color="#fff" />
          )}
          <Text className="text-base font-bold text-white">
            {isSubmittingStepTwo ? 'Submitting…' : 'Go To Payment'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSkipUpload}
          disabled={isSkipping}
          className="mx-4 mt-2 flex-row items-center justify-center gap-2 rounded-2xl border border-border bg-card py-3"
          activeOpacity={0.7}>
          {isSkipping ? <ActivityIndicator size="small" color={colors.mutedForeground} /> : null}
          <Text className="text-sm font-semibold text-mutedForeground">
            {isSkipping ? 'Skipping…' : 'Upload File Later'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          className="mx-4 flex-row items-center justify-center gap-2 py-3">
          <ArrowLeft size={15} color={colors.primary} />
          <Text className="font-semibold text-primary">Back to Create Tax Order</Text>
        </TouchableOpacity>

        {/* Upload option modal */}
        <UploadOptionModal
          visible={showUploadOptions}
          doc={pendingDoc}
          onPickFromFiles={() => {
            setShowUploadOptions(false);
            startUpload(pendingDoc, pickFromFiles);
          }}
          onTakePhoto={() => {
            setShowUploadOptions(false);
            startUpload(pendingDoc, captureFromCamera);
          }}
          onCancel={() => {
            setShowUploadOptions(false);
            setPendingDoc('');
          }}
        />

        {/* Preview Modal */}
        <PreviewModal
          visible={isPreviewOpen}
          file={previewFile}
          onClose={() => setIsPreviewOpen(false)}
          onDownload={() => previewFile && downloadFile(previewFile.url, previewFile.name)}
          isDownloading={isDownloading}
        />
      </View>
    </ProtectedScreen>
  );
};

export default RequireDocumentsScreen;
