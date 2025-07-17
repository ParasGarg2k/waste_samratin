'use client'

import { useState } from 'react'
import { 
  Search, 
  Eye, 
  Download, 
  MapPin, 
  X, 
  User, 
  Phone, 
  Mail, 
  Star 
} from 'lucide-react'

export default function CustomersTab() {
  const [customers, setcustomers] = useState([
    {
      id: 1,
      name: 'John Smith',
      area: 'North Zone',
      status: 'active',
      rating: 4.1,
      collections: 12,
      Accuracy: 78,
      Weight: 15,
      phone: '+1234567890',
      email: 'john.smith@example.com'
    },
    {
      id: 2,
      name: 'Sarah Wilson',
      area: 'South Zone',
      status: 'active',
      rating: 4.5,
      collections: 9,
      Accuracy: 80,
      Weight: 13,
      phone: '+1234567891',
      email: 'sarah.wilson@example.com'
    },
    {
      id: 3,
      name: 'Michael Brown',
      area: 'East Zone',
      status: 'inactive',
      rating: 3.9,
      collections: 7,
      Accuracy: 76,
      Weight: 11,
      phone: '+1234567892',
      email: 'michael.brown@example.com'
    },
    {
      id: 4,
      name: 'Emily Davis',
      area: 'West Zone',
      status: 'pending',
      rating: 4.3,
      collections: 10,
      Accuracy: 82,
      Weight: 14,
      phone: '+1234567893',
      email: 'emily.davis@example.com'
    }
  ])

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'success'
      case 'inactive':
        return 'danger'
      case 'pending':
        return 'warning'
      default:
        return 'secondary'
    }
  }

  const filteredCustomers = customers.filter(c => 
    (selectedStatus === 'all' || c.status === selectedStatus) &&
    (c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     c.area.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="admin-fade-in">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center">
        <h1 className="h3 mb-0">Customers Management</h1>
      </div>
      <p className="text-muted">Manage waste customers, their status, and performance metrics</p>

      {/* Stats Overview */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-md-6 col-lg-3">
          <div className="admin-stat-card">
            <h3 className="text-white-50 mb-2">Total customers</h3>
            <div className="stat-value">{customers.length}</div>
            <div className="mt-2 text-white-50">Active waste customers</div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <div className="admin-stat-card">
            <h3 className="text-white-50 mb-2">Active Today</h3>
            <div className="stat-value">
              {customers.filter(c => c.status === 'active').length}
            </div>
            <div className="mt-2 text-white-50">Currently on duty</div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <div className="admin-stat-card">
            <h3 className="text-white-50 mb-2">Total Collections</h3>
            <div className="stat-value">
              {customers.reduce((sum, c) => sum + c.collections, 0)}
            </div>
            <div className="mt-2 text-white-50">Waste collections completed</div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <div className="admin-stat-card">
            <h3 className="text-white-50 mb-2">Average Rating</h3>
            <div className="stat-value">
              {(customers.reduce((sum, c) => sum + c.rating, 0) / customers.length).toFixed(1)}
              <span className="fs-6 ms-1">/ 5.0</span>
            </div>
            <div className="mt-2 text-white-50">Customer satisfaction</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="admin-card mb-4">
        <div className="row align-items-center">
          <div className="col-12 col-md-6 mb-3 mb-md-0">
            <div className="input-group">
              <span className="input-group-text border-0 bg-light">
                <Search size={18} className="text-primary" />
              </span>
              <input
                type="text"
                className="form-control admin-input border-0 bg-light"
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="col-12 col-md-6 d-flex justify-content-md-end gap-2">
            <select 
              className="form-select admin-input border-0 bg-light"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
            <button className="admin-btn admin-btn-primary">
              <Download size={18} />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* customers List */}
      <div className="admin-card">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="h5 mb-0">Customers Overview</h2>
        </div>
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Address</th>
                <th>Status</th>
                <th>Rating</th>
                <th>Collections</th>
                <th>Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      <div className="rounded-circle bg-primary bg-opacity-10 p-2">
                        <User size={24} className="text-primary" />
                      </div>
                      <div>
                        <div className="fw-semibold text-dark">{customer.name}</div>
                        <div className="text-muted small">ID: #{customer.id.toString().padStart(4, '0')}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <MapPin size={16} className="text-secondary" />
                      <span className="fw-medium">{customer.area}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge bg-${getStatusColor(customer.status)} bg-opacity-10 text-${getStatusColor(customer.status)} px-3 py-2`}>
                      {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div className="d-flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < Math.floor(customer.rating) ? "text-warning fill-warning" : "text-muted"}
                            fill={i < Math.floor(customer.rating) ? "currentColor" : "none"}
                          />
                        ))}
                      </div>
                      <span className="fw-semibold">{customer.rating.toFixed(1)}</span>
                    </div>
                  </td>
                  <td>
                    <div className="fw-semibold text-dark">
                      {customer.collections}
                      <span className="text-muted small ms-1">pickups</span>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex flex-column gap-1">
                      <div className="d-flex align-items-center gap-2">
                        <Phone size={14} className="text-primary" />
                        <span className="fw-medium">{customer.phone}</span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <Mail size={14} className="text-primary" />
                        <span className="text-muted small">{customer.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="admin-btn btn-icon btn-sm btn-light" title="View Details">
                        <Eye size={16} className="text-primary" />
                      </button>
                      <button className="admin-btn btn-icon btn-sm btn-light" title="Remove customer">
                        <X size={16} className="text-danger" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
