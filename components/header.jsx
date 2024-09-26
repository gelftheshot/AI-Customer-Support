import Link from 'next/link'
import '../styles/global.css'
import { RiMenu2Line } from "react-icons/ri";
import { FaRobot } from "react-icons/fa";

const Header = ({ toggleSidebar, isMobile }) => {
  return (
    <header className='flex items-center h-16 px-6 text-white bg-gradient-to-r from-purple-600 to-indigo-600 w-full shadow-md'>
      <div className="flex items-center justify-between w-full max-w-screen-xl mx-auto">
        {isMobile && (
          <button onClick={toggleSidebar} className="text-white mr-4">
            <RiMenu2Line className="w-6 h-6" />
          </button>
        )}
        <Link href='/' className="flex items-center space-x-2">
          <FaRobot className="h-8 w-auto text-yellow-300" />
          <span className="text-2xl font-bold">AI Hub</span>
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/about" className="hover:text-yellow-300 transition-colors">About</Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-yellow-300 transition-colors">FAQ</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header;