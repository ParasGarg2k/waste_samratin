'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  Eye, 
  Download, 
  Truck,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  MapPin,
  X,
  User,
  Phone,
  Mail,
  Star
} from 'lucide-react'

export default function CollectorsTab() {
  const [collectors, setCollectors] = useState([
    {
      id: 1,
      name: 'John Smith',
      area: 'North Zone',
      status: 'active',
      rating: 4.8,
      collections: 156,
      phone: '+1234567890',
      email: 'john.smith@example.com'
    },
    {
      id: 2,
      name: 'Sarah Wilson',
      area: 'South Zone',
      status: 'active',
      rating: 4.9,
      collections: 203,
      phone: '+1234567891',
      email: 'sarah.wilson@example.com'
    },
    {
      id: 3,
      name: 'Michael Brown',
      area: 'East Zone',
      status: 'inactive',
      rating: 4.2,
      collections: 89,
      phone: '+1234567892',
      email: 'michael.brown@example.com'
    },
    {
      id: 4,
      name: 'Emily Davis',
      area: 'West Zone',
      status: 'pending',
      rating: 4.7,
      collections: 134,
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

  return (
    <div className="admin-fade-in">
      {/* Header Section */}
      {/* Stats Overview */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-md-6 col-lg-3">
          <div className="admin-stat-card">
            <h3 className="text-white-50 mb-2">Total Collectors</h3>
            <div className="stat-value">{collectors.length}</div>
            <div className="mt-2 text-white-50">Active waste collectors</div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <div className="admin-stat-card">
            <h3 className="text-white-50 mb-2">Active Today</h3>
            <div className="stat-value">
              {collectors.filter(c => c.status === 'active').length}
            </div>
            <div className="mt-2 text-white-50">Currently on duty</div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <div className="admin-stat-card">
            <h3 className="text-white-50 mb-2">Total Collections</h3>
            <div className="stat-value">
              {collectors.reduce((sum, c) => sum + c.collections, 0)}
            </div>
            <div className="mt-2 text-white-50">Waste collections completed</div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <div className="admin-stat-card">
            <h3 className="text-white-50 mb-2">Average Rating</h3>
            <div className="stat-value">
              {(collectors.reduce((sum, c) => sum + c.rating, 0) / collectors.length).toFixed(1)}
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
                placeholder="Search collectors..."
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

      {/* Collectors List */}
      <div className="admin-card">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="h5 mb-0">Collectors Overview</h2>
        </div>
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Collector</th>
                <th>Area</th>
                <th>Status</th>
                <th>Rating</th>
                <th>Collections</th>
                <th>Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {collectors.map((collector) => (
                <tr key={collector.id}>
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      <div className="rounded-circle bg-primary bg-opacity-10 p-2">
                        <User size={24} className="text-primary" />
                      </div>
                      <div>
                        <div className="fw-semibold text-dark">{collector.name}</div>
                        <div className="text-muted small">ID: #{collector.id.toString().padStart(4, '0')}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <MapPin size={16} className="text-secondary" />
                      <span className="fw-medium">{collector.area}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge bg-${getStatusColor(collector.status)} bg-opacity-10 text-${getStatusColor(collector.status)} px-3 py-2`}>
                      {collector.status.charAt(0).toUpperCase() + collector.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div className="d-flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < Math.floor(collector.rating) ? "text-warning fill-warning" : "text-muted"}
                            fill={i < Math.floor(collector.rating) ? "currentColor" : "none"}
                          />
                        ))}
                      </div>
                      <span className="fw-semibold">{collector.rating}</span>
                    </div>
                  </td>
                  <td>
                    <div className="fw-semibold text-dark">
                      {collector.collections.toLocaleString()}
                      <span className="text-muted small ms-1">pickups</span>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex flex-column gap-1">
                      <div className="d-flex align-items-center gap-2">
                        <Phone size={14} className="text-primary" />
                        <span className="fw-medium">{collector.phone}</span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <Mail size={14} className="text-primary" />
                        <span className="text-muted small">{collector.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="admin-btn btn-icon btn-sm btn-light" title="View Details">
                        <Eye size={16} className="text-primary" />
                      </button>
                      <button className="admin-btn btn-icon btn-sm btn-light" title="Remove Collector">
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