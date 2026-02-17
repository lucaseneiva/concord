import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { roomService, type Room, type Message } from '../services/roomService';

const SOCKET_URL = 'http://localhost:3001';

export const Dashboard: React.FC = () => {
  const { user, token, logout } = useAuthStore();
  const [socket, setSocket] = useState<Socket | null>(null);

  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [newRoomName, setNewRoomName] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!token) return;

    const newSocket = io(SOCKET_URL, {
      auth: { token }
    });

    setSocket(newSocket);
    loadRooms();

    return () => {
      newSocket.disconnect();
    };
  }, [token]);

  useEffect(() => {
    if (!socket) return;

    socket.on('receive_message', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off('receive_message');
    };
  }, [socket, currentRoom]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadRooms = async () => {
    try {
      const data = await roomService.getRooms();
      setRooms(data);
    } catch (error) {
      console.error("Failed to load rooms", error);
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;
    try {
      const newRoom = await roomService.createRoom(newRoomName);
      setRooms([...rooms, newRoom]);
      setNewRoomName('');
      handleJoinRoom(newRoom);
    } catch (error) {
      console.error("Failed to create room", error);
    }
  };

  const handleJoinRoom = async (room: Room) => {
    if (currentRoom?.id === room.id) return;

    if (currentRoom && socket) {
      socket.emit('leave_room', currentRoom.id);
    }

    setCurrentRoom(room);

    try {
      await roomService.joinRoom(room.id);

      const history = await roomService.getMessages(room.id);
      setMessages(history);

      if (socket) {
        socket.emit('join_room', room.id);
      }
    } catch (error) {
      console.error("Failed to join room", error);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !socket || !currentRoom) return;

    socket.emit('send_message', {
      roomId: currentRoom.id,
      content: inputText,
    });

    setInputText('');
  };

  return (
    <div className="h-screen flex flex-col bg-background-secondary">
      <header className="bg-white border-b border-border px-6 py-4 flex justify-between items-center">

        <img
          src="logo.png"
          alt="BubingaChat logo"
          className="h-16 w-auto object-contain" />
        <div className="flex items-center gap-4">
          <span className="text-sm text-text-secondary">User: <b className="text-text-primary">{user?.username}</b></span>
          <Button onClick={logout} variant="secondary" className="py-2 px-4 text-sm">Logout</Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-72 bg-white border-r border-border flex flex-col">
          <div className="p-4 border-b border-border">
            <h2 className="font-medium text-text-primary mb-3">Rooms</h2>
            <form onSubmit={handleCreateRoom} className="flex gap-2">
              <input
                type="text"
                placeholder="New Room..."
                className="flex-1 min-w-0 px-3 py-2 text-sm border border-border-light rounded-input focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
              />

              <button type="submit" className="bg-primary text-white px-3 rounded-btn hover:bg-primary-hover transition-colors">+</button>
            </form>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {rooms.map(room => (
              <button
                key={room.id}
                onClick={() => handleJoinRoom(room)}
                className={`w-full text-left px-4 py-2.5 rounded-input transition-all ${currentRoom?.id === room.id
                    ? 'bg-primary text-white'
                    : 'text-text-primary hover:bg-background-secondary'
                  }`}
              >
                # {room.name}
              </button>
            ))}
            {rooms.length === 0 && <div className="text-text-secondary text-sm p-4">No rooms yet</div>}
          </div>
        </aside>

        <main className="flex-1 flex flex-col bg-white">
          {currentRoom ? (
            <>
              <div className="px-6 py-4 border-b border-border bg-background-secondary">
                <h3 className="font-medium text-text-primary"># {currentRoom.name}</h3>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg) => {
                  const isMe = msg.user.id === user?.id;
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] rounded-btn px-4 py-3 ${isMe ? 'bg-primary text-white' : 'bg-background-secondary text-text-primary'
                        }`}>
                        {!isMe && (
                          <div className="text-xs font-medium text-text-secondary mb-1">
                            {msg.user.username}
                          </div>
                        )}
                        <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                        <div className={`text-[10px] mt-1.5 ${isMe ? 'text-primary-light' : 'text-text-secondary'}`}>
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-border bg-background-secondary">
                <form onSubmit={handleSendMessage} className="flex gap-3">
                  <Input
                    name="message"
                    value={inputText}
                    onChange={setInputText}
                    placeholder={`Message #${currentRoom.name}`}
                    className="flex-1 mb-0"
                  />
                  <Button type="submit" disabled={!inputText.trim()}>Send</Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-text-secondary">
              Select a room to start chatting
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
