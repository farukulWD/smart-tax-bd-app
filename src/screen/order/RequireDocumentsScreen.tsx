'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import AppText from '@/src/components/common/AppText';
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
import { logger } from '@/src/utils/logger';

type LocalPreview = { doc: string; uri: string; name: string; isImage: boolean };

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
  const { t } = useTranslation();
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
  const isPaymentBusy = isSubmittingStepTwo || isSkipping || isFilesLoading;

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
        toast.success(t('documents.downloadComplete'));
      }
    } catch (err: any) {
      logger.log('err', JSON.stringify(err, null, 2));
      toast.error(err?.message || t('documents.downloadFailed'));
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
      toast.success(t('documents.uploaded', { doc }));
      try {
        await refetchMyFiles();
      } catch (_) {}
      try {
        await refetchOrder();
      } catch (_) {}
    } catch (error: any) {
      logger.log('upload error', JSON.stringify(error, null, 2));
      toast.error(errorMessage(error, t('documents.uploadFailed')));
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

      setLocalPreview({
        doc,
        uri: asset.uri,
        name: asset.name,
        isImage: mimeType.startsWith('image/') || isImageUrl(asset.uri),
      });

      await uploadAsset(doc, asset.uri, asset.name, mimeType);
    } catch (error: any) {
      toast.error(errorMessage(error, t('documents.documentUploadFailed')));
      resetUploadState();
    }
  };

  const captureFromCamera = async (doc: string) => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(t('documents.permissionRequired'), t('documents.cameraPermissionMessage'));
        resetUploadState();
        return;
      }

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
      toast.error(errorMessage(error, t('documents.cameraUploadFailed')));
      resetUploadState();
    }
  };

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

  const handleBackToCreateOrder = () => {
    const hasCreateOrderScreen = navigation
      .getState()
      ?.routes?.some((r: { name: string }) => r.name === 'CreateTaxOrder');

    if (hasCreateOrderScreen) navigation.popTo('CreateTaxOrder');
    else navigation.goBack();
  };

  const handleSkipUpload = async () => {
    if (!taxId) return;
    try {
      await skipUpload(taxId).unwrap();
      navigation.navigate('OrderPaymentStatus', { taxId });
    } catch (error: any) {
      toast.error(errorMessage(error, t('documents.skipFailed')));
    }
  };

  const handleSubmitStepTwo = async () => {
    if (!taxId) return;

    if (!stepTwoReady) {
      const missing = missingDocuments.join(', ');
      if (missing) toast.warning(t('documents.uploadMissingLater', { missing }));
      await handleSkipUpload();
      return;
    }

    const documentIds = requiredDocuments.map((doc) => latestFileByType[doc]?._id).filter(Boolean);

    if (!documentIds.length) {
      toast.error(t('documents.noDocumentIds'));
      return;
    }

    try {
      await uploadTaxStepTwoDocuments({ taxId, documentIds }).unwrap();
      navigation.navigate('OrderPaymentStatus', { taxId });
      try {
        await refetchOrder();
      } catch (_) {}
    } catch (error: any) {
      toast.error(errorMessage(error, t('documents.submitFailed')));
    }
  };

  return (
    <ProtectedScreen>
      <View style={{ paddingTop: top, paddingBottom: bottom }} className="flex-1 bg-background">
        <View className="m-4 mt-2">
          <AppText className="text-2xl font-bold tracking-tight text-foreground">
            {t('documents.stepTitle')}
          </AppText>
          <AppText className="text-sm text-mutedForeground">
            {t('documents.stepDescription')}
          </AppText>
        </View>
        <View className="mx-4 flex-1 overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <View className="border-b border-border p-4 pb-3">
            <AppText className="text-base font-bold text-foreground">
              {t('documents.cardTitle')}
            </AppText>
          </View>
          <ScrollView
            contentContainerStyle={{
              paddingVertical: 16,
            }}
            showsVerticalScrollIndicator={false}>
            <View className="mx-4 flex-1">
              {requiredDocuments.length === 0 ? (
                <View className="items-center gap-2 py-10">
                  <ActivityIndicator color={colors.primary} />
                  <AppText className="text-sm text-mutedForeground">
                    {t('documents.loading')}
                  </AppText>
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

              {!stepTwoReady && missingDocuments.length > 0 && (
                <View className="mt-4 flex-row items-center gap-2 rounded-xl border border-warning/30 bg-warning/10 px-4 py-3">
                  <AlertCircle size={15} color={colors.warning} />
                  <AppText className="flex-1 text-xs text-warning">
                    {t('documents.missing')}
                    <AppText className="font-semibold">{missingDocuments.join(', ')}</AppText>
                    {'\n'}
                    {t('documents.missingHint')}
                  </AppText>
                </View>
              )}

              {stepTwoReady && (
                <View className="mt-4 flex-row items-center gap-2 rounded-xl border border-success/30 bg-success/10 px-4 py-3">
                  <CheckCircle2 size={15} color={colors.success} />
                  <AppText className="text-xs font-medium text-success">
                    {t('documents.allUploaded')}
                  </AppText>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
        <TouchableOpacity
          onPress={handleSubmitStepTwo}
          disabled={isPaymentBusy || requiredDocuments.length === 0}
          className={[
            'mx-4 mt-3 h-10 flex-row items-center justify-center gap-2 rounded-2xl',
            isPaymentBusy || requiredDocuments.length === 0 ? 'bg-primary/50' : 'bg-primary',
          ].join(' ')}
          activeOpacity={0.8}>
          {isPaymentBusy && <ActivityIndicator size="small" color="#fff" />}
          <AppText className="text-base font-bold text-white">
            {isSubmittingStepTwo || isSkipping
              ? t('documents.submitting')
              : t('documents.goToPayment')}
          </AppText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSkipUpload}
          disabled={isSkipping}
          className="mx-4 mt-2 h-10 flex-row items-center justify-center gap-2 rounded-2xl border border-border bg-card"
          activeOpacity={0.7}>
          {isSkipping ? <ActivityIndicator size="small" color={colors.mutedForeground} /> : null}
          <AppText className="text-sm font-semibold text-mutedForeground">
            {isSkipping ? t('documents.skipping') : t('documents.uploadLater')}
          </AppText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleBackToCreateOrder}
          activeOpacity={0.7}
          className="mx-4 flex-row items-center justify-center gap-2 py-3">
          <ArrowLeft size={15} color={colors.primary} />
          <AppText className="font-semibold text-primary">
            {t('documents.backToCreateOrder')}
          </AppText>
        </TouchableOpacity>

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
