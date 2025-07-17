'use client'
import { useState } from 'react'
import { Bell, Settings, ChevronDown, Search, User } from 'lucide-react'

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header className="admin-header">
      <div className="d-flex justify-content-between align-items-center w-100">
        {/* Logo and Title */}
        <div className="d-flex align-items-center gap-3">
          <img src="/globe.svg" alt="Logo" className="h-9 w-9" />
          <h1 className="h4 mb-0 fw-bold">Waste Management Dashboard</h1>
        </div>
        {/* Search, Notifications, Settings, User */}
        <div className="d-flex align-items-center gap-4">
          {/* Search Bar */}
          <div className="position-relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="w-5 h-5" />
            </span>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64 bg-white/70 shadow-sm"
            />
          </div>
          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow">3</span>
          </button>
          {/* Settings */}
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
            <Settings className="w-5 h-5" />
          </button>
          {/* User Profile */}
          <div className="flex items-center gap-2 ml-2">
            <div className="w-9 h-9 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow">
              <User className="w-5 h-5" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-gray-900 leading-none">Admin User</p>
              <p className="text-xs text-gray-500 leading-none">Administrator</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>
        </div>
      </div>
    </header>
  )
} 