'use client'

import { useState } from 'react'
import { BarChart3, Users, Truck, Settings, Menu, X, LogOut, User } from 'lucide-react'

interface Tab {
  id: string
  name: string
  icon: string
}

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: Tab[];
  isCollapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

export default function Sidebar({ 
  activeTab, 
  onTabChange, 
  tabs,
  isCollapsed,
  onCollapsedChange 
}: SidebarProps) {
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
    <aside className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''}`} style={{ width: isCollapsed ? '4rem' : '16rem' }}>
      {/* Top Section */}
      <div className="sidebar-header">
        {!isCollapsed && (
          <span className="fw-bold fs-5">Waste Admin</span>
        )}
        <button
          onClick={() => onCollapsedChange(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        <div className="nav-items">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
              style={{ justifyContent: isCollapsed ? 'center' : 'flex-start' }}
            >
              {getIcon(tab.icon)}
              {!isCollapsed && <span className="nav-text">{tab.name}</span>}
            </button>
          ))}
        </div>
      </nav>

      {/* User Info & Logout */}
      {!isCollapsed && (
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="avatar">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm fw-semibold mb-0">Admin User</p>
              <p className="text-xs text-muted mb-0">admin@waste.com</p>
            </div>
          </div>
          <button className="nav-item w-100 mb-0">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </aside>
  )
}