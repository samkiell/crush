'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComments, addComment, selectCommunityComments, toggleReaction, deleteComment } from '@/store/slices/communitySlice';

import { selectIsAuthenticated, selectUser, selectToken } from '@/store/slices/authSlice';
import { formatDistanceToNow } from '@/utils/dateUtils';
import { ThumbsUp, Reply, Send, Flag, MessageSquare, ImagePlus, X, FileText, Trash2, MoreVertical, Loader2 } from 'lucide-react';
                        </div >
    <div className="flex-1">
        {replyTo && (
            <div className="text-xs font-medium text-base-content/60 mb-2 flex items-center justify-between bg-base-200 p-2 px-3 rounded-xl border border-base-300">
                <span>
                    Replying to <b className="text-primary">{replyTo.author?.name}</b>
                </span>
                <button type="button" onClick={() => setReplyTo(null)} className="hover:text-red-600 transition-colors">
                    Cancel
                </button>
            </div>
        )}
        <div className="flex flex-col gap-2 p-3 rounded-xl bg-base-200 border border-base-300 focus-within:border-primary transition-all">
            <textarea
                className="w-full bg-transparent focus:outline-none resize-none text-base text-base-content placeholder:text-base-content/50 min-h-[60px]"
                placeholder="Add to the discussion..."
                rows="2"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
            />

            {/* Attachments Preview */}
            {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                    {attachments.map((file, index) => (
                        <div key={index} className="relative w-16 h-16 rounded-lg overflow-hidden border border-base-300 group">
                            {file.type === 'image' || file.type.startsWith('image/') ? (
                                <img src={file.preview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-base-100">
                                    <FileText className="w-6 h-6 text-base-content/50" />
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={() => removeAttachment(index)}
                                className="absolute top-0.5 right-0.5 bg-black/50 text-white rounded-full p-0.5 hover:bg-red-500 transition-colors"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex justify-between items-center">
                <label className="btn btn-circle btn-ghost btn-sm text-base-content/60 hover:text-primary">
                    <ImagePlus className="w-5 h-5" />
                    <input
                        type="file"
                        multiple
                        accept="image/*,video/*,application/pdf"
                        className="hidden"
                        onChange={handleFileSelect}
                    />
                </label>
                <button
                    type="submit"
                    className="btn btn-circle btn-primary btn-sm shadow-sm hover:shadow-lg border-none transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={(!newComment.trim() && attachments.length === 0) || submitting}
                >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
            </div>
        </div>
    </div>
                    </form >
                </div >
            ) : (
    <div className="bg-base-200 p-8 rounded-2xl text-center mb-10 border border-base-300">
        <p className="text-base-content/70 font-medium">
            Please{' '}
            <Link href={`/auth/login?redirect=/community/${postId}`} className="text-primary hover:underline font-bold">
                login
            </Link>{' '}
            to join the discussion.
        </p>
    </div>
)}

{/* Comments List */ }
            <div className="space-y-2">
                {rootComments.map(comment => (
                    <CommentItem
                        key={comment._id}
                        comment={comment}
                        allComments={comments}
                        onReply={setReplyTo}
                        onLike={handleLike}
                        onReport={handleReport}
                        onDelete={handleDelete}
                        currentUser={user}
                    />
                ))}

                {comments.length === 0 && (
                    <div className="text-center py-10">
                        <div className="bg-base-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-base-content/40">
                            <MessageSquare className="w-8 h-8" />
                        </div>
                        <p className="text-base-content/60 font-medium">No comments yet. Be the first to start the conversation!</p>
                    </div>
                )}
            </div>

            <ReportModal
                isOpen={reportModalOpen}
                onClose={() => setReportModalOpen(false)}
                targetType="Comment"
                targetId={reportTargetId}
            />
        </div >
    );
};

export default CommentSection;
