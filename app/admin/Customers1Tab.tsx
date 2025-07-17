'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  Eye, 
  Download, 
  Star,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  MapPin,
  X
} from 'lucide-react'
import { 
  User,
  Phone,
  Mail
} from 'lucide-react'

interface Customer {
  id: string
  name: string
  address: string
  phone: string
  email: string
  totalWaste: number
  accuracy: number
  complaints: number
  feedback: number
  lastCollection: string
  status: 'active' | 'inactive' | 'suspended'
  rewards: number
}

const hardcodedCustomers = [
  {
    id: 'C001',
    name: 'Amit Sharma',
    address: 'Suncity, Bangalore',
    phone: '+91 98765-43210',
    email: 'amit.sharma@email.com',
    totalWaste: 38.2,
    accuracy: 78,
    complaints: 1,
    feedback: 4.1,
    lastCollection: '2024-07-10',
    status: 'active' as const,
    rewards: 80
  },
  {
    id: 'C002',
    name: 'Priya Singh',
    address: 'Suncity, Bangalore',
    phone: '+91 98765-43211',
    email: 'priya.singh@email.com',
    totalWaste: 42.7,
    accuracy: 82,
    complaints: 2,
    feedback: 4.3,
    lastCollection: '2024-07-09',
    status: 'active' as const,
    rewards: 120
  },
  {
    id: 'C003',
    name: 'Rahul Verma',
    address: 'Suncity, Bangalore',
    phone: '+91 98765-43212',
    email: 'rahul.verma@email.com',
    totalWaste: 29.5,
    accuracy: 75,
    complaints: 0,
    feedback: 3.9,
    lastCollection: '2024-07-08',
    status: 'active' as const,
    rewards: 60
  },
  {
    id: 'C004',
    name: 'Sneha Iyer',
    address: 'Suncity, Bangalore',
    phone: '+91 98765-43213',
    email: 'sneha.iyer@email.com',
    totalWaste: 36.1,
    accuracy: 80,
    complaints: 1,
    feedback: 4.0,
    lastCollection: '2024-07-07',
    status: 'active' as const,
    rewards: 95
  },
  {
    id: 'C005',
    name: 'Vikas Patel',
    address: 'Suncity, Bangalore',
    phone: '+91 98765-43214',
    email: 'vikas.patel@email.com',
    totalWaste: 41.3,
    accuracy: 73,
    complaints: 3,
    feedback: 3.7,
    lastCollection: '2024-07-06',
    status: 'active' as const,
    rewards: 110
  }
];

export default function CustomersTab() {
  const [customers, setCustomers] = useState<Customer[]>(hardcodedCustomers);
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.address.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success-100 text-success-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      case 'suspended':
        return 'bg-danger-100 text-danger-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return 'text-success-600'
    if (accuracy >= 80) return 'text-warning-600'
    return 'text-danger-600'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading customers...</div>
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
    <div className="customers-container">
      <div className="customers-header">
        <div>
          <h1>Customers Management</h1>
          <p>Manage customer data, waste collection, and feedback</p>
        </div>
        <button className="export-button">
          <Download className="w-4 h-4" />
          Export Data
        </button>
      </div>

      {/* Search and Filters */}
      <div className="search-filter-bar">
        <div className="search-input-wrapper">
          <Search className="search-icon w-4 h-4" />
          <input
            type="text"
            placeholder="Search customers by name, email, or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        <button className="filter-button">
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Stats Overview */}
      <div className="stats-grid">
        <div className="stat-card bg-gradient-to-br from-emerald-500 to-green-500">
          <div className="stat-header">
            <CheckCircle className="w-6 h-6 text-white" />
            <span className="text-white">Total Customers</span>
          </div>
          <div className="stat-value text-white">{customers.length}</div>
        </div>
        <div className="stat-card bg-gradient-to-br from-blue-500 to-indigo-500">
          <div className="stat-header">
            <Star className="w-6 h-6 text-white" />
            <span className="text-white">Avg. Accuracy</span>
          </div>
          <div className="stat-value text-white">
            {customers.length > 0 ? Math.round(customers.reduce((acc, c) => acc + c.accuracy, 0) / customers.length) : 0}%
          </div>
        </div>
        <div className="stat-card bg-gradient-to-br from-amber-500 to-orange-500">
          <div className="stat-header">
            <AlertTriangle className="w-6 h-6 text-white" />
            <span className="text-white">Total Complaints</span>
          </div>
          <div className="stat-value text-white">
            {customers.reduce((acc, c) => acc + c.complaints, 0)}
          </div>
        </div>
        <div className="stat-card bg-gradient-to-br from-purple-500 to-pink-500">
          <div className="stat-header">
            <Clock className="w-6 h-6 text-white" />
            <span className="text-white">Total Waste (kg)</span>
          </div>
          <div className="stat-value text-white">
            {customers.reduce((acc, c) => acc + c.totalWaste, 0).toFixed(1)}
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="table-container">
        <div className="overflow-x-auto">
          <table className="customers-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Address</th>
                <th>Contact</th>
                <th>Waste (kg)</th>
                <th>Accuracy</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">{customer.name}</span>
                      <span className="text-xs text-gray-500">#{customer.id}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-1.5 text-gray-400" />
                      <span className="text-sm">{customer.address}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-1.5 text-gray-400" />
                        <span>{customer.email}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-1.5 text-gray-400" />
                        <span>{customer.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm font-medium text-gray-900">
                    {customer.totalWaste.toFixed(1)} kg
                  </td>
                  <td className="py-4 px-6">
                    <div className={`text-sm font-medium ${getAccuracyColor(customer.accuracy)}`}>
                      {customer.accuracy}%
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                      ${customer.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : customer.status === 'inactive'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-red-100 text-red-800'
                      }`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => {
                          setSelectedCustomer(customer)
                          setShowDetails(true)
                        }}
                        className="text-gray-400 hover:text-gray-900 transition-colors duration-200"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Details Modal */}
      {showDetails && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="customer-modal">
            <div className="modal-header">
              <h2 className="modal-title">Customer Details</h2>
              <button
                onClick={() => setShowDetails(false)}
                className="close-button"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Personal Information</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Name:</span> {selectedCustomer.name}</p>
                  <p><span className="font-medium">Email:</span> {selectedCustomer.email}</p>
                  <p><span className="font-medium">Phone:</span> {selectedCustomer.phone}</p>
                  <p><span className="font-medium">Address:</span> {selectedCustomer.address}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Collection Data</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Total Waste:</span> {selectedCustomer.totalWaste.toFixed(1)} kg</p>
                  <p><span className="font-medium">Accuracy:</span> {selectedCustomer.accuracy}%</p>
                  <p><span className="font-medium">Complaints:</span> {selectedCustomer.complaints}</p>
                  <p><span className="font-medium">Feedback Rating:</span> {selectedCustomer.feedback}/5</p>
                  <p><span className="font-medium">Rewards Points:</span> {selectedCustomer.rewards}</p>
                  <p><span className="font-medium">Last Collection:</span> {selectedCustomer.lastCollection}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowDetails(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
                Edit Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 