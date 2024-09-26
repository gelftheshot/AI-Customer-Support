"use client";

import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';

const StartChat = () => {
  const router = useRouter();

  const handleStartChat = () => {
    const newChatId = uuidv4();
    router.push(`/chat/${newChatId}`);
  };

  return (
    <div className='w-full h-full flex items-center justify-center p-4'>
      <button 
        onClick={handleStartChat} 
        className='bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-8 md:px-10 py-4 md:py-5 rounded-full hover:from-purple-600 hover:to-indigo-600 transition duration-300 ease-in-out text-lg md:text-xl font-bold shadow-lg flex items-center space-x-2'
      >
        <span>Start New Conversation</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}

export default StartChat