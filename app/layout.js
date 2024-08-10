import Header from '@/components/header'
import Sidebar from '@/components/sidebar'
import '../styles/global.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="flex flex-col h-screen">
          <Header />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <main className="flex-1">{children}</main>
          </div>
        </div>
      </body>
    </html>
  )
}