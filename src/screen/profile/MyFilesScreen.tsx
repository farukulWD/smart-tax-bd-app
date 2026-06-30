import { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { File, Directory, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import {
  Upload,
  FolderOpen,
  AlertCircle,
} from 'lucide-react-native';
import PreviewModal from '@/src/components/order/PreviewModal';
import ConfirmModal from '@/src/components/global/ConfirmModal';
import FileCard from '@/src/components/profile/FileCard';
import RenameModal from '@/src/components/profile/RenameModal';
import ScreenHeader from '@/src/components/common/ScreenHeader';
import {
  useGetMyFilesQuery,
  useUploadFileMutation,
  useDeleteFileMutation,
  useUpdateFileMutation,
} from '@/src/services/fileApi';
import { useGetMyOrdersQuery } from '@/src/services/orderApi';
import { IFile } from '@/src/types/filesTypes';
import { toPreviewFile } from '@/src/utils/fileHelpers';
import { toast } from '@/src/utils/ToastConfig';

const EmptyState = ({ onUpload }: { onUpload: () => void }) => (
  <View className="flex-1 items-center justify-center gap-3 px-8 py-16">
    <View className="mb-2 h-16 w-16 items-center justify-center rounded-full bg-muted">
      <FolderOpen size={28} color="hsl(0, 0%, 60%)" />
    </View>
    <Text className="text-center text-base font-bold text-foreground">No files yet</Text>
    <Text className="text-center text-sm text-mutedForeground">
      Upload your first file to get started.
    </Text>
    <TouchableOpacity
      onPress={onUpload}
      className="mt-2 flex-row items-center gap-2 rounded-2xl bg-primary px-6 py-3"
      activeOpacity={0.85}>
      <Upload size={16} color="#fff" />
      <Text className="font-semibold text-primaryForeground">Upload File</Text>
    </TouchableOpacity>
  </View>
);

const MyFilesScreen = () => {
  const [selectedFile, setSelectedFile] = useState<IFile | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [renameFile, setRenameFile] = useState<IFile | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IFile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const { data, isLoading, error, refetch, isFetching } = useGetMyFilesQuery(undefined);
  const { data: ordersData } = useGetMyOrdersQuery(undefined);
  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();
  const [deleteFile] = useDeleteFileMutation();
  const [updateFile, { isLoading: isUpdating }] = useUpdateFileMutation();

  const files: IFile[] = data?.data ?? [];

  const handleUpload = useCallback(async () => {
    if (isUploading) return;

    const orders = ordersData?.data ?? [];
    const orderId = orders.length > 0 ? orders[0]._id : null;

    if (!orderId) {
      toast.error('No order found. Please create an order first.');
      return;
    }

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets?.[0]) return;

      const asset = result.assets[0];

      const formData = new FormData();
      formData.append(
        'data',
        JSON.stringify({
          name: asset.name.replace(/\.[^/.]+$/, ''),
          type: asset.mimeType?.split('/')[1] || 'file',
          orderId,
        })
      );
      formData.append('file', {
        uri: asset.uri,
        name: asset.name,
        type: asset.mimeType || 'application/octet-stream',
      } as any);

      await uploadFile(formData).unwrap();
      toast.success('File uploaded successfully');
    } catch (err: any) {
      const message =
        err?.data?.message || err?.data?.error || err?.message || 'File upload failed';
      toast.error(message);
    }
  }, [isUploading, uploadFile, ordersData]);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteFile(deleteTarget._id).unwrap();
      toast.success('File deleted successfully');
      setDeleteTarget(null);
    } catch (err: any) {
      const message =
        err?.data?.message || err?.data?.error || err?.message || 'Failed to delete file';
      toast.error(message);
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  }, [deleteTarget, deleteFile]);

  const handleCancelDelete = useCallback(() => {
    setDeleteTarget(null);
  }, []);

  const handleRename = useCallback(
    async (name: string) => {
      if (!renameFile || !name || name === renameFile.name) return;

      try {
        await updateFile({ id: renameFile._id, data: { name } }).unwrap();
        toast.success('File renamed successfully');
        setRenameFile(null);
      } catch (err: any) {
        const message =
          err?.data?.message || err?.data?.error || err?.message || 'Failed to rename file';
        toast.error(message);
      }
    },
    [renameFile, updateFile]
  );

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

  const openPreview = (file: IFile) => {
    setSelectedFile(file);
    setPreviewVisible(true);
  };

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="My Files" />

      {isLoading ? (
        <View className="flex-1 items-center justify-center gap-3">
          <ActivityIndicator size="large" color="hsl(125, 70%, 33%)" />
          <Text className="text-sm text-mutedForeground">Loading files\u2026</Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center gap-4 px-8">
          <AlertCircle size={40} color="hsl(0, 83%, 49%)" />
          <Text className="text-center text-base font-bold text-foreground">
            Failed to load files
          </Text>
          <TouchableOpacity onPress={refetch} className="rounded-2xl bg-primary px-6 py-3">
            <Text className="font-semibold text-primaryForeground">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={files}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <FileCard
              item={item}
              onPreview={() => openPreview(item)}
              onDelete={() => setDeleteTarget(item)}
              onRename={() => setRenameFile(item)}
              isDeleting={deleteTarget?._id === item._id}
            />
          )}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 100, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<EmptyState onUpload={handleUpload} />}
          refreshControl={
            <RefreshControl
              refreshing={isFetching && !isLoading}
              onRefresh={refetch}
              tintColor="hsl(125, 70%, 33%)"
            />
          }
        />
      )}

      {files.length > 0 && (
        <TouchableOpacity
          onPress={handleUpload}
          disabled={isUploading}
          activeOpacity={0.85}
          className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
            elevation: 8,
          }}>
          {isUploading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Upload size={22} color="#fff" />
          )}
        </TouchableOpacity>
      )}

      <PreviewModal
        visible={previewVisible}
        file={selectedFile ? toPreviewFile(selectedFile) : null}
        onClose={() => setPreviewVisible(false)}
        onDownload={() => downloadFile(selectedFile!.file, selectedFile!.name)}
        isDownloading={isDownloading}
      />

      <RenameModal
        visible={!!renameFile}
        currentName={renameFile?.name ?? ''}
        isUpdating={isUpdating}
        onClose={() => setRenameFile(null)}
        onSave={handleRename}
      />

      <ConfirmModal
        visible={!!deleteTarget}
        title="Delete File"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        destructive
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </View>
  );
};

export default MyFilesScreen;
