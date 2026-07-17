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
import { File, Directory, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import {
  FolderOpen,
  AlertCircle,
} from 'lucide-react-native';
import PreviewModal from '@/src/components/order/PreviewModal';
import ConfirmModal from '@/src/components/global/ConfirmModal';
import FileCard from '@/src/components/profile/FileCard';
// import RenameModal from '@/src/components/profile/RenameModal';
import ScreenHeader from '@/src/components/common/ScreenHeader';
import {
  useGetMyFilesQuery,
  // useUploadFileMutation,
  useDeleteFileMutation,
  // useUpdateFileMutation,
} from '@/src/services/fileApi';
// import { useGetMyOrdersQuery } from '@/src/services/orderApi';
import { IFile } from '@/src/types/filesTypes';
import { toPreviewFile } from '@/src/utils/fileHelpers';
import { toast } from '@/src/utils/ToastConfig';
import ProtectedScreen from '@/src/navigation/ProtectedScreen';

const EmptyState = () => (
  <View className="flex-1 items-center justify-center gap-3 px-8 py-16">
    <View className="mb-2 h-16 w-16 items-center justify-center rounded-full bg-muted">
      <FolderOpen size={28} color="hsl(0, 0%, 60%)" />
    </View>
    <Text className="text-center text-base font-bold text-foreground">No files yet</Text>
    <Text className="text-center text-sm text-mutedForeground">
      Upload your first file to get started.
    </Text>
  </View>
);

const MyFilesScreen = () => {
  const [selectedFile, setSelectedFile] = useState<IFile | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  // const [renameFile, setRenameFile] = useState<IFile | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IFile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { data, isLoading, error, refetch, isFetching } = useGetMyFilesQuery(undefined);
  const [deleteFile] = useDeleteFileMutation();
  // const [updateFile, { isLoading: isUpdating }] = useUpdateFileMutation();

  const files: IFile[] = data?.data ?? [];

  // const handleRename = useCallback(
  //   async (name: string) => {
  //     if (!renameFile || !name || name === renameFile.name) return;
  //     try {
  //       await updateFile({ id: renameFile._id, data: { name } }).unwrap();
  //       toast.success('File renamed successfully');
  //       setRenameFile(null);
  //     } catch (err: any) {
  //       const message =
  //         err?.data?.message || err?.data?.error || err?.message || 'Failed to rename file';
  //       toast.error(message);
  //     }
  //   },
  //   [renameFile, updateFile]
  // );

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

  // const handleRename = useCallback(
  //   async (name: string) => {
  //     if (!renameFile || !name || name === renameFile.name) return;
  //     try {
  //       await updateFile({ id: renameFile._id, data: { name } }).unwrap();
  //       toast.success('File renamed successfully');
  //       setRenameFile(null);
  //     } catch (err: any) {
  //       const message =
  //         err?.data?.message || err?.data?.error || err?.message || 'Failed to rename file';
  //       toast.error(message);
  //     }
  //   },
  //   [renameFile, updateFile]
  // );

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
    <ProtectedScreen>
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
              onRename={() => {}} // commented out
              isDeleting={deleteTarget?._id === item._id}
            />
          )}
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
        onDownload={() => downloadFile(selectedFile!.file, selectedFile!.name)}
        isDownloading={isDownloading}
      />

      {/*
      <RenameModal
        visible={!!renameFile}
        currentName={renameFile?.name ?? ''}
        isUpdating={isUpdating}
        onClose={() => setRenameFile(null)}
        onSave={handleRename}
      />
      */}

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
    </ProtectedScreen>
  );
};

export default MyFilesScreen;
