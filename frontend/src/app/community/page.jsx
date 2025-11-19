'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchPostsStart,
  fetchPostsSuccess,
  fetchPostsFailure,
  createPostStart,
  createPostSuccess,
  createPostFailure,
  setCurrentPost,
  fetchCommentsStart,
  fetchCommentsSuccess,
  fetchCommentsFailure,
  addComment
} from '../../store/slices/communitySlice';
import { communityAPI } from '../../services/api';

export default function CommunityPage() {
  const dispatch = useDispatch();
  const { posts, currentPost, comments, loading, error } = useSelector((state) => state.community);
  const [newPost, setNewPost] = useState({ title: '', content: '', tags: '' });
  const [newComment, setNewComment] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      dispatch(fetchPostsStart());
      const response = await communityAPI.getPosts();
      dispatch(fetchPostsSuccess(response.data));
    } catch (error) {
      dispatch(fetchPostsFailure(error.message));
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      dispatch(createPostStart());
      const response = await communityAPI.createPost({
        ...newPost,
        tags: newPost.tags.split(',').map(tag => tag.trim())
      });
      dispatch(createPostSuccess(response.data));
      setNewPost({ title: '', content: '', tags: '' });
      setShowCreateForm(false);
    } catch (error) {
      dispatch(createPostFailure(error.message));
    }
  };

  const handleViewPost = async (post) => {
    dispatch(setCurrentPost(post));
    try {
      dispatch(fetchCommentsStart());
      const response = await communityAPI.getComments(post.id);
      dispatch(fetchCommentsSuccess(response.data));
    } catch (error) {
      dispatch(fetchCommentsFailure(error.message));
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!currentPost) return;

    try {
      const response = await communityAPI.addComment(currentPost.id, { content: newComment });
      dispatch(addComment(response.data));
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Community</h1>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              {showCreateForm ? 'Cancel' : 'Create Post'}
            </button>
          </div>

          {/* Create Post Form */}
          {showCreateForm && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Post</h2>
              <form onSubmit={handleCreatePost}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                  </label>
                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newPost.tags}
                    onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                    placeholder="e.g., mathematics, algebra, help"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Create Post
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Posts List */}
            <div className="lg:col-span-2">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading posts...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-600 mb-4">Error loading posts: {error}</p>
                  <button
                    onClick={fetchPosts}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => handleViewPost(post)}
                    >
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.content}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-500">
                            By {post.author.name}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-500">
                            {post.commentsCount} comments
                          </span>
                          <span className="text-sm text-gray-500">
                            {post.likes} likes
                          </span>
                        </div>
                      </div>
                      {post.tags && post.tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {post.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Post Detail */}
            <div className="lg:col-span-1">
              {currentPost ? (
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {currentPost.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {currentPost.content}
                  </p>

                  {/* Comments */}
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900 mb-4">Comments</h4>

                    {comments.length === 0 ? (
                      <p className="text-gray-500 text-sm">No comments yet.</p>
                    ) : (
                      <div className="space-y-4 mb-4">
                        {comments.map((comment) => (
                          <div key={comment.id} className="border-l-2 border-gray-200 pl-4">
                            <p className="text-sm text-gray-600">{comment.content}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              By {comment.author.name} • {new Date(comment.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Comment */}
                    <form onSubmit={handleAddComment}>
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-2"
                        required
                      />
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                      >
                        Add Comment
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <p className="text-gray-500">Select a post to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
