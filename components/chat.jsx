"use client";
import { useState, useEffect, useRef } from "react";
import { useParams } from 'next/navigation';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, doc, setDoc, serverTimestamp, addDoc, updateDoc, getDoc } from 'firebase/firestore';
import Message from "./message";

const Chat = () => {
  const [chatMessages, setChatMessages] = useState([]);
  const [input, setInput] = useState('');
  const params = useParams();
  const chatId = params?.chatID;
  const abortControllerRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [chatMessages]);

  useEffect(() => {
    const initializeChat = async () => {
      if (!db || !chatId) return;
      
      try {
        const chatRef = doc(db, 'chats', chatId);
        const chatDoc = await getDoc(chatRef);
        
        if (!chatDoc.exists()) {
          // Only set the title for new chats
          await setDoc(chatRef, { 
            createdAt: serverTimestamp(),
            title: 'New Chat' // Default title
          });
        }
      } catch (error) {
        console.error("Error initializing chat:", error);
      }
    };
    initializeChat();
  }, [chatId]);

  useEffect(() => {
    if (!db || !chatId) return;

    const q = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setChatMessages(newMessages);
    });

    return () => unsubscribe();
  }, [chatId, db]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;

    const userMessage = { role: 'user', content: input };
    setInput('');

    try {
      // Add user message to local state and Firebase
      setChatMessages(prevMessages => [...prevMessages, userMessage]);
      const chatRef = doc(db, 'chats', chatId);
      const messagesRef = collection(chatRef, 'messages');
      await addDoc(messagesRef, {
        ...userMessage,
        timestamp: serverTimestamp()
      });

      // Send request to API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...chatMessages, userMessage], chatId }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        aiResponse += decoder.decode(value);
        setChatMessages(prevMessages => {
          const newMessages = [...prevMessages];
          newMessages[newMessages.length - 1] = { role: 'assistant', content: aiResponse };
          return newMessages;
        });
      }

      // Add final AI response to Firebase
      await addDoc(messagesRef, {
        role: 'assistant',
        content: aiResponse,
        timestamp: serverTimestamp()
      });

      // Update chat title if it's the first message
      if (chatMessages.length === 0) {
        await updateDoc(chatRef, {
          title: truncateTitle(input, 50),
          updatedAt: serverTimestamp()
        });
      }

    } catch (error) {
      console.error("Error in chat:", error);
    }
  };

  const truncateTitle = (title, maxLength = 50) => {
    if (!title) return 'Untitled Chat';
    if (title.length <= maxLength) return title;
    return title.substr(0, maxLength) + '...';
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
        {chatMessages.map((message, index) => (
          <Message key={index} role={message.role} content={message.content} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <footer className="bg-gray-100 border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="relative">
            <input
              className="w-full p-3 md:p-4 pr-20 md:pr-24 text-gray-700 border border-purple-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
              value={input}
              placeholder="Type your message here"
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-2 top-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 md:px-5 py-2 md:py-2 rounded-full text-sm font-medium hover:from-purple-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
            >
              Send
            </button>
          </div>
        </form>
      </footer>
    </div>
  );
};

export default Chat;