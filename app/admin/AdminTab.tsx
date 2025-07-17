'use client'

import { useState, useEffect } from 'react'
import { 
  Gift, 
  Settings, 
  BarChart3, 
  Users, 
  Award,
  Star,
  TrendingUp,
  Download,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  AlertTriangle,
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
  Line
} from 'recharts'

interface Reward {
  id: string
  name: string
  description: string
  pointsRequired: number
  discount: number
  isActive: boolean
  customersEligible: number
  totalRedeemed?: number
}

interface CustomerReward {
  id: string
  customerName: string
  accuracy: number
  totalWaste: number
  currentPoints: number
  eligibleRewards: string[]
  lastReward: string
}

interface RewardAnalytics {
  totalRewards: number
  activeRewards: number
  totalRedemptions: number
  totalPointsAwarded: number
  topRewards: { name: string; redemptions: number }[]
  monthlyStats: { month: string; rewards: number; points: number }[]
}

const hardcodedRewards = [
  {
    id: 'R001',
    name: '10% Discount on Next Bill',
    description: 'Get 10% discount on your next waste collection bill',
    pointsRequired: 100,
    discount: 10,
    isActive: true,
    customersEligible: 3,
    totalRedeemed: 12
  },
  {
    id: 'R002',
    name: 'Free Collection Week',
    description: 'One week of free waste collection service',
    pointsRequired: 200,
    discount: 100,
    isActive: true,
    customersEligible: 2,
    totalRedeemed: 7
  },
  {
    id: 'R003',
    name: 'Premium Bin Upgrade',
    description: 'Upgrade to a premium waste collection bin',
    pointsRequired: 300,
    discount: 50,
    isActive: false,
    customersEligible: 1,
    totalRedeemed: 2
  },
  {
    id: 'R004',
    name: 'Eco-Friendly Kit',
    description: 'Get a complete eco-friendly waste management kit',
    pointsRequired: 150,
    discount: 25,
    isActive: true,
    customersEligible: 4,
    totalRedeemed: 8
  },
  {
    id: 'R005',
    name: 'Priority Collection',
    description: 'Get priority waste collection for one month',
    pointsRequired: 250,
    discount: 75,
    isActive: true,
    customersEligible: 1,
    totalRedeemed: 3
  }
];

const hardcodedEligibleCustomers = [
  {
    id: 'C001',
    customerName: 'Amit Sharma',
    accuracy: 78,
    totalWaste: 38.2,
    currentPoints: 80,
    eligibleRewards: ['R001'],
    lastReward: '2024-07-10'
  },
  {
    id: 'C002',
    customerName: 'Priya Singh',
    accuracy: 82,
    totalWaste: 42.7,
    currentPoints: 120,
    eligibleRewards: ['R001', 'R002'],
    lastReward: '2024-07-09'
  },
  {
    id: 'C003',
    customerName: 'Rahul Verma',
    accuracy: 75,
    totalWaste: 29.5,
    currentPoints: 60,
    eligibleRewards: ['R001'],
    lastReward: '2024-07-08'
  },
  {
    id: 'C004',
    customerName: 'Sneha Iyer',
    accuracy: 80,
    totalWaste: 36.1,
    currentPoints: 95,
    eligibleRewards: ['R001', 'R004'],
    lastReward: '2024-07-07'
  },
  {
    id: 'C005',
    customerName: 'Vikas Patel',
    accuracy: 73,
    totalWaste: 41.3,
    currentPoints: 110,
    eligibleRewards: ['R001', 'R002'],
    lastReward: '2024-07-06'
  }
];

const hardcodedAnalytics = {
  totalRewards: 5,
  activeRewards: 4,
  totalRedemptions: 32,
  totalPointsAwarded: 465,
  topRewards: [
    { name: '10% Discount on Next Bill', redemptions: 12 },
    { name: 'Free Collection Week', redemptions: 7 },
    { name: 'Eco-Friendly Kit', redemptions: 8 },
    { name: 'Premium Bin Upgrade', redemptions: 2 },
    { name: 'Priority Collection', redemptions: 3 }
  ],
  monthlyStats: [
    { month: 'Jan', rewards: 5, points: 1200 },
    { month: 'Feb', rewards: 6, points: 1400 },
    { month: 'Mar', rewards: 4, points: 1100 },
    { month: 'Apr', rewards: 3, points: 900 },
    { month: 'May', rewards: 2, points: 700 },
    { month: 'Jun', rewards: 1, points: 500 }
  ]
};

export default function AdminTab() {
  const [rewards] = useState<Reward[]>(hardcodedRewards);
  const [eligibleCustomers] = useState<CustomerReward[]>(hardcodedEligibleCustomers);
  const [analytics] = useState<RewardAnalytics>(hardcodedAnalytics);
  const [activeTab, setActiveTab] = useState('rewards')
  const [showAddReward, setShowAddReward] = useState(false)
  const [loading] = useState(false)
  const [error] = useState<string | null>(null)
  const [totalUsers, setTotalUsers] = useState(1234)
  const [activeCollectors, setActiveCollectors] = useState(45)
  const [totalRewards, setTotalRewards] = useState(890)
  const [collectionRate, setCollectionRate] = useState(87)
  const [activities, setActivities] = useState([
    { id: 1, type: 'Collection', status: 'completed', date: '2025-07-17' },
    { id: 2, type: 'Reward', status: 'pending', date: '2025-07-17' },
    { id: 3, type: 'User', status: 'active', date: '2025-07-16' },
    { id: 4, type: 'Collection', status: 'failed', date: '2025-07-16' },
  ])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success'
      case 'pending':
        return 'warning'
      case 'failed':
        return 'danger'
      case 'active':
        return 'primary'
      default:
        return 'secondary'
    }
  }

  // Remove useEffect and API fetch logic

  const tabs = [
    { id: 'rewards', name: 'Reward Management', icon: Gift },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'settings', name: 'System Settings', icon: Settings }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'rewards':
        return (
          <div className="space-y-6">
            {/* Reward Management */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Reward Management</h2>
                <p className="text-gray-600">Manage customer rewards and incentives</p>
              </div>
              <button 
                onClick={() => setShowAddReward(true)}
                className="btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Reward
              </button>
            </div>

            {/* Reward Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Rewards</p>
                    <p className="text-2xl font-bold text-gray-900">{rewards.length}</p>
                  </div>
                  <div className="p-3 bg-primary-100 rounded-lg">
                    <Gift className="w-6 h-6 text-primary-600" />
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Rewards</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {rewards.filter(r => r.isActive).length}
                    </p>
                  </div>
                  <div className="p-3 bg-success-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-success-600" />
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Eligible Customers</p>
                    <p className="text-2xl font-bold text-gray-900">{eligibleCustomers.length}</p>
                  </div>
                  <div className="p-3 bg-warning-100 rounded-lg">
                    <Users className="w-6 h-6 text-warning-600" />
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Redemptions</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {rewards.reduce((acc, r) => acc + (r.totalRedeemed || 0), 0)}
                    </p>
                  </div>
                  <div className="p-3 bg-success-100 rounded-lg">
                    <Award className="w-6 h-6 text-success-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Rewards Table */}
            <div className="card">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Reward</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Points Required</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Discount</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rewards.map((reward) => (
                      <tr key={reward.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{reward.name}</p>
                            <p className="text-sm text-gray-500">{reward.description}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-medium text-gray-900">{reward.pointsRequired} pts</p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-medium text-success-600">{reward.discount}%</p>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            reward.isActive ? 'bg-success-100 text-success-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {reward.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex space-x-2">
                            <button className="text-primary-600 hover:text-primary-800">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="text-danger-600 hover:text-danger-800">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Eligible Customers */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Eligible Customers</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Customer</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Accuracy</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Points</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eligibleCustomers.slice(0, 5).map((customer) => (
                      <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <p className="font-medium text-gray-900">{customer.customerName}</p>
                        </td>
                        <td className="py-4 px-4">
                          <p className={`font-medium ${customer.accuracy >= 90 ? 'text-success-600' : 'text-warning-600'}`}>
                            {customer.accuracy}%
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-medium text-success-600">{customer.currentPoints} pts</p>
                        </td>
                        <td className="py-4 px-4">
                          <button className="text-primary-600 hover:text-primary-800">
                            Award Points
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )
      
      case 'analytics':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Reward Analytics</h2>
              <p className="text-gray-600">Track reward performance and customer engagement</p>
            </div>

            {analytics && (
              <>
                {/* Analytics Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="card">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Rewards</p>
                        <p className="text-2xl font-bold text-gray-900">{analytics.totalRewards}</p>
                      </div>
                      <div className="p-3 bg-primary-100 rounded-lg">
                        <Gift className="w-6 h-6 text-primary-600" />
                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Active Rewards</p>
                        <p className="text-2xl font-bold text-gray-900">{analytics.activeRewards}</p>
                      </div>
                      <div className="p-3 bg-success-100 rounded-lg">
                        <CheckCircle className="w-6 h-6 text-success-600" />
                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Redemptions</p>
                        <p className="text-2xl font-bold text-gray-900">{analytics.totalRedemptions}</p>
                      </div>
                      <div className="p-3 bg-warning-100 rounded-lg">
                        <Award className="w-6 h-6 text-warning-600" />
                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Points Awarded</p>
                        <p className="text-2xl font-bold text-gray-900">{analytics.totalPointsAwarded.toLocaleString()}</p>
                      </div>
                      <div className="p-3 bg-success-100 rounded-lg">
                        <Star className="w-6 h-6 text-success-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Redemptions</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analytics.monthlyStats}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="rewards" fill="#0ea5e9" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Rewards</h3>
                    <div className="space-y-4">
                      {analytics.topRewards.map((reward, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-primary-600">{index + 1}</span>
                            </div>
                            <span className="font-medium text-gray-900">{reward.name}</span>
                          </div>
                          <span className="text-sm text-gray-600">{reward.redemptions} redemptions</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )
      
      case 'settings':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
              <p className="text-gray-600">Configure system parameters and notifications</p>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Reward Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Points per kg of waste
                  </label>
                  <input
                    type="number"
                    defaultValue="10"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum accuracy for rewards
                  </label>
                  <input
                    type="number"
                    defaultValue="80"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Email Notifications</p>
                    <p className="text-sm text-gray-600">Send email alerts for reward redemptions</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">SMS Notifications</p>
                    <p className="text-sm text-gray-600">Send SMS alerts for reward redemptions</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading admin data...</div>
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
    <div className="admin-fade-in">
      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-md-6 col-lg-3">
          <div className="admin-stat-card">
            <h3>Total Users</h3>
            <div className="stat-value">{totalUsers}</div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <div className="admin-stat-card">
            <h3>Active Collectors</h3>
            <div className="stat-value">{activeCollectors}</div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <div className="admin-stat-card">
            <h3>Total Rewards</h3>
            <div className="stat-value">{totalRewards}</div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <div className="admin-stat-card">
            <h3>Collection Rate</h3>
            <div className="stat-value">{collectionRate}%</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-card">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="h5 mb-0">Recent Activity</h2>
          <button className="admin-btn admin-btn-primary">
            <Plus size={18} />
            Add New
          </button>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity.id}>
                  <td>#{activity.id}</td>
                  <td>{activity.type}</td>
                  <td>
                    <span className={`badge bg-${getStatusColor(activity.status)}`}>
                      {activity.status}
                    </span>
                  </td>
                  <td>{activity.date}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-outline-primary">
                        <Edit size={16} />
                      </button>
                      <button className="btn btn-sm btn-outline-danger">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts Section */}
      <div className="row g-4 mt-4">
        <div className="col-12 col-lg-8">
          <div className="admin-card">
            <h3 className="h5 mb-4">Collection Trends</h3>
            {/* Add your chart component here */}
          </div>
        </div>
        <div className="col-12 col-lg-4">
          <div className="admin-card">
            <h3 className="h5 mb-4">Distribution</h3>
            {/* Add your pie chart component here */}
          </div>
        </div>
      </div>
    </div>
  )
}