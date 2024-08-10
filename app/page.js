import Header from '@/components/header'
import Sidebar from '@/components/sidebar'
import StartChat from '@/components/startchat'

const page = () => {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <StartChat />
      </div>
    </div>
  )
}

export default page