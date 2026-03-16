import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getReceivedApplications } from '../../api/applications';
import { getChatRoom, sendMessage, markRead } from '../../api/chat';
import { useAuth } from '../../context/AuthContext';

export default function OwnerChat() {
  const [apps, setApps]         = useState([]);
  const [selectedApp, setSelect] = useState(null);
  const [room, setRoom]         = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText]         = useState('');
  const [loading, setLoading]   = useState(true);
  const { user }                = useAuth();
  const navigate                = useNavigate();
  const bottomRef               = useRef();

  useEffect(() => {
    getReceivedApplications()
      .then(res => setApps(res.data.filter(a => a.status === 'approved')))
      .finally(() => setLoading(false));
  }, []);

  const openChat = async (app) => {
    setSelect(app);
    const res = await getChatRoom(app.id);
    setRoom(res.data);
    setMessages(res.data.messages || []);
    await markRead(res.data.id);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };
  useEffect(() => {
  if (!room || !selectedApp) return;
  const interval = setInterval(async () => {
    const res = await getChatRoom(selectedApp.id);
    setMessages(res.data.messages || []);
  }, 5000);
  return () => clearInterval(interval);
}, [room, selectedApp]);

  const handleSend = async () => {
    if (!text.trim() || !room) return;
    await sendMessage(room.id, text);
    setText('');
    const res = await getChatRoom(selectedApp.id);
    setMessages(res.data.messages || []);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gradient-to-r from-blue-900 to-blue-700 text-white px-6 py-4 shadow-lg">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          {room ? (
            <button onClick={() => { setRoom(null); setSelect(null); }} className="bg-blue-800 w-8 h-8 rounded-lg flex items-center justify-center">←</button>
          ) : (
            <button onClick={() => navigate(-1)} className="bg-blue-800 w-8 h-8 rounded-lg flex items-center justify-center">←</button>
          )}
          <h1 className="text-lg font-bold">{room ? `Chat — ${selectedApp?.tenant_name}` : 'Messages'}</h1>
        </div>
      </nav>

      {!room ? (
        <div className="max-w-2xl mx-auto p-6 space-y-3">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : apps.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">💬</p>
              <p className="text-gray-700 font-bold">No chats yet!</p>
              <p className="text-gray-400 text-sm mt-1">Approve applications to start chatting</p>
            </div>
          ) : apps.map(app => (
            <button
              key={app.id}
              onClick={() => openChat(app)}
              className="w-full bg-white rounded-2xl shadow-sm p-4 border border-gray-100 flex items-center gap-4 hover:shadow-md transition text-left"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl font-bold text-blue-700">
                {app.tenant_name?.[0] || '?'}
              </div>
              <div>
                <p className="font-bold text-gray-800">{app.tenant_name}</p>
                <p className="text-gray-500 text-sm">{app.property_title}</p>
              </div>
              <span className="ml-auto text-gray-400">›</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="max-w-2xl mx-auto flex flex-col" style={{ height: 'calc(100vh - 72px)' }}>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <p className="text-center text-gray-400 py-8">No messages yet. Say hello! 👋</p>
            ) : messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === user?.id ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                  msg.sender === user?.id
                    ? 'bg-blue-900 text-white rounded-br-sm'
                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          <div className="bg-white border-t p-4 flex gap-3">
            <input
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="flex-1 border rounded-xl px-4 py-2 outline-none focus:border-blue-500 text-sm"
            />
            <button
              onClick={handleSend}
              className="bg-blue-900 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-blue-800 transition"
            >Send</button>
          </div>
        </div>
      )}
    </div>
  );
}