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

interface DashboardStats {
  totalCustomers: number
  totalCollectors: number
  totalWasteCollected: number
  averageAccuracy: number
  pendingComplaints: number
  todayCollections: number
  weeklyGrowth: number
  landfillPercentage: number
  recyclePercentage: number
}

interface WeeklyData {
  day: string
  waste: number
  accuracy: number
}

interface WasteTypeData {
  name: string
  value: number
  color: string
}

const hardcodedStats = {
  totalCustomers: 5,
  totalCollectors: 5,
  totalWasteCollected: 187.8,
  averageAccuracy: 77.6,
  pendingComplaints: 7,
  todayCollections: 18,
  weeklyGrowth: 3.2,
  landfillPercentage: 62,
  recyclePercentage: 38
};
const hardcodedWeeklyData = [
  { day: 'Mon', waste: 28, accuracy: 75 },
  { day: 'Tue', waste: 32, accuracy: 78 },
  { day: 'Wed', waste: 27, accuracy: 80 },
  { day: 'Thu', waste: 24, accuracy: 76 },
  { day: 'Fri', waste: 30, accuracy: 79 },
  { day: 'Sat', waste: 23, accuracy: 74 },
  { day: 'Sun', waste: 23.8, accuracy: 80 }
];
const hardcodedWasteTypeData = [
  { name: 'Organic', value: 40, color: '#22c55e' },
  { name: 'Recyclable', value: 30, color: '#3b82f6' },
  { name: 'Hazardous', value: 10, color: '#f59e0b' },
  { name: 'General', value: 20, color: '#6b7280' }
];

export default function Dashboard() {
  const [stats] = useState(hardcodedStats);
  const [weeklyData] = useState(hardcodedWeeklyData);
  const [wasteTypeData] = useState(hardcodedWasteTypeData);
  const [loading] = useState(false)
  const [error] = useState<string | null>(null)

  // Remove useEffect and API fetch logic

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color, 
    change 
  }: {
    title: string
    value: string | number
    icon: any
    color: string
    change?: string
  }) => (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className="text-sm text-success-600 flex items-center mt-1">
              <TrendingUp className="w-4 h-4 mr-1" />
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading dashboard data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Monitor your waste management operations in real-time</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers.toLocaleString()}
          icon={Users}
          color="bg-primary-500"
          change="+5.2% this week"
        />
        <StatCard
          title="Active Collectors"
          value={stats.totalCollectors}
          icon={Truck}
          color="bg-success-500"
          change="+2.1% this week"
        />
        <StatCard
          title="Waste Collected (kg)"
          value={stats.totalWasteCollected.toLocaleString()}
          icon={Trash2}
          color="bg-warning-500"
          change="+8.7% this week"
        />
        <StatCard
          title="Avg. Accuracy"
          value={`${stats.averageAccuracy}%`}
          icon={CheckCircle}
          color="bg-success-500"
          change="+3.2% this week"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Waste Collection Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Waste Collection</h3>
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

        {/* Accuracy Trend Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Accuracy Trend</h3>
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

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Waste Type Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Waste Type Distribution</h3>
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

        {/* Recent Activity */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-success-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Collection completed</p>
                <p className="text-xs text-gray-500">Route 12 - 2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-warning-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">New complaint received</p>
                <p className="text-xs text-gray-500">Customer #1247 - 5 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">New customer registered</p>
                <p className="text-xs text-gray-500">John Doe - 10 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-success-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Reward redeemed</p>
                <p className="text-xs text-gray-500">Customer #892 - 15 minutes ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors">
              Add New Customer
            </button>
            <button className="w-full bg-success-500 text-white py-2 px-4 rounded-lg hover:bg-success-600 transition-colors">
              Schedule Collection
            </button>
            <button className="w-full bg-warning-500 text-white py-2 px-4 rounded-lg hover:bg-warning-600 transition-colors">
              View Complaints
            </button>
            <button className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors">
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 