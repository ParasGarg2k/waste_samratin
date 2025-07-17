'use client'
import { useState } from 'react'
import { Bell, Settings, ChevronDown, Search, User } from 'lucide-react'

interface HeaderProps {
  isSidebarCollapsed?: boolean;
}

export default function Header({ isSidebarCollapsed = false }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header className={`admin-header ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="d-flex justify-content-between align-items-center w-100">
        {/* Logo and Title */}
        <div className="d-flex align-items-center gap-4">
          <img src="/globe.svg" alt="Logo" style={{ width: '2.75rem', height: '2.75rem' }} />
          <h1 className="h4 mb-0 fw-bold" style={{ letterSpacing: '-0.5px' }}>
            Waste Management Dashboard
          </h1>
        </div>
        {/* Search, Notifications, Settings, User */}
        <div className="d-flex align-items-center">
          {/* Search Bar */}
          <div className="search-bar">
            <span className="search-icon">
              <Search size={22} />
            </span>
            <input
              type="text"
              placeholder="Search in dashboard..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          {/* Notifications */}
          <button className="action-button">
            <Bell size={24} />
            <span className="notification-badge">3</span>
          </button>
          {/* Settings */}
          <button className="action-button">
            <Settings size={24} />
          </button>
          {/* User Profile */}
          <div className="user-profile">
            <div className="avatar">
              <User size={24} />
            </div>
            <div className="d-none d-md-block">
              <p className="h6 fw-semibold mb-0">Admin User</p>
              <p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>Administrator</p>
            </div>
            <ChevronDown size={20} className="ms-2 text-muted" />
          </div>
        </div>
      </div>
    </header>
  )
} 