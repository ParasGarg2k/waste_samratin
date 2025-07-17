'use client'

import { useState } from 'react'
import { BarChart3, Users, Truck, Settings, Menu, X, LogOut, User } from 'lucide-react'

interface Tab {
  id: string
  name: string
  icon: string
}

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  tabs: Tab[]
}

export default function Sidebar({ activeTab, onTabChange, tabs }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const sidebarClass = `admin-sidebar ${isCollapsed ? 'collapsed' : ''}`

  const getIcon = (icon: string) => {
    switch (icon) {
      case '\ud83d\udcca':
        return <BarChart3 className="w-5 h-5" />
      case '\ud83d\udc65':
        return <Users className="w-5 h-5" />
      case '\ud83d\ude9b':
        return <Truck className="w-5 h-5" />
      case '\u2699\ufe0f':
        return <Settings className="w-5 h-5" />
      default:
        return <BarChart3 className="w-5 h-5" />
    }
  }

  return (
    <aside className={`relative flex flex-col h-screen bg-white/90 shadow-xl border-r border-gray-200 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      {/* Top Section */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
        {!isCollapsed && (
          <span className="text-xl font-bold text-primary-600 tracking-wide">Waste Admin</span>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-6">
        <ul className="space-y-2">
          {tabs.map((tab) => (
            <li key={tab.id}>
              <button
                onClick={() => onTabChange(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 font-medium text-base
                  ${activeTab === tab.id
                    ? 'bg-primary-100 text-primary-700 shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'}
                  ${isCollapsed ? 'justify-center' : ''}`}
              >
                {getIcon(tab.icon)}
                {!isCollapsed && <span>{tab.name}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Info & Logout */}
      {!isCollapsed && (
        <div className="absolute bottom-0 left-0 w-full px-6 pb-6">
          <div className="border-t pt-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 leading-none">Admin User</p>
                <p className="text-xs text-gray-500 leading-none">admin@waste.com</p>
              </div>
            </div>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 font-medium">
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </aside>
  )
} 