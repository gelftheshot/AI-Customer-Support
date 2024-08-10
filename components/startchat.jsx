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
    <div className='w-full h-full flex items-center justify-center'>
      <button onClick={handleStartChat} className='bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out text-base font-medium'>
        Start New Conversation
      </button>
    </div>
  )
}

export default StartChat