"use client";
import { useState, useEffect } from "react";
import { useChat } from 'ai/react';
import { useParams } from 'next/navigation';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import Message from "./message";

const Chat = () => {
  const [chatMessages, setChatMessages] = useState([]);
  const params = useParams();
  const chatId = params?.chatID;

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
    body: { chatId },
    onError: (error) => {
      console.error("Error in chat:", error);
    },
  });

  useEffect(() => {
    const initializeChat = async () => {
      if (!db || !chatId) return;
      
      try {
        const chatRef = doc(db, 'chats', chatId);
        await setDoc(chatRef, { createdAt: serverTimestamp() }, { merge: true });
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
              onChange={handleInputChange}
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