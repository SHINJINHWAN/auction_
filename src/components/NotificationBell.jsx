import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import '../style/NotificationBell.css';

function NotificationBell({ userId = 'user1' }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  // 알림 목록 로드
  const loadNotifications = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/notifications/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error('알림 로드 실패:', err);
    }
  };

  // 읽지 않은 알림 수 로드
  const loadUnreadCount = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/notifications/${userId}/unread-count`);
      if (res.ok) {
        const count = await res.json();
        setUnreadCount(count);
      }
    } catch (err) {
      console.error('읽지 않은 알림 수 로드 실패:', err);
    }
  };

  // 알림 읽음 처리
  const markAsRead = async (notificationId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/notifications/${notificationId}/read`, {
        method: 'PUT'
      });
      if (res.ok) {
        loadNotifications();
        loadUnreadCount();
      }
    } catch (err) {
      console.error('읽음 처리 실패:', err);
    }
  };

  // 모든 알림 읽음 처리
  const markAllAsRead = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/notifications/${userId}/read-all`, {
        method: 'PUT'
      });
      if (res.ok) {
        loadNotifications();
        loadUnreadCount();
      }
    } catch (err) {
      console.error('모든 읽음 처리 실패:', err);
    }
  };

  // 초기 로드
  useEffect(() => {
    loadNotifications();
    loadUnreadCount();
  }, [userId]);

  // WebSocket 연결
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws-auction'),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('✅ 알림 WebSocket 연결됨');
        
        // 사용자별 알림 구독
        client.subscribe(`/topic/notifications/${userId}`, (message) => {
          const notification = JSON.parse(message.body);
          console.log('🔔 새 알림 수신:', notification);
          
          // 새 알림을 목록 맨 위에 추가
          setNotifications(prev => [notification, ...prev]);
          setUnreadCount(prev => prev + 1);
          
          // 브라우저 알림 표시
          if (Notification.permission === 'granted') {
            new Notification('경매 알림', {
              body: notification.message,
              icon: '/favicon.ico'
            });
          }
        });
      },
      onStompError: (frame) => {
        console.error('❌ 알림 WebSocket 오류:', frame);
      },
    });

    client.activate();
    return () => client.deactivate();
  }, [userId]);

  // 브라우저 알림 권한 요청
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'BID': return '🎯';
      case 'WIN': return '🏆';
      case 'LOSE': return '😔';
      case 'BUY_NOW': return '💎';
      case 'MESSAGE': return '✉️';
      default: return '🔔';
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return '방금 전';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}분 전`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}시간 전`;
    return date.toLocaleDateString();
  };

  // 알림 클릭 시 이동
  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    if (notification.type === 'BID' || notification.type === 'WIN' || notification.type === 'LOSE' || notification.type === 'BUY_NOW') {
      navigate(`/auction/${notification.auctionId}`);
    } else if (notification.type === 'MESSAGE') {
      navigate('/'); // 홈에서 쪽지함 열기(추후 개선 가능)
      setTimeout(() => {
        const btn = document.querySelector('.auction-nav .auction-tab + .auction-tab + .auction-tab + button');
        if (btn) btn.click();
      }, 100);
    } else {
      // 기타 알림은 홈으로 이동
      navigate('/');
    }
    setShowDropdown(false);
  };

  return (
    <div className="notification-bell">
      <div 
        className="bell-icon" 
        onClick={() => setShowDropdown(!showDropdown)}
      >
        🔔
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </div>

      {showDropdown && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>알림</h3>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="mark-all-read">
                모두 읽음
              </button>
            )}
          </div>
          
          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">알림이 없습니다</div>
            ) : (
              notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-content">
                    <div className="notification-message">
                      {notification.message}
                    </div>
                    <div className="notification-time">
                      {formatTime(notification.createdAt)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell; 