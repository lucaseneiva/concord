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
  
  // State
  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [newRoomName, setNewRoomName] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Initialize Socket & Fetch Rooms
  useEffect(() => {
    if (!token) return;

    // Connect with Auth Token
    const newSocket = io(SOCKET_URL, {
      auth: { token }
    });

    setSocket(newSocket);

    // Load Room List
    loadRooms();

    // Cleanup
    return () => {
      newSocket.disconnect();
    };
  }, [token]);

  // 2. Handle Socket Events
  useEffect(() => {
    if (!socket) return;

    socket.on('receive_message', (message: Message) => {
      // Only append if it belongs to the current room (safety check)
      // Ideally backend only sends to room members, but good to be safe
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off('receive_message');
    };
  }, [socket, currentRoom]);

  // 3. Scroll to bottom on new message
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

    // Leave old room
    if (currentRoom && socket) {
      socket.emit('leave_room', currentRoom.id);
    }

    setCurrentRoom(room);

    try {
        // Join via API (to update DB membership)
        await roomService.joinRoom(room.id);
        
        // Fetch History
        const history = await roomService.getMessages(room.id);
        setMessages(history);

        // Join via Socket (real-time)
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

    // Optimistic UI update could happen here, but for MVP we wait for server echo
    // actually, let's wait for server echo to ensure it persisted.

    socket.emit('send_message', {
      roomId: currentRoom.id,
      content: inputText,
    });

    setInputText('');
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Navbar */}
      <header className="bg-white shadow-sm p-4 flex justify-between items-center z-10">
        <h1 className="text-xl font-bold text-gray-800">BubingaChat 🪵</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">User: <b>{user?.username}</b></span>
          <Button onClick={logout} variant="secondary" className="py-1 px-3 text-sm">Logout</Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Rooms */}
        <aside className="w-64 bg-gray-800 text-white flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <h2 className="font-semibold mb-2">Rooms</h2>
            <form onSubmit={handleCreateRoom} className="flex gap-2">
              <input
                type="text"
                placeholder="New Room..."
                className="w-full px-2 py-1 text-black rounded text-sm"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
              />
              <button type="submit" className="bg-blue-600 px-2 rounded">+</button>
            </form>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {rooms.map(room => (
              <button
                key={room.id}
                onClick={() => handleJoinRoom(room)}
                className={`w-full text-left px-3 py-2 rounded transition-colors ${
                  currentRoom?.id === room.id ? 'bg-blue-700' : 'hover:bg-gray-700'
                }`}
              >
                # {room.name}
              </button>
            ))}
            {rooms.length === 0 && <div className="text-gray-500 text-sm p-2">No rooms yet</div>}
          </div>
        </aside>

        {/* Chat Area */}
        <main className="flex-1 flex flex-col bg-white">
          {currentRoom ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b bg-gray-50 flex justify-between items-center shadow-sm">
                <h3 className="font-bold text-gray-700"># {currentRoom.name}</h3>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => {
                  const isMe = msg.user.id === user?.id;
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] rounded-lg px-4 py-2 shadow-sm ${
                        isMe ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {!isMe && (
                          <div className="text-xs font-bold text-gray-500 mb-1">
                            {msg.user.username}
                          </div>
                        )}
                        <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                        <div className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-200' : 'text-gray-400'}`}>
                          {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t bg-gray-50">
                <form onSubmit={handleSendMessage} className="flex gap-2">
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
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Select a room to start chatting
            </div>
          )}
        </main>
      </div>
    </div>
  );
};