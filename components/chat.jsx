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
      const newMessages = snapshot.docs.map(doc => doc.data());
      setChatMessages(newMessages);
    }, (error) => {
      console.error("Error in onSnapshot:", error);
    });

    return () => unsubscribe();
  }, [chatId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setChatMessages(prev => [...prev, userMessage]);
    setInput('');

    // Abort previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create a new AbortController
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...chatMessages, userMessage], chatId }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) throw new Error(response.statusText);

      const data = response.body;
      if (!data) return;

      const reader = data.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let accumulatedResponse = '';

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        accumulatedResponse += chunkValue;
        setChatMessages(prev => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage.role === 'assistant') {
            return [...prev.slice(0, -1), { ...lastMessage, content: accumulatedResponse }];
          } else {
            return [...prev, { role: 'assistant', content: accumulatedResponse }];
          }
        });
      }

      // Save the full AI response to the database
      const chatRef = collection(db, 'chats', chatId, 'messages');
      await addDoc(chatRef, {
        content: accumulatedResponse,
        role: 'assistant',
        timestamp: serverTimestamp()
      });

      // After receiving the first response
      if (chatMessages.length === 0) {
        const chatRef = doc(db, 'chats', chatId);
        await updateDoc(chatRef, {
          title: truncateTitle(input, 50) // Use the first user message as the title
        });
      }

    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Request was aborted');
      } else {
        console.error("Error in chat:", error);
      }
    }
  };

  const truncateTitle = (title, maxLength = 50) => {
    if (!title) return 'Untitled Chat';
    if (title.length <= maxLength) return title;
    return title.substr(0, maxLength) + '...';
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-100">
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {chatMessages.map((message, index) => (
          <Message key={index} role={message.role} content={message.content} />
        ))}
      </div>
      <footer className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="relative">
            <input
              className="w-full p-3 pr-24 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={input}
              placeholder="Type your message here"
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-3 bottom-3 bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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