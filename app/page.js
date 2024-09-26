import StartChat from '@/components/startchat'

const Page = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      <h1 className="text-4xl font-bold text-purple-800 mb-8">Welcome to AI Conversation Hub</h1>
      <p className="text-xl text-gray-600 mb-12 text-center max-w-2xl">
        Engage in intelligent conversations, get answers to your questions, and explore the possibilities of AI-powered communication.
      </p>
      <StartChat />
    </div>
  )
}

export default Page