import { useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { NotificationContext } from '../context/NotificationContext';

let socket;

export const useSocket = (userId) => {
  const { addNotification } = useContext(NotificationContext);

  useEffect(() => {
    if (!userId) return;

    socket = io('http://localhost:5005', {
      withCredentials: true,
      auth: {
        token: document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1]
      }
    });

    socket.on('connect', () => {
      console.log('Connected to socket server');
      socket.emit('join_user_room', userId);
    });

    socket.on('notification', (data) => {
      console.log('Received notification:', data);
      
      // Update notification context
      addNotification(data);
      
      // Toast popup for each new notification
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
          style={{ background: 'var(--cream)', border: 'var(--border-light)' }}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <img
                  className="h-10 w-10 rounded-full"
                  src={data.sender.avatarUrl}
                  alt={data.sender.displayName}
                  style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900" style={{ color: 'var(--charcoal)', fontWeight: '600' }}>
                  {data.sender.displayName}
                </p>
                <p className="mt-1 text-sm text-gray-500" style={{ color: 'var(--warm-taupe)' }}>
                  {data.message}
                </p>
              </div>
            </div>
          </div>
        </div>
      ), { duration: 3000 });
    });

    return () => {
      if (socket) socket.disconnect();
    };
  }, [userId]);

  return socket;
};
