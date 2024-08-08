import Link from 'next/link'
import '../styles/global.css'
import { RiChatNewFill } from "react-icons/ri";

const Header = () => {
  return (
    <header className='flex items-center h-16 px-4 text-white bg-blue-200 w-full'>
      <div className="flex items-center justify-between w-full max-w-screen-xl mx-auto">
        <Link href='/'>
          <p>logo</p>
        </Link>
        <h1 className="text-xl font-bold">AI Chat Assistant</h1>
        <button className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-full hover:bg-blue-700 transition-colors">
          <RiChatNewFill className="w-5 h-5" />
          <span>New Chat</span>
        </button>
      </div>
    </header>
  )
}

export default Header