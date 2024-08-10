"use client"
import { useState, useEffect } from "react";
import { RiChat3Line, RiSettings4Line, RiQuestionLine } from "react-icons/ri";
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import Link from 'next/link';

const Sidebar = () => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'chats'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newChats = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setChats(newChats);
    });

    return () => unsubscribe();
  }, []);

  const truncateTitle = (title, maxLength = 30) => {
    if (!title) return 'Untitled Chat';
    if (title.length <= maxLength) return title;
    return title.substr(0, maxLength) + '...';
  };

  return (
    <div className="w-64 bg-amber-100 text-gray-800 flex flex-col h-full">
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {chats.map((chat) => (
            <li key={chat.id}>
              <Link href={`/chat/${chat.id}`} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-amber-200 transition-colors">
                <RiChat3Line className="w-5 h-5" />
                <span>{truncateTitle(chat.title || 'Untitled Chat')}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <footer className="p-4 border-t border-amber-200">
        <ul className="space-y-2">
          <li>
            <a href="#" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-amber-200 transition-colors">
              <RiQuestionLine className="w-5 h-5" />
              <span>Help & FAQ</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-amber-200 transition-colors">
              <RiSettings4Line className="w-5 h-5" />
              <span>Settings</span>
            </a>
          </li>
        </ul>
      </footer>
    </div>
  );
};

export default Sidebar;