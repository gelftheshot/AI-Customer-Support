import Header from '@/components/header'
import Sidebar from '@/components/sidebar'
import Chat from '@/components/chat'
import '../styles/global.css'

const page = () => {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <Chat />
      </div>
    </div>
  )
}

export default page