import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './styles.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Waste Samaritan Admin Dashboard',
  description: 'Admin dashboard for waste management system with customer and collector management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} admin-scrollbar`}>
        <div className="admin-layout">
          <div className="admin-fade-in">
            {children}
          </div>
        </div>
        <Toaster position="top-right" />
      </body>
    </html>
  )
} 