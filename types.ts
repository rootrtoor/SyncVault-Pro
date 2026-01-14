
export type FileType = 'image' | 'video' | 'document' | 'other';

export interface CloudFile {
  id: string;
  name: string;
  type: FileType;
  size: number;
  createdAt: string;
  thumbnailUrl?: string;
  url: string;
  isSynced: boolean;
}

export interface SMSMessage {
  id: string;
  contact: string;
  content: string;
  timestamp: string;
  type: 'received' | 'sent';
}

export interface SyncSettings {
  wifiOnly: boolean;
  autoBackup: boolean;
  syncPhotos: boolean;
  syncVideos: boolean;
  syncDocs: boolean;
  syncSMS: boolean;
  backupFrequency: 'hourly' | 'daily' | 'weekly';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  dropboxToken?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
  details: string;
}
