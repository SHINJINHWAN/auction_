import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import PropTypes from 'prop-types';

function CommentSection({ auctionId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [author, setAuthor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');

  // 댓글 목록 불러오기
  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/comments/auction/${auctionId}`);
      setComments(response.data);
    } catch (error) {
      console.error('댓글 목록 불러오기 실패:', error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [auctionId]);

  // WebSocket 실시간 댓글 업데이트
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws-auction'),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('✅ WebSocket 연결됨 (댓글)');
        client.subscribe(`/topic/comments/${auctionId}`, (message) => {
          const updatedComment = JSON.parse(message.body);
          
          if (updatedComment.isDeleted) {
            // 댓글 삭제
            setComments(prev => prev.filter(c => c.id !== updatedComment.id));
            setMessage('🗑️ 댓글이 삭제되었습니다.');
            setTimeout(() => setMessage(''), 3000);
          } else {
            // 댓글 추가/수정
            setComments(prev => {
              const existingIndex = prev.findIndex(c => c.id === updatedComment.id);
              if (existingIndex !== -1) {
                // 수정
                const updated = [...prev];
                updated[existingIndex] = updatedComment;
                return updated;
              } else {
                // 새 댓글
                return [updatedComment, ...prev];
              }
            });
            
            if (!editingComment) {
              setMessage('💬 새로운 댓글이 등록되었습니다!');
              setTimeout(() => setMessage(''), 3000);
            }
          }
        });
      },
    });
    client.activate();
    return () => client.deactivate();
  }, [auctionId, editingComment]);

  // 댓글 등록
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!author.trim() || !newComment.trim()) {
      setMessage('❌ 작성자와 댓글 내용을 모두 입력해주세요.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      await axios.post('http://localhost:8080/api/comments', {
        auctionId,
        author: author.trim(),
        content: newComment.trim()
      });
      
      setNewComment('');
      setMessage('✅ 댓글이 등록되었습니다!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      const errorMessage = error.response?.data || '댓글 등록 중 오류가 발생했습니다.';
      setMessage(`❌ ${errorMessage}`);
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 댓글 수정 시작
  const startEdit = (comment) => {
    setEditingComment(comment.id);
    setEditContent(comment.content);
  };

  // 댓글 수정 취소
  const cancelEdit = () => {
    setEditingComment(null);
    setEditContent('');
  };

  // 댓글 수정 완료
  const handleUpdateComment = async (commentId) => {
    if (!editContent.trim()) {
      setMessage('❌ 댓글 내용을 입력해주세요.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    try {
      await axios.put(`http://localhost:8080/api/comments/${commentId}`, {
        content: editContent.trim()
      });
      
      setEditingComment(null);
      setEditContent('');
      setMessage('✅ 댓글이 수정되었습니다!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      const errorMessage = error.response?.data || '댓글 수정 중 오류가 발생했습니다.';
      setMessage(`❌ ${errorMessage}`);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/api/comments/${commentId}`);
      setMessage('🗑️ 댓글이 삭제되었습니다.');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      const errorMessage = error.response?.data || '댓글 삭제 중 오류가 발생했습니다.';
      setMessage(`❌ ${errorMessage}`);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  // 시간 포맷팅
  const formatTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return '방금 전';
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}시간 전`;
    return date.toLocaleDateString('ko-KR');
  };

  return (
    <div className="comment-section" style={{ 
      border: '1px solid #ddd', 
      padding: '20px', 
      borderRadius: '8px',
      marginTop: '20px',
      backgroundColor: '#f8f9fa'
    }}>
      <h3>💬 댓글 ({comments.length}개)</h3>
      
      {message && (
        <div style={{ 
          padding: '10px', 
          marginBottom: '15px',
          borderRadius: '4px',
          backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da',
          color: message.includes('✅') ? '#155724' : '#721c24',
          border: `1px solid ${message.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          {message}
        </div>
      )}

      {/* 댓글 작성 폼 */}
      <form onSubmit={handleSubmitComment} style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="작성자 이름"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            style={{ 
              width: '100%', 
              padding: '8px', 
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <textarea
            placeholder="댓글을 입력하세요... (최대 1000자)"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            maxLength={1000}
            rows={3}
            required
            style={{ 
              width: '100%', 
              padding: '8px', 
              border: '1px solid #ddd',
              borderRadius: '4px',
              resize: 'vertical'
            }}
          />
          <div style={{ 
            fontSize: '12px', 
            color: '#666', 
            textAlign: 'right',
            marginTop: '5px'
          }}>
            {newComment.length}/1000
          </div>
        </div>
        <button 
          type="submit" 
          disabled={isSubmitting}
          style={{ 
            padding: '8px 16px',
            backgroundColor: isSubmitting ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer'
          }}
        >
          {isSubmitting ? '등록 중...' : '댓글 등록'}
        </button>
      </form>

      {/* 댓글 목록 */}
      <div>
        {comments.length === 0 ? (
          <p style={{ 
            color: '#666', 
            fontStyle: 'italic',
            textAlign: 'center',
            padding: '20px'
          }}>
            아직 댓글이 없습니다. 첫 번째 댓글을 남겨보세요!
          </p>
        ) : (
          <div>
            {comments.map((comment) => (
              <div key={comment.id} style={{ 
                border: '1px solid #e9ecef',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '10px',
                backgroundColor: 'white'
              }}>
                {editingComment === comment.id ? (
                  // 수정 모드
                  <div>
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      maxLength={1000}
                      rows={3}
                      style={{ 
                        width: '100%', 
                        padding: '8px', 
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        marginBottom: '10px',
                        resize: 'vertical'
                      }}
                    />
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button 
                        onClick={() => handleUpdateComment(comment.id)}
                        style={{ 
                          padding: '5px 10px',
                          backgroundColor: '#28a745',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        수정 완료
                      </button>
                      <button 
                        onClick={cancelEdit}
                        style={{ 
                          padding: '5px 10px',
                          backgroundColor: '#6c757d',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  // 일반 모드
                  <div>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '8px'
                    }}>
                      <div>
                        <strong style={{ color: '#495057' }}>👤 {comment.author}</strong>
                        <span style={{ 
                          fontSize: '12px', 
                          color: '#6c757d',
                          marginLeft: '10px'
                        }}>
                          {formatTime(comment.createdAt)}
                          {comment.updatedAt !== comment.createdAt && ' (수정됨)'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button 
                          onClick={() => startEdit(comment)}
                          style={{ 
                            padding: '3px 8px',
                            backgroundColor: '#ffc107',
                            color: '#212529',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          수정
                        </button>
                        <button 
                          onClick={() => handleDeleteComment(comment.id)}
                          style={{ 
                            padding: '3px 8px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                    <div style={{ 
                      color: '#495057',
                      lineHeight: '1.5',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {comment.content}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

CommentSection.propTypes = {
  auctionId: PropTypes.number.isRequired,
};

export default CommentSection; 