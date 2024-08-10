import Link from 'next/link'
import '../styles/global.css'
import { RiChatNewFill } from "react-icons/ri";
import { v4 as uuidv4 } from 'uuid';

const Header = () => {
  return (
    <header className='flex items-center h-16 px-4 text-white bg-blue-600 w-full'>
      <div className="flex items-center justify-between w-full max-w-screen-xl mx-auto">
        <Link href='/'>
          <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
        </Link>
        <h1 className="text-xl font-bold">AI Chat Assistant</h1>
        <Link href={`/chat/${uuidv4()}`} className="flex items-center space-x-2 px-4 py-2 bg-white text-blue-600 rounded-full hover:bg-blue-100 transition-colors">
          <RiChatNewFill className="w-5 h-5" />
          <span>New Chat</span>
        </Link>
      </div>
    </header>
  )
}


export default Header