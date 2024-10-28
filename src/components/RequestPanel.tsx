import React, { useState } from 'react';
import { Send } from 'lucide-react';
import Editor from '@monaco-editor/react';

interface RequestPanelProps {
  onSend: (request: any) => void;
  request: {
    method: string;
    url: string;
    headers: Record<string, string>;
    body: string;
  };
  setRequest: React.Dispatch<React.SetStateAction<any>>;
}

export default function RequestPanel({ onSend, request, setRequest }: RequestPanelProps) {
  const [activeTab, setActiveTab] = useState('body');

  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center gap-2 p-4 border-b">
        <select
          value={request.method}
          onChange={(e) => setRequest({ ...request, method: e.target.value })}
          className="px-3 py-2 border rounded-md bg-white text-gray-800 font-medium"
        >
          {methods.map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={request.url}
          onChange={(e) => setRequest({ ...request, url: e.target.value })}
          placeholder="Enter request URL"
          className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => onSend(request)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Send size={18} />
          Send
        </button>
      </div>

      <div className="flex border-b">
        <button
          className={`px-4 py-2 ${
            activeTab === 'body' ? 'border-b-2 border-blue-500' : ''
          }`}
          onClick={() => setActiveTab('body')}
        >
          Body
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === 'headers' ? 'border-b-2 border-blue-500' : ''
          }`}
          onClick={() => setActiveTab('headers')}
        >
          Headers
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'body' ? (
          <Editor
            height="100%"
            defaultLanguage="json"
            value={request.body}
            onChange={(value) => setRequest({ ...request, body: value || '' })}
            theme="vs-light"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: 'on',
            }}
          />
        ) : (
          <div className="p-4">
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(request.headers).map(([key, value], index) => (
                <React.Fragment key={index}>
                  <input
                    type="text"
                    value={key}
                    onChange={(e) => {
                      const newHeaders = { ...request.headers };
                      delete newHeaders[key];
                      newHeaders[e.target.value] = value;
                      setRequest({ ...request, headers: newHeaders });
                    }}
                    placeholder="Header"
                    className="px-3 py-2 border rounded-md"
                  />
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => {
                      setRequest({
                        ...request,
                        headers: {
                          ...request.headers,
                          [key]: e.target.value,
                        },
                      });
                    }}
                    placeholder="Value"
                    className="px-3 py-2 border rounded-md"
                  />
                </React.Fragment>
              ))}
            </div>
            <button
              onClick={() =>
                setRequest({
                  ...request,
                  headers: {
                    ...request.headers,
                    '': '',
                  },
                })
              }
              className="mt-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-700"
            >
              + Add Header
            </button>
          </div>
        )}
      </div>
    </div>
  );
}