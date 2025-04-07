import  { useState } from 'react';
import { Search } from 'lucide-react';

interface Message {
  id: number;
  name: string;
  lastMessage: string;
  avatar: string;
  online: boolean;
}

const initialMessages: Message[] = [
  { 
    id: 1, 
    name: "John Doe", 
    lastMessage: "Hey, how are you?", 
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    online: true
  },
  { 
    id: 2, 
    name: "Jane Smith", 
    lastMessage: "Did you see the latest post?", 
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    online: false
  },
  { 
    id: 3, 
    name: "Mike Johnson", 
    lastMessage: "Great work on the project!", 
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    online: true
  },
];

export default function MessageList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [messages] = useState<Message[]>(initialMessages);

  const filteredMessages = messages.filter(message =>
    message.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-200/50 backdrop-blur-sm">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">Messages</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search messages..."
            className="w-full pl-12 pr-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-4 top-3.5 text-blue-500 w-5 h-5" />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto divide-y divide-gray-200/50">
        {filteredMessages.map((message) => (
          <div 
            key={message.id} 
            className="flex items-center space-x-4 p-6 hover:bg-blue-50/50 cursor-pointer transition-colors duration-300"
          >
            <div className="relative">
              <img 
                src={message.avatar} 
                alt={message.name} 
                className="w-12 h-12 rounded-full ring-2 ring-blue-500/20 object-cover shadow-lg" 
              />
              {message.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{message.name}</h3>
              <p className="text-sm text-gray-500 truncate">{message.lastMessage}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}