"use client"
import { useState, useEffect } from "react";
import { RiChat3Line, RiCloseLine, RiAddLine } from "react-icons/ri";
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

const Sidebar = ({ isOpen, setIsOpen, isMobile, setActiveChatId }) => {
  const [chats, setChats] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const q = query(collection(db, 'chats'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newChats = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(chat => chat.title && chat.title !== 'Untitled Chat');
      setChats(newChats);
    });

    return () => unsubscribe();
  }, []);

  const truncateTitle = (title, maxLength = 30) => {
    if (!title) return 'Untitled Chat';
    if (title.length <= maxLength) return title;
    return title.substr(0, maxLength) + '...';
  };

  const handleNewChat = () => {
    const newChatId = uuidv4();
    setActiveChatId(newChatId);
    router.push(`/chat/${newChatId}`);
  };

  const sidebarClasses = `w-64 bg-gradient-to-b from-purple-700 to-indigo-800 text-white flex flex-col h-full ${
    isMobile ? (isOpen ? 'fixed inset-y-0 left-0 z-50' : 'hidden') : 'relative'
  }`;

  return (
    <div className={sidebarClasses}>
      {isMobile && (
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-white hover:text-yellow-300"
        >
          <RiCloseLine className="w-6 h-6" />
        </button>
      )}
      <div className="p-4">
        <button
          onClick={handleNewChat}
          className="flex items-center justify-center space-x-2 bg-white text-purple-700 p-2 rounded-full hover:bg-yellow-300 transition-colors w-full"
        >
          <RiAddLine className="w-5 h-5" />
          <span className="font-medium">New Chat</span>
        </button>
      </div>
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {chats.map((chat) => (
            <li key={chat.id}>
              <button
                onClick={() => {
                  setActiveChatId(chat.id);
                  router.push(`/chat/${chat.id}`);
                }}
                className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-purple-600 transition-colors text-left"
              >
                <RiChat3Line className="w-5 h-5 text-yellow-300 flex-shrink-0" />
                <span className="text-sm font-medium truncate">{truncateTitle(chat.title)}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;