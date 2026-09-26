import { useState, useCallback, useMemo } from 'react';
import {
  View,
  SectionList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import AppText from '@/src/components/common/AppText';
import { File, Directory, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { FileCheck, FolderOpen, AlertCircle, Eye, Download, Calendar } from 'lucide-react-native';
import PreviewModal from '@/src/components/order/PreviewModal';
import ScreenHeader from '@/src/components/common/ScreenHeader';
import { useGetMyTaxDocumentsQuery } from '@/src/services/fileApi';
import { ITaxDocument } from '@/src/types/filesTypes';
import { formatDate, toPreviewFile } from '@/src/utils/fileHelpers';
import ProtectedScreen from '@/src/navigation/ProtectedScreen';
import { getApiErrorMessage } from '@/src/services/globalErrorHandler';

const EmptyState = () => (
  <View className="flex-1 items-center justify-center gap-3 px-8 py-16">
    <View className="mb-2 h-16 w-16 items-center justify-center rounded-full bg-muted">
      <FolderOpen size={28} color="hsl(0, 0%, 60%)" />
    </View>
    <AppText className="text-center text-base font-bold text-foreground">
      No tax documents yet
    </AppText>
    <AppText className="text-center text-sm text-mutedForeground">
      Once your return is filed, your acknowledgement and tax certificate will appear here.
    </AppText>
  </View>
);

const TaxDocumentCard = ({
  item,
  onPreview,
  onDownload,
}: {
  item: ITaxDocument;
  onPreview: () => void;
  onDownload: () => void;
}) => (
  <View className="mx-4 mb-3 overflow-hidden rounded-2xl border border-border bg-card">
    <View className="border-l-4 border-l-secondary">
      <View className="flex-row items-center gap-3 p-4 pb-3">
        <View className="h-14 w-14 items-center justify-center rounded-xl bg-secondary/10">
          <FileCheck size={24} color="hsl(131, 56%, 33%)" />
        </View>
        <View className="flex-1 gap-1">
          <AppText className="text-15 font-bold text-cardForeground" numberOfLines={1}>
            {item.name}
          </AppText>
          <View className="flex-row">
            <View className="rounded-full bg-secondary/15 px-2 py-px">
              <AppText className="text-10 font-bold text-secondary">{item.type}</AppText>
            </View>
          </View>
          <View className="flex-row items-center gap-1">
            <Calendar size={11} color="hsl(0, 0%, 60%)" />
            <AppText className="text-xs text-mutedForeground">{formatDate(item.createdAt)}</AppText>
          </View>
        </View>
      </View>
    </View>

    <View className="border-t border-border" />

    <View className="flex-row">
      <TouchableOpacity
        onPress={onPreview}
        activeOpacity={0.7}
        className="flex-1 flex-row items-center justify-center gap-2 border-r border-border py-3.5">
        <Eye size={15} color="hsl(131, 56%, 33%)" />
        <AppText className="text-xs font-semibold text-secondary">Preview</AppText>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onDownload}
        activeOpacity={0.7}
        className="flex-1 flex-row items-center justify-center gap-2 py-3.5">
        <Download size={15} color="hsl(125, 70%, 33%)" />
        <AppText className="text-xs font-semibold text-primary">Download</AppText>
      </TouchableOpacity>
    </View>
  </View>
);

const TaxDocumentsScreen = () => {
  const [selectedFile, setSelectedFile] = useState<ITaxDocument | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { data, isLoading, error, refetch, isFetching } = useGetMyTaxDocumentsQuery(undefined);

  const errorMessage = getApiErrorMessage(error);

  // Group by the order's tax year so each filed return reads as one set.
  const sections = useMemo(() => {
    const groups = new Map<string, ITaxDocument[]>();
    for (const doc of data?.data ?? []) {
      const key = doc.orderId?.tax_year ?? '';
      groups.set(key, [...(groups.get(key) ?? []), doc]);
    }
    return Array.from(groups.entries()).map(([taxYear, docs]) => ({
      title: taxYear ? `Tax Year ${taxYear}` : 'Other Documents',
      data: docs,
    }));
  }, [data]);

  const downloadFile = useCallback(async (url: string, name?: string) => {
    try {
      setIsDownloading(true);

      const uniqueName = `${Date.now()}_${name || 'download'}`;
      const destination = new Directory(Paths.cache, uniqueName);
      destination.create();

      const { uri } = await File.downloadFileAsync(url, destination, {});

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { dialogTitle: name || uniqueName });
      } else {
        Alert.alert('Download complete', `Saved to: ${uri}`);
      }
    } catch (err: any) {
      Alert.alert('Download failed', err?.message || 'Unknown error');
    } finally {
      setIsDownloading(false);
    }
  }, []);

  const openPreview = (file: ITaxDocument) => {
    setSelectedFile(file);
    setPreviewVisible(true);
  };

  return (
    <ProtectedScreen>
      <View className="flex-1 bg-background">
        <ScreenHeader title="Tax Documents" />

        {isLoading ? (
          <View className="flex-1 items-center justify-center gap-3">
            <ActivityIndicator size="large" color="hsl(125, 70%, 33%)" />
            <AppText className="text-sm text-mutedForeground">Loading documents…</AppText>
          </View>
        ) : error ? (
          <View className="flex-1 items-center justify-center gap-4 px-8">
            <AlertCircle size={40} color="hsl(0, 83%, 49%)" />
            <AppText className="text-center text-base font-bold text-foreground">
              Failed to load documents
            </AppText>
            {!!errorMessage && (
              <AppText className="text-center text-sm text-mutedForeground">{errorMessage}</AppText>
            )}
            <TouchableOpacity
              onPress={() => refetch()}
              className="h-10 items-center justify-center rounded-2xl bg-primary px-6">
              <AppText className="font-semibold text-primaryForeground">Retry</AppText>
            </TouchableOpacity>
          </View>
        ) : (
          <SectionList
            sections={sections}
            keyExtractor={(item) => item._id}
            renderSectionHeader={({ section }) => (
              <AppText className="mx-4 mb-2 mt-4 text-xs font-bold uppercase tracking-wider text-mutedForeground">
                {section.title}
              </AppText>
            )}
            renderItem={({ item }) => (
              <TaxDocumentCard
                item={item}
                onPreview={() => openPreview(item)}
                onDownload={() => downloadFile(item.file, item.name)}
              />
            )}
            stickySectionHeadersEnabled={false}
            contentContainerStyle={{ paddingTop: 8, paddingBottom: 100, flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<EmptyState />}
            refreshControl={
              <RefreshControl
                refreshing={isFetching && !isLoading}
                onRefresh={refetch}
                tintColor="hsl(125, 70%, 33%)"
              />
            }
          />
        )}

        <PreviewModal
          visible={previewVisible}
          file={selectedFile ? toPreviewFile(selectedFile) : null}
          onClose={() => setPreviewVisible(false)}
          onDownload={() => selectedFile && downloadFile(selectedFile.file, selectedFile.name)}
          isDownloading={isDownloading}
        />
      </View>
    </ProtectedScreen>
  );
};

export default TaxDocumentsScreen;
