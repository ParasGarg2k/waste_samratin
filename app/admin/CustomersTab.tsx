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
  X,
  User,
  Phone,
  Mail
} from 'lucide-react'

interface Customer {
  id: string
  name: string
  location: string
  status: string
  lastPickup: string
  totalRequests: number
  contactNumber: string
  email: string
}

export default function CustomersTab() {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: '001',
      name: 'Alice Johnson',
      location: 'South Zone',
      status: 'active',
      lastPickup: '2025-07-16',
      totalRequests: 45,
      contactNumber: '+1234567890',
      email: 'alice@example.com'
    },
    {
      id: '002',
      name: 'Bob Smith',
      location: 'North Zone',
      status: 'inactive',
      lastPickup: '2025-07-15',
      totalRequests: 30,
      contactNumber: '+1234567891',
      email: 'bob@example.com'
    },
    {
      id: '003',
      name: 'Charlie Brown',
      location: 'East Zone',
      status: 'pending',
      lastPickup: '2025-07-14',
      totalRequests: 20,
      contactNumber: '+1234567892',
      email: 'charlie@example.com'
    },
    {
      id: '004',
      name: 'David Wilson',
      location: 'West Zone',
      status: 'active',
      lastPickup: '2025-07-13',
      totalRequests: 50,
      contactNumber: '+1234567893',
      email: 'david@example.com'
    },
    {
      id: '005',
      name: 'Eva Green',
      location: 'Central Zone',
      status: 'inactive',
      lastPickup: '2025-07-12',
      totalRequests: 10,
      contactNumber: '+1234567894',
      email: 'eva@example.com'
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
      <div className="admin-card mb-4">
        <div className="row align-items-center">
          <div className="col-12 col-md-6 mb-3 mb-md-0">
            <div className="input-group">
              <span className="input-group-text">
                <Search size={18} />
              </span>
              <input
                type="text"
                className="form-control admin-input"
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="col-12 col-md-6 d-flex justify-content-md-end gap-2">
            <select 
              className="form-select admin-input w-auto"
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

      {/* Customers List */}
      <div className="admin-card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Location</th>
                <th>Status</th>
                <th>Last Pickup</th>
                <th>Total Requests</th>
                <th>Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div className="rounded-circle bg-light p-2">
                        <User size={24} />
                      </div>
                      <div>
                        <div className="fw-medium">{customer.name}</div>
                        <div className="text-muted small">#{customer.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-1">
                      <MapPin size={16} />
                      {customer.location}
                    </div>
                  </td>
                  <td>
                    <span className={`badge bg-${getStatusColor(customer.status)}`}>
                      {customer.status}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-1">
                      <Calendar size={16} />
                      {customer.lastPickup}
                    </div>
                  </td>
                  <td>{customer.totalRequests}</td>
                  <td>
                    <div className="d-flex flex-column">
                      <div className="d-flex align-items-center gap-1">
                        <Phone size={14} />
                        {customer.contactNumber}
                      </div>
                      <div className="d-flex align-items-center gap-1">
                        <Mail size={14} />
                        {customer.email}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-outline-primary">
                        <Eye size={16} />
                      </button>
                      <button className="btn btn-sm btn-outline-danger">
                        <X size={16} />
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