import { useEffect, useState } from 'react';
import Split from 'react-split';
import { Toaster, toast } from 'react-hot-toast';
import { supabase, type Request } from './lib/supabase';
import Sidebar from './components/Sidebar';
import RequestPanel from './components/RequestPanel';
import ResponsePanel from './components/ResponsePanel';
import { Terminal } from 'lucide-react';

export default function App() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [currentRequest, setCurrentRequest] = useState({
    method: 'GET',
    url: '',
    headers: {},
    body: '',
  });
  const [response, setResponse] = useState<any>(null);

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests() {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load requests');
      return;
    }

    setRequests(data || []);
  }

  async function handleSave(name: string) {
    const { data, error } = await supabase.from('requests').insert([
      {
        name,
        ...currentRequest,
      },
    ]);

    if (error) {
      toast.error('Failed to save request');
      return;
    }

    toast.success('Request saved');
    loadRequests();
  }

  async function handleSend(request: typeof currentRequest) {
    try {
      setResponse(null);
      const headers = new Headers(request.headers);
      
      const response = await fetch(request.url, {
        method: request.method,
        headers,
        body: request.method !== 'GET' ? request.body : undefined,
      });

      const data = await response.json();
      
      setResponse({
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers),
        data,
      });
    } catch (error) {
      toast.error('Request failed');
      setResponse({
        status: 0,
        statusText: 'Error',
        data: { error: (error as Error).message },
      });
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <Terminal size={24} className="text-blue-600" />
          <h1 className="text-xl font-bold">API Client</h1>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        <Split
          sizes={[20, 80]}
          minSize={200}
          expandToMin={false}
          gutterSize={8}
          gutterAlign="center"
          snapOffset={30}
          dragInterval={1}
          direction="horizontal"
          className="flex h-full"
        >
          <Sidebar
            requests={requests}
            onSelect={setSelectedRequest}
            onSave={handleSave}
            selectedId={selectedRequest?.id}
          />
          
          <Split
            sizes={[50, 50]}
            minSize={200}
            expandToMin={false}
            gutterSize={8}
            gutterAlign="center"
            snapOffset={30}
            dragInterval={1}
            direction="vertical"
            className="flex flex-col overflow-hidden"
          >
            <RequestPanel
              request={currentRequest}
              setRequest={setCurrentRequest}
              onSend={handleSend}
            />
            <ResponsePanel response={response} />
          </Split>
        </Split>
      </div>
      
      <Toaster position="bottom-right" />
    </div>
  );
}