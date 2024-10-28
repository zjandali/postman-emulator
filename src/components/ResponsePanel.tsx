import Editor from '@monaco-editor/react';

interface ResponsePanelProps {
  response: {
    status?: number;
    statusText?: string;
    data?: any;
    headers?: Record<string, string>;
  } | null;
}

export default function ResponsePanel({ response }: ResponsePanelProps) {
  if (!response) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Send a request to see the response
      </div>
    );
  }

  const formattedResponse = JSON.stringify(response.data, null, 2);

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex items-center gap-2 p-4 border-b">
        <span
          className={`px-2 py-1 rounded-md text-sm font-medium ${
            response.status && response.status < 400
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {response.status} {response.statusText}
        </span>
      </div>
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage="json"
          value={formattedResponse}
          theme="vs-light"
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: 'on',
          }}
        />
      </div>
    </div>
  );
}