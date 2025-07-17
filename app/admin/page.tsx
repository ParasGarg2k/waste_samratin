'use client'

import { useState } from 'react'
import Dashboard from './Dashboard'
import CustomersTab from './CustomersTab'
import CollectorsTab from './CollectorsTab'
import AdminTab from './AdminTab'
import Sidebar from './Sidebar'
import Header from './Header'

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'customers', name: 'Customers', icon: '👥' },
    { id: 'collectors', name: 'Collectors', icon: '🚛' },
    { id: 'admin', name: 'Admin', icon: '⚙️' },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />
      case 'customers':
        return <CustomersTab />
      case 'collectors':
        return <CollectorsTab />
      case 'admin':
        return <AdminTab />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="admin-layout">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={tabs}
        isCollapsed={isSidebarCollapsed}
        onCollapsedChange={setIsSidebarCollapsed}
      />
      <div className={`admin-content ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Header isSidebarCollapsed={isSidebarCollapsed} />
        <main>
          {renderTabContent()}
        </main>
      </div>
    </div>
  )
} 