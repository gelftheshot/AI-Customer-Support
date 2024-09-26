'use client'
import '../styles/global.css'
import { useState, useEffect } from 'react';
import Header from '../components/header';
import Sidebar from '../components/sidebar';
import ChatWindow from '../components/chatWindow';
import Head from 'next/head';
import Chat from '../components/chat';

export default function RootLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeChatId, setActiveChatId] = useState(null);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <html lang="en">
      <Head>
        <title>AI Conversation Hub</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className="bg-gradient-to-br from-purple-100 to-indigo-200">
        <div className="flex flex-col h-screen">
          <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isMobile={isMobile} />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar 
              isOpen={isSidebarOpen} 
              setIsOpen={setIsSidebarOpen} 
              isMobile={isMobile}
              setActiveChatId={setActiveChatId}
            />
            <main className="flex-1 overflow-hidden p-4">
              <div className="h-full max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                {activeChatId ? (
                  <ChatWindow chatId={activeChatId} />
                ) : (
                  children
                )}
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
