import { useEffect, useState } from 'react';
import { Heart, MessageCircle, Tag, Search, Image, X } from 'lucide-react';
import { fetchAllPosts } from '../../api/postApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { createPost } from '../../api/postApi';
import { Post, Category  } from '../../types/Post';



const categories: Category[] = ["Updates", "Feedback", "Promotions"];



interface PostListProps {
  showNewPostModal: boolean;
  setShowNewPostModal: (show: boolean) => void;
}



export default function PostList({ showNewPostModal, setShowNewPostModal }: PostListProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [newComment, setNewComment] = useState("");
  const [activeCommentPost, setActiveCommentPost] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newPost, setNewPost] = useState({
    content: "",
    category: "Updates" as Category,
    description:""
  });

 const userRole = useSelector((state: RootState) => state.auth.role);
 const userId = useSelector((state: RootState) => state.user.id);

  useEffect(()=>{
    const fetchPosts = async () => {
      try {
        const data = await fetchAllPosts();
        console.log("fetching posts",data);
        if (!data || !data.posts) {
          console.error("Invalid data structure received:", data);
          return;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const transformedPosts: Post[] = data.posts.map((post: any) => ({
          id: post.id || post._id,
          author: post.userType || "user",
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
          content: post.content || post.Content || "",
          description: post.description || post.Description || "",
          category: (post.category || post.Category || "Updates") as Category,
          likes: Array.isArray(post.likes || post.Likes) ? post.likes || post.Likes : [],
          comments: Array.isArray(post.comments || post.Comments) 
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ? (post.comments || post.Comments).map((comment: any) => ({
                commentId: comment.commentId || comment._id || String(Date.now()),
                content: comment.content || comment.Content || "",
                timestamp: new Date(comment.timestamp || comment.CreatedAt),
                userId: comment.userId || comment.UserId || "",
              }))
            : [],
          liked: false,
          userType: post.userType || post.UserType,
          ownerId: post.ownerId || post.OwnerId,
          createdAt: new Date(post.createdAt || post.CreatedAt),
          updated: post.updated || post.Updated ? new Date(post.updated || post.Updated) : null,
        }));

      
        setPosts(transformedPosts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts = posts
    .filter(post => selectedCategory === "All" || post.category === selectedCategory)
    // .filter(post => 
    //     post.content.toLowerCase().includes(searchTerm.toLowerCase()) 
    //   // post.description.toLowerCase().includes(searchTerm.toLowerCase())
    // );

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          // likes: post.liked ? post.likes - 1 : post.likes + 1,
          // likes: post.liked ? post.likes.filter(like => like !== userId) : [...post.likes, userId],
          liked: !post.liked
        };
      }
      return post;
    }));
  };

  // const handleComment = (postId: number) => {
  //   if (newComment.trim() === "") return;
    
    // setPosts(posts.map(post => {
    //   if (post.id === postId) {
    //     return {
    //       ...post,
    //       comments: [...post.comments, {
    //         id: Date.now(),
    //         author: "You",
    //         content: newComment
    //       }]
    //     };
    //   }
    //   return post;
    // }));
    
  //   setNewComment("");
  //   setActiveCommentPost(null);
  // };

  const handleCreatePost = async () => {
   
    if (newPost.content.trim() === "") return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const post: any = {
      UserType: userRole,
      // author: "You",
      // avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
      OwnerId: userId,
      Content: newPost.content,
      Likes: [],
      Comments: [],
      CreatedAt: new Date(),
      Updated: null,
      Description: newPost.description,
      Category: newPost.category,
     
    };
    const response = await createPost(post);
    console.log("response",response);

    setPosts([post, ...posts]);
    setNewPost({ content: "", category: "Updates", description:""});
    setShowNewPostModal(false);
  };

  return (
    <div className="w-full space-y-8">
      {/* Search Bar with Glass Effect */}
      <div className="relative flex-1 max-w-md mx-auto">
        <input
          type="text"
          placeholder="Search posts..."
          className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-lg shadow-blue-500/10 transition-all duration-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-4 top-3.5 text-blue-500 w-5 h-5" />
      </div>

      {/* Categories with Modern Design */}
      <div className="flex space-x-3 overflow-x-auto pb-2 px-1 scrollbar-hide">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-6 py-2.5 rounded-full flex items-center ${
            selectedCategory === 'All'
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30 scale-105"
              : "bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-gray-50 border border-gray-200"
          } transition-all duration-300`}
        >
          <Tag className="inline-block w-4 h-4 mr-2" />
          All
        </button>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-2.5 rounded-full flex items-center ${
              selectedCategory === category
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30 scale-105"
                : "bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-gray-50 border border-gray-200"
            } transition-all duration-300`}
          >
            <Tag className="inline-block w-4 h-4 mr-2" />
            {category}
          </button>
        ))}
      </div>
               
      {/* Posts Grid */}
      <div className="grid gap-8">
        {filteredPosts.map((post, index) => (
          <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-blue-500/10 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 border border-gray-100">
            {/* Post Header */}
            <div className="p-6">
              <div className="flex items-center space-x-4">
                <img 
                  src={post.avatar} 
                  alt={post.author} 
                  className="w-12 h-12 rounded-full ring-2 ring-blue-500/20 object-cover shadow-lg" 
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{post.author}</h3>
                  <span className="text-sm text-blue-500 font-medium">{post.category}</span>
                </div>
              </div>
            </div>
            
            {/* Post Image */}
            {post.content && (
              <div className="relative aspect-[4/3] bg-gray-100">
                <img 
                  src={`/images/${post.content}`}
                  alt="Post content" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}
            
            {/* Post Content */}
            <div className="p-6">
              <p className="text-gray-800 mb-6 text-lg whitespace-pre-wrap">{post.description}</p>
              
              {/* Interaction Buttons */}
              <div className="flex items-center space-x-8">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center space-x-2 ${
                    post.liked ? "text-red-500" : "text-gray-500"
                  } hover:scale-110 transition-transform duration-300`}
                >
                  <Heart className={`w-7 h-7 ${post.liked ? "fill-current" : ""} transition-colors duration-300`} />
                  <span className="font-medium">{Array.isArray(post.likes) ? post.likes.length : 0}</span>
                </button>
                
                <button
                  onClick={() => setActiveCommentPost(post.id)}
                  className="flex items-center space-x-2 text-gray-500 hover:scale-110 transition-transform duration-300"
                >
                  <MessageCircle className="w-7 h-7" />
                  <span className="font-medium">{Array.isArray(post.comments) ? post.comments.length : 0}</span>
                </button>
              </div>

              {/* Comment Section */}
              {activeCommentPost === post.id && (
                <div className="mt-6 space-y-4">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full p-4 bg-gray-50/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                    rows={2}
                  />
                  <button
                    onClick={() => handleComment(post.id)}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
                  >
                    Post Comment
                  </button>
                </div>
              )}

              {/* Comments List */}
              {post.comments.length > 0 && (
                <div className="mt-6 space-y-4">
                  {post.comments.map(comment => (
                    <div key={comment.commentId} className="bg-gray-50/50 backdrop-blur-sm p-4 rounded-xl border border-gray-200">
                      <p className="font-semibold text-blue-500">{comment.userId}</p>
                      <p className="text-gray-700 mt-1">{comment.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create Post Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 w-full max-w-lg mx-4 shadow-2xl shadow-blue-500/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Create New Post</h2>
              <button 
                onClick={() => setShowNewPostModal(false)} 
                className="text-gray-500 hover:text-gray-700 hover:rotate-90 transition-all duration-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <textarea
                value={newPost.description}
                onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
                placeholder="What's on your mind?"
                className="w-full p-4 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                rows={4}
              />
              
              <div className="relative">
                <input
                  type="file"
                  accept="image/*,jpg,png,jpeg"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      const fullPath = (file as any).path || file.name;
                      setNewPost({ ...newPost, content: fullPath });
                    }
                  }}
                  placeholder="Image"
                  className="w-full pl-12 pr-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                />
                <Image className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
              </div>
              
              <select
                value={newPost.category}
                onChange={(e) => setNewPost({ ...newPost, category: e.target.value as Category })}
                className="w-full p-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowNewPostModal(false)}
                  className="px-6 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePost}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
                >
                  Create Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}