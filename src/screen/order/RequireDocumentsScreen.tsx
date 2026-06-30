'use client';

import { useEffect, useRef, useState } from 'react';
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

const RequireDocumentsScreen = () => {
  const route = useRoute<RouteProp<AppStackParamList, 'RequireDocuments'>>();
  const navigation = useNavigation<any>();
  const taxId = route.params?.taxId;
  const { top, bottom } = useSafeAreaInsets();

  const uploadingDocRef = useRef('');
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
      uploadingDocRef.current = '';
      toast.success(`${doc} uploaded`);
      try {
        await refetchMyFiles();
      } catch (_) {}
      try {
        await refetchOrder();
      } catch (_) {}
    } catch (error: any) {
      const message =
        error?.data?.message || error?.data?.error || error?.message || 'Upload failed';
      toast.error(message);
    } finally {
      setIsLocalUploading(false);
    }
  };

  const pickFromFiles = async (doc: string) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets?.[0]) return;

      const asset = result.assets[0];
      await uploadAsset(doc, asset.uri, asset.name, asset.mimeType || 'application/octet-stream');
    } catch (error: any) {
      const message =
        error?.data?.message || error?.data?.error || error?.message || 'Document upload failed';
      toast.error(message);
    }
  };

  const captureFromCamera = async (doc: string) => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission required', 'Camera access is needed to take a photo.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 0.8,
      });

      if (result.canceled || !result.assets?.[0]) return;

      const asset = result.assets[0];
      const fileName = asset.fileName || `${doc.replace(/\s+/g, '_')}.jpg`;
      await uploadAsset(doc, asset.uri, fileName, asset.mimeType || 'image/jpeg');
    } catch (error: any) {
      const message =
        error?.data?.message || error?.data?.error || error?.message || 'Camera upload failed';
      toast.error(message);
    }
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
      const message =
        error?.data?.message || error?.data?.error || error?.message || 'Failed to skip upload';
      toast.error(message);
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
      const message =
        error?.data?.message || error?.data?.error || error?.message || 'Step 2 submission failed';
      toast.error(message);
    }
  };

  // ── render ───────────────────────────────────────────────────────────────────

  return (
    <ProtectedScreen redirectTo={{ screen: 'CreateTaxOrder' }}>
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
                  <ActivityIndicator color="#6366f1" />
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
                        isActive={isLocalUploading && uploadingDocRef.current === doc}
                        onPress={() => handleDocPress(doc)}
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
                <View className="mt-4 flex-row items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                  <AlertCircle size={15} color="#d97706" />
                  <Text className="flex-1 text-xs text-amber-700">
                    Missing: <Text className="font-semibold">{missingDocuments.join(', ')}</Text>
                  </Text>
                </View>
              )}

              {stepTwoReady && (
                <View className="mt-4 flex-row items-center gap-2 rounded-xl border border-green-500 bg-green-50/20 px-4 py-3">
                  <CheckCircle2 size={15} color="#16a34a" />
                  <Text className="text-xs font-medium text-green-500">
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
              ? 'bg-indigo-300'
              : 'bg-indigo-600',
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
          {isSkipping ? <ActivityIndicator size="small" color="hsl(0, 0%, 60%)" /> : null}
          <Text className="text-sm font-semibold text-mutedForeground">
            {isSkipping ? 'Skipping…' : 'Upload File Later'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          className="mx-4 flex-row items-center justify-center gap-2 py-3">
          <ArrowLeft size={15} color="#6366f1" />
          <Text className="font-semibold text-indigo-600">Back to Create Tax Order</Text>
        </TouchableOpacity>

        {/* Upload option modal */}
        <UploadOptionModal
          visible={showUploadOptions}
          doc={pendingDoc}
          onPickFromFiles={() => {
            setShowUploadOptions(false);
            uploadingDocRef.current = pendingDoc;
            pickFromFiles(pendingDoc);
          }}
          onTakePhoto={() => {
            setShowUploadOptions(false);
            uploadingDocRef.current = pendingDoc;
            captureFromCamera(pendingDoc);
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
