'use client'

import { useState } from 'react'
import {
  Users,
  Truck,
  Trash2,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'

export default function Dashboard() {
  const stats = {
    totalCustomers: 1200,
    totalCollectors: 45,
    totalWasteCollected: 8740,
    averageAccuracy: 94.5,
  }

  const weeklyData = [
    { day: 'Mon', waste: 120, accuracy: 90 },
    { day: 'Tue', waste: 150, accuracy: 92 },
    { day: 'Wed', waste: 170, accuracy: 94 },
    { day: 'Thu', waste: 160, accuracy: 93 },
    { day: 'Fri', waste: 180, accuracy: 95 },
    { day: 'Sat', waste: 200, accuracy: 96 },
    { day: 'Sun', waste: 190, accuracy: 94 },
  ]

  const wasteTypeData = [
    { name: 'Organic', value: 45, color: '#10b981' },
    { name: 'Plastic', value: 30, color: '#3b82f6' },
    { name: 'E-waste', value: 15, color: '#f59e0b' },
    { name: 'Metal', value: 10, color: '#ef4444' },
  ]

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <p>Monitor your waste management operations in real-time</p>
      </div>

      <div className="dashboard-grid-4">
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers.toLocaleString()}
          icon={Users}
          color="bg-primary"
          change="+5.2% this week"
        />
        <StatCard
          title="Active Collectors"
          value={stats.totalCollectors}
          icon={Truck}
          color="bg-success"
          change="+2.1% this week"
        />
        <StatCard
          title="Waste Collected (kg)"
          value={stats.totalWasteCollected.toLocaleString()}
          icon={Trash2}
          color="bg-warning"
          change="+8.7% this week"
        />
        <StatCard
          title="Avg. Accuracy"
          value={`${stats.averageAccuracy}%`}
          icon={CheckCircle}
          color="bg-success"
          change="+3.2% this week"
        />
      </div>

      <div className="dashboard-grid-2">
        <div className="card">
          <h3>Weekly Waste Collection</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="waste" fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3>Accuracy Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="accuracy" stroke="#22c55e" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="dashboard-grid-3">
        <div className="card">
          <h3>Waste Type Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={wasteTypeData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {wasteTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3>Recent Activity</h3>
          <div className="recent-activity">
            <RecentActivityItem status="success" message="Collection completed" time="Route 12 - 2 minutes ago" />
            <RecentActivityItem status="warning" message="New complaint received" time="Customer #1247 - 5 minutes ago" />
            <RecentActivityItem status="primary" message="New customer registered" time="John Doe - 10 minutes ago" />
            <RecentActivityItem status="success" message="Reward redeemed" time="Customer #892 - 15 minutes ago" />
          </div>
        </div>

        <div className="card">
          <h3>Quick Actions</h3>
          <div className="quick-actions">
            <ActionButton label="Add New Customer" color="primary" />
            <ActionButton label="Schedule Collection" color="success" />
            <ActionButton label="View Complaints" color="warning" />
            <ActionButton label="Generate Report" color="gray" />
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon: Icon, color, change }) {
  return (
    <div className="card stat-card">
      <div className="stat-card-content">
        <div>
          <p className="stat-title">{title}</p>
          <p className="stat-value">{value}</p>
          {change && (
            <p className="stat-change">
              <TrendingUp className="icon small" />
              {change}
            </p>
          )}
        </div>
        <div className={`icon-box ${color}`}>
          <Icon className="icon white" />
        </div>
      </div>
    </div>
  )
}

function RecentActivityItem({ status, message, time }) {
  const colorMap = {
    success: 'dot-success',
    warning: 'dot-warning',
    primary: 'dot-primary'
  }
  return (
    <div className="recent-item">
      <div className={`dot ${colorMap[status]}`}></div>
      <div>
        <p className="recent-message">{message}</p>
        <p className="recent-time">{time}</p>
      </div>
    </div>
  )
}

function ActionButton({ label, color }) {
  const colorMap = {
    primary: 'btn-primary',
    success: 'btn-success',
    warning: 'btn-warning',
    gray: 'btn-gray'
  }
  return (
    <button className={`action-btn ${colorMap[color]}`}>
      {label}
    </button>
  )
}
