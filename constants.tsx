
import { CloudFile, SMSMessage } from './types';

export const APP_NAME = "SyncVault Pro";

export const MOCK_FILES: CloudFile[] = [
  {
    id: '1',
    name: 'Vacation_Maui.jpg',
    type: 'image',
    size: 2400000,
    createdAt: '2024-03-15T10:30:00Z',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
    url: '#',
    isSynced: true,
  },
  {
    id: '2',
    name: 'Work_Contract_2024.pdf',
    type: 'document',
    size: 1200000,
    createdAt: '2024-03-14T14:20:00Z',
    url: '#',
    isSynced: true,
  },
  {
    id: '3',
    name: 'Family_Dinner.mp4',
    type: 'video',
    size: 15400000,
    createdAt: '2024-03-12T09:15:00Z',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=400&q=80',
    url: '#',
    isSynced: false,
  },
  {
    id: '4',
    name: 'Profile_Main.png',
    type: 'image',
    size: 500000,
    createdAt: '2024-03-16T18:45:00Z',
    thumbnailUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    url: '#',
    isSynced: true,
  },
  {
    id: '5',
    name: 'Budget_Sheet_Q1.xlsx',
    type: 'document',
    size: 850000,
    createdAt: '2024-01-20T11:00:00Z',
    url: '#',
    isSynced: true,
  }
];

export const MOCK_SMS: SMSMessage[] = [
  { id: 's1', contact: 'Mom', content: 'Did you back up the photos?', timestamp: '2024-03-16T10:00:00Z', type: 'received' },
  { id: 's2', contact: 'John Smith', content: 'Sending the contract now.', timestamp: '2024-03-15T15:30:00Z', type: 'received' },
  { id: 's3', contact: 'Mom', content: 'Yes, just finished! Syncing everything now.', timestamp: '2024-03-16T10:05:00Z', type: 'sent' },
  { id: 's4', contact: 'Delivery', content: 'Your package has been delivered to the secure dropbox.', timestamp: '2024-03-14T08:00:00Z', type: 'received' },
];
