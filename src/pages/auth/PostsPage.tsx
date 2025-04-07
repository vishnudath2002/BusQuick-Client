import { useState } from 'react';
import { MessageCircle, X, PlusCircle } from 'lucide-react';
import MessageList from '../../components/auth/MessageList';
import PostList from '../../components/auth/PostList';

export default function PostsPage() {
  const [showMessages, setShowMessages] = useState(false);
  const [showNewPostModal, setShowNewPostModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Fixed Message Toggle Button */}
      <button
        onClick={() => setShowMessages(!showMessages)}
        className="fixed bottom-8 right-8 z-50 p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-110 transition-all duration-300"
      >
        {showMessages ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>

      {/* Fixed Create Post Button */}
      <button
        onClick={() => setShowNewPostModal(true)}
        className="fixed bottom-8 left-8 z-50 p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-110 transition-all duration-300"
      >
        <PlusCircle className="w-6 h-6" />
      </button>

      {/* Messages Overlay */}
      <div
        className={`fixed inset-y-0 right-0 w-full md:w-96 bg-white/80 backdrop-blur-xl shadow-2xl transform transition-transform duration-500 ease-out z-40 ${
          showMessages ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <MessageList />
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <PostList showNewPostModal={showNewPostModal} setShowNewPostModal={setShowNewPostModal} />
        </div>
      </div>
    </div>
  );
}