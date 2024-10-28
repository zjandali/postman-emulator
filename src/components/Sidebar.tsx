import { useState } from 'react';
import { FolderOpen, Plus, Save } from 'lucide-react';
import { Request } from '../lib/supabase';

interface SidebarProps {
  requests: Request[];
  onSelect: (request: Request) => void;
  onSave: (name: string) => void;
  selectedId?: string;
}

export default function Sidebar({ requests, onSelect, onSave, selectedId }: SidebarProps) {
  const [newRequestName, setNewRequestName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleSave = () => {
    if (newRequestName.trim()) {
      onSave(newRequestName.trim());
      setNewRequestName('');
      setIsCreating(false);
    }
  };

  return (
    <div className="w-64 bg-gray-50 border-r flex flex-col h-full">
      <div className="p-4 border-b">
        <button
          onClick={() => setIsCreating(true)}
          className="w-full flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          New Request
        </button>
      </div>

      {isCreating && (
        <div className="p-4 border-b">
          <input
            type="text"
            value={newRequestName}
            onChange={(e) => setNewRequestName(e.target.value)}
            placeholder="Request name"
            className="w-full px-3 py-2 border rounded-md mb-2"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <Save size={16} />
              Save
            </button>
            <button
              onClick={() => setIsCreating(false)}
              className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {requests.map((request) => (
          <button
            key={request.id}
            onClick={() => onSelect(request)}
            className={`w-full flex items-center gap-2 p-4 hover:bg-gray-100 text-left ${
              selectedId === request.id ? 'bg-gray-100' : ''
            }`}
          >
            <FolderOpen
              size={18}
              className={selectedId === request.id ? 'text-blue-600' : 'text-gray-500'}
            />
            <div className="flex-1 truncate">
              <span className="font-medium">{request.name}</span>
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <span className="font-mono">{request.method}</span>
                <span className="truncate">{request.url}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}