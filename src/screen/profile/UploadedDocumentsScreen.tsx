import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Image,
  Alert,
  Linking,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Directory, File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import {
  FileText,
  Download,
  Eye,
  X,
  ExternalLink,
  FolderOpen,
  Calendar,
  Hash,
  Tag,
  AlertCircle,
} from 'lucide-react-native';
import ScreenHeader from '@/src/components/common/ScreenHeader';
import { useGetMyFilesQuery } from '@/src/services/fileApi';

// ─── types ────────────────────────────────────────────────────────────────────

interface IFile {
  _id: string;
  name: string;
  type: string;
  userId: string;
  orderId: string;
  file: string;
  createdAt: string;
  updatedAt: string;
}

// ─── helpers ──────────────────────────────────────────────────────────────────

const isImageUrl = (url: string) => /\.(jpe?g|png|gif|webp|svg)(\?.*)?$/i.test(url);
const isPdfUrl = (url: string) => /\.pdf(\?.*)?$/i.test(url);

const getFileType = (url: string): 'image' | 'pdf' | 'other' => {
  if (isImageUrl(url)) return 'image';
  if (isPdfUrl(url)) return 'pdf';
  return 'other';
};

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-BD', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const shortenId = (id: string) => `…${id.slice(-8)}`;

const getExtension = (url: string) => {
  const match = url.split('?')[0].match(/\.([a-zA-Z0-9]+)$/);
  return match ? match[1].toUpperCase() : 'FILE';
};

// ─── Preview Modal ────────────────────────────────────────────────────────────

const PreviewModal = ({
  visible,
  file,
  onClose,
  onDownload,
  isDownloading,
}: {
  visible: boolean;
  file: IFile | null;
  onClose: () => void;
  onDownload: (url: string, name: string) => void;
  isDownloading: boolean;
}) => {
  if (!file) return null;

  const fileType = getFileType(file.file);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <View className="flex-1 bg-muted">
        {/* Header */}
        <View className="flex-row items-center justify-between border-b border-border px-4 pb-3 pt-6">
          <View className="mr-3 flex-1">
            <Text className="text-base font-bold text-foreground" numberOfLines={1}>
              {file.name}
            </Text>
            <Text className="mt-0.5 text-xs text-mutedForeground">{file.type}</Text>
          </View>
          <TouchableOpacity
            onPress={onClose}
            className="h-9 w-9 items-center justify-center rounded-full bg-destructive">
            <X size={25} color="white" />
          </TouchableOpacity>
        </View>

        {/* Preview area */}
        <View className="m-4 flex-1 items-center justify-center overflow-hidden rounded-2xl bg-muted">
          {fileType === 'image' ? (
            <Image source={{ uri: file.file }} className="h-full w-full" resizeMode="contain" />
          ) : fileType === 'pdf' ? (
            <View className="items-center gap-4 px-8">
              <View className="bg-destructive/15 h-20 w-20 items-center justify-center rounded-2xl">
                <FileText size={36} color="hsl(0, 83%, 49%)" />
              </View>
              <Text className="text-center text-sm font-semibold text-foreground">{file.name}</Text>
              <Text className="text-center text-xs text-mutedForeground">
                PDF preview is not available in-app.
              </Text>
              <TouchableOpacity
                onPress={() => Linking.openURL(file.file)}
                className="flex-row items-center gap-2 rounded-xl bg-primary px-5 py-3">
                <ExternalLink size={15} color="#fff" />
                <Text className="text-sm font-semibold text-primaryForeground">
                  Open in Browser
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="items-center gap-3 px-8">
              <FileText size={40} color="hsl(0, 0%, 60%)" />
              <Text className="text-center text-sm text-mutedForeground">
                Preview not available. Download to view.
              </Text>
            </View>
          )}
        </View>

        {/* File details */}
        <View className="mx-4 mb-4 gap-2.5 rounded-2xl border border-border bg-card px-4 py-3">
          <DetailRow
            icon={<Tag size={13} color="hsl(0, 0%, 60%)" />}
            label="Type"
            value={file.type}
          />
          <DetailRow
            icon={<Hash size={13} color="hsl(0, 0%, 60%)" />}
            label="File ID"
            value={shortenId(file._id)}
          />
          <DetailRow
            icon={<Hash size={13} color="hsl(0, 0%, 60%)" />}
            label="Order"
            value={shortenId(file.orderId)}
          />
          <DetailRow
            icon={<Calendar size={13} color="hsl(0, 0%, 60%)" />}
            label="Uploaded"
            value={formatDate(file.createdAt)}
          />
        </View>

        {/* Actions */}
        <View className="flex-row gap-3 px-4 pb-8">
          <TouchableOpacity
            onPress={onClose}
            className="flex-1 items-center rounded-2xl border border-border bg-card py-3.5">
            <Text className="text-sm font-semibold text-foreground">Close</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onDownload(file.file, file.name)}
            disabled={isDownloading}
            className={`flex-1 flex-row items-center justify-center gap-2 rounded-2xl py-3.5 ${
              isDownloading ? 'bg-primary/50' : 'bg-primary'
            }`}>
            {isDownloading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Download size={15} color="#fff" />
            )}
            <Text className="text-sm font-bold text-primaryForeground">
              {isDownloading ? 'Downloading…' : 'Download'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// ─── Detail Row ───────────────────────────────────────────────────────────────

const DetailRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <View className="flex-row items-center justify-between">
    <View className="flex-row items-center gap-1.5">
      {icon}
      <Text className="text-xs text-mutedForeground">{label}</Text>
    </View>
    <Text className="ml-4 flex-shrink text-xs font-semibold text-foreground" numberOfLines={1}>
      {value}
    </Text>
  </View>
);

// ─── File Card ────────────────────────────────────────────────────────────────

const FileCard = ({
  item,
  onPreview,
  onDownload,
  isDownloading,
  downloadingId,
}: {
  item: IFile;
  onPreview: () => void;
  onDownload: () => void;
  isDownloading: boolean;
  downloadingId: string | null;
}) => {
  const fileType = getFileType(item.file);
  const ext = getExtension(item.file);
  const isThisDownloading = isDownloading && downloadingId === item._id;

  return (
    <View className="mx-4 mb-3 overflow-hidden rounded-2xl border border-border bg-card">
      {/* Top: thumbnail + meta */}
      <View className="flex-row">
        {/* Thumbnail */}
        <View className="h-20 w-20 flex-shrink-0 items-center justify-center bg-muted">
          {fileType === 'image' ? (
            <Image source={{ uri: item.file }} className="h-full w-full" resizeMode="cover" />
          ) : fileType === 'pdf' ? (
            <View className="items-center gap-1">
              <FileText size={26} color="hsl(0, 83%, 49%)" />
              <Text className="text-[10px] font-bold text-destructive">PDF</Text>
            </View>
          ) : (
            <View className="items-center gap-1">
              <FileText size={26} color="hsl(0, 0%, 60%)" />
              <Text className="text-[10px] font-bold text-mutedForeground">{ext}</Text>
            </View>
          )}
        </View>

        {/* Meta */}
        <View className="flex-1 justify-center px-3 py-3">
          <Text className="mb-0.5 text-sm font-bold text-cardForeground" numberOfLines={1}>
            {item.name}
          </Text>
          <View className="mb-1 flex-row items-center gap-1">
            <Tag size={11} color="hsl(0, 0%, 60%)" />
            <Text className="text-xs text-mutedForeground" numberOfLines={1}>
              {item.type}
            </Text>
          </View>
          <View className="mb-1 flex-row items-center gap-1">
            <Calendar size={11} color="hsl(0, 0%, 60%)" />
            <Text className="text-xs text-mutedForeground">{formatDate(item.createdAt)}</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Hash size={11} color="hsl(0, 0%, 60%)" />
            <Text className="text-xs text-mutedForeground">Order {shortenId(item.orderId)}</Text>
          </View>
        </View>

        {/* File type badge */}
        <View className="pr-3 pt-3">
          <View
            className={`rounded-lg px-2 py-0.5 ${
              fileType === 'image'
                ? 'bg-primary/15'
                : fileType === 'pdf'
                  ? 'bg-destructive/15'
                  : 'bg-muted'
            }`}>
            <Text
              className={`text-[10px] font-bold ${
                fileType === 'image'
                  ? 'text-primary'
                  : fileType === 'pdf'
                    ? 'text-destructive'
                    : 'text-mutedForeground'
              }`}>
              {fileType === 'image' ? 'IMG' : fileType === 'pdf' ? 'PDF' : ext}
            </Text>
          </View>
        </View>
      </View>

      {/* Divider */}
      <View className="border-t border-border" />

      {/* Actions */}
      <View className="flex-row">
        <TouchableOpacity
          onPress={onPreview}
          activeOpacity={0.75}
          className="flex-1 flex-row items-center justify-center gap-2 border-r border-border py-3">
          <Eye size={15} color="hsl(125, 70%, 33%)" />
          <Text className="text-xs font-semibold text-primary">Preview</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onDownload}
          disabled={isThisDownloading}
          activeOpacity={0.75}
          className="flex-1 flex-row items-center justify-center gap-2 py-3">
          {isThisDownloading ? (
            <ActivityIndicator size="small" color="hsl(125, 70%, 33%)" />
          ) : (
            <Download size={15} color="hsl(125, 70%, 33%)" />
          )}
          <Text className="text-xs font-semibold text-primary">
            {isThisDownloading ? 'Downloading…' : 'Download'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyState = () => (
  <View className="flex-1 items-center justify-center gap-3 px-8 py-16">
    <View className="mb-2 h-16 w-16 items-center justify-center rounded-full bg-muted">
      <FolderOpen size={28} color="hsl(0, 0%, 60%)" />
    </View>
    <Text className="text-center text-base font-bold text-foreground">No documents yet</Text>
    <Text className="text-center text-sm text-mutedForeground">
      Uploaded documents from your tax orders will appear here.
    </Text>
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────

const UploadedDocumentsScreen = () => {
  const { top } = useSafeAreaInsets();
  const [selectedFile, setSelectedFile] = useState<IFile | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const { data, isLoading, error, refetch, isFetching } = useGetMyFilesQuery(undefined);
  const files: IFile[] = data?.data ?? [];

  // ── download ────────────────────────────────────────────────────────────────

  const downloadFile = async (url: string, name?: string, fileId?: string) => {
    try {
      setIsDownloading(true);
      if (fileId) setDownloadingId(fileId);

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
      setDownloadingId(null);
    }
  };

  const openPreview = (file: IFile) => {
    setSelectedFile(file);
    setPreviewVisible(true);
  };

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: top }}>
      <ScreenHeader
        title="My Documents"
        description={`${files.length} uploaded file${files.length !== 1 ? 's' : ''}`}
      />

      {isLoading ? (
        <View className="flex-1 items-center justify-center gap-3">
          <ActivityIndicator size="large" color="hsl(125, 70%, 33%)" />
          <Text className="text-sm text-mutedForeground">Loading documents…</Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center gap-4 px-8">
          <AlertCircle size={40} color="hsl(0, 83%, 49%)" />
          <Text className="text-center text-base font-bold text-foreground">
            Failed to load documents
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
              onDownload={() => downloadFile(item.file, item.name, item._id)}
              isDownloading={isDownloading}
              downloadingId={downloadingId}
            />
          )}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 8, flexGrow: 1 }}
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
        file={selectedFile}
        onClose={() => setPreviewVisible(false)}
        onDownload={(url, name) => downloadFile(url, name, selectedFile?._id)}
        isDownloading={isDownloading && downloadingId === selectedFile?._id}
      />
    </View>
  );
};

export default UploadedDocumentsScreen;
