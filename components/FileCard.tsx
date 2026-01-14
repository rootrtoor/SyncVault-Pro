
import React from 'react';
import { CloudFile } from '../types';
import { FileText, Film, Image, MoreVertical, CheckCircle2, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface FileCardProps {
  file: CloudFile;
}

const FileCard: React.FC<FileCardProps> = ({ file }) => {
  const getIcon = () => {
    switch (file.type) {
      case 'image': return <Image className="text-blue-500 w-5 h-5" />;
      case 'video': return <Film className="text-purple-500 w-5 h-5" />;
      case 'document': return <FileText className="text-orange-500 w-5 h-5" />;
      default: return <FileText className="text-slate-500 w-5 h-5" />;
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer">
      <div className="relative aspect-video bg-slate-50 flex items-center justify-center overflow-hidden">
        {file.thumbnailUrl ? (
          <img 
            src={file.thumbnailUrl} 
            alt={file.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
          />
        ) : (
          <div className="bg-slate-100 p-4 rounded-full">
            {getIcon()}
          </div>
        )}
        
        <div className="absolute top-2 right-2">
          {file.isSynced ? (
            <div className="bg-white/90 backdrop-blur rounded-full p-1 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            </div>
          ) : (
            <div className="bg-white/90 backdrop-blur rounded-full p-1 shadow-sm">
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-sm font-semibold text-slate-800 truncate flex-1" title={file.name}>
            {file.name}
          </h3>
          <button className="text-slate-400 hover:text-slate-600 transition-colors">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>{formatSize(file.size)}</span>
          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
          <span>{format(new Date(file.createdAt), 'MMM d, yyyy')}</span>
        </div>
      </div>
    </div>
  );
};

export default FileCard;
