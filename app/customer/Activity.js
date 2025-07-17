import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Calendar, 
  TrendingUp, 
  Award, 
  Clock, 
  CheckCircle,
  XCircle,
  Camera,
  Download,
  Filter
} from 'lucide-react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import CalendarModal from './CalendarModal';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Activity = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const today = new Date();
  const [calendarMonth, setCalendarMonth] = useState(today.getMonth());
  const [calendarYear, setCalendarYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null); // null means no modal open
  const [modalOpen, setModalOpen] = useState(false);
  // Default selected date: today
  // const [selectedDate, setSelectedDate] = useState(new Date());

  // Hardcoded waste data
  const wasteData = {
    wet: { amount: 2.5, accuracy: 96, unit: 'kg' },
    dry: { amount: 1.8, accuracy: 92, unit: 'kg' },
    red: { amount: 0.3, accuracy: 100, unit: 'kg' },
    mixed: { amount: 0.2, accuracy: 0, unit: 'kg' }
  };

  // Chart data for waste distribution
  const wasteChartData = {
    labels: ['Wet Waste', 'Dry Waste', 'Red Waste', 'Mixed Waste'],
    datasets: [
      {
        label: 'Amount (kg)',
        data: [wasteData.wet.amount, wasteData.dry.amount, wasteData.red.amount, wasteData.mixed.amount],
        backgroundColor: [
          '#8B4513', // wet
          '#FFD700', // dry
          '#DC143C', // red
          '#808080'  // mixed
        ],
        borderColor: [
          '#8B4513',
          '#FFD700',
          '#DC143C',
          '#808080'
        ],
        borderWidth: 2,
      },
    ],
  };

  // Accuracy chart data
  const accuracyChartData = {
    labels: ['Wet Waste', 'Dry Waste', 'Red Waste', 'Mixed Waste'],
    datasets: [
      {
        data: [wasteData.wet.accuracy, wasteData.dry.accuracy, wasteData.red.accuracy, wasteData.mixed.accuracy],
        backgroundColor: [
          'rgba(139, 69, 19, 0.8)',
          'rgba(255, 215, 0, 0.8)',
          'rgba(220, 20, 60, 0.8)',
          'rgba(128, 128, 128, 0.8)'
        ],
        borderColor: [
          '#8B4513',
          '#FFD700',
          '#DC143C',
          '#808080'
        ],
        borderWidth: 2,
      },
    ],
  };

  // Weekly trend data
  const weeklyTrendData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Waste Segregated (kg)',
        data: [2.1, 2.3, 1.9, 2.5, 2.8, 2.2, 2.0],
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
      },
    ],
  };

  // Calendar data with pickup status
  const calendarData = {
    '2024-01-15': { 
      status: 'picked', 
      images: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=150&fit=crop',
        'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200&h=150&fit=crop'
      ],
      waste: { wet: 1.2, dry: 0.8, red: 0.1, mixed: 0.05 }
    },
    '2024-01-16': { 
      status: 'picked', 
      images: [
        'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=200&h=150&fit=crop'
      ],
      waste: { wet: 0.9, dry: 1.1, red: 0.2, mixed: 0.1 }
    },
    '2024-01-17': { 
      status: 'pending', 
      images: [],
      waste: { wet: 0, dry: 0, red: 0, mixed: 0 }
    },
    '2024-01-18': { 
      status: 'scheduled', 
      images: [],
      waste: { wet: 0, dry: 0, red: 0, mixed: 0 }
    }
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  // Generate calendar days for the current month/year
  const generateCalendarDays = () => {
    const days = [];
    const startDate = new Date(calendarYear, calendarMonth, 1);
    const endDate = new Date(calendarYear, calendarMonth + 1, 0);
    // Find the day of week the month starts on (0=Sun, 6=Sat)
    const startDay = startDate.getDay();
    // Add blanks for days before the 1st
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    // Add all days in the month
    for (let d = 1; d <= endDate.getDate(); d++) {
      days.push(new Date(calendarYear, calendarMonth, d));
    }
    return days;
  };
  const calendarDays = generateCalendarDays();

  const getStatusColor = (status) => {
    switch (status) {
      case 'picked': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'scheduled': return 'bg-blue-500';
      default: return 'bg-gray-300';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'picked': return 'Picked Up';
      case 'pending': return 'Pending';
      case 'scheduled': return 'Scheduled';
      default: return 'No Pickup';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Activity Dashboard
        </h1>
        <p className="text-xl text-gray-600">
          Track your waste segregation progress and pickup history
        </p>
      </motion.div>

      {/* Tab Navigation */}
      <div className="card">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'calendar', label: 'Pickup Calendar', icon: Calendar }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(wasteData).map(([type, data], index) => (
                  <motion.div
                    key={type}
                    className="card p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 capitalize">
                        {type} Waste
                      </h3>
                      <div className={`w-3 h-3 rounded-full bg-waste-${type}`}></div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-gray-900">
                          {data.amount} {data.unit}
                        </span>
                        <Award className="w-5 h-5 text-yellow-500" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${data.accuracy}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-600">
                          {data.accuracy}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">Accuracy Rate</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Waste Distribution Chart */}
                <motion.div
                  className="card p-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Waste Distribution
                  </h3>
                  <Bar data={wasteChartData} options={chartOptions} />
                </motion.div>

                {/* Accuracy Chart */}
                <motion.div
                  className="card p-6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Segregation Accuracy
                  </h3>
                  <Doughnut data={accuracyChartData} options={doughnutOptions} />
                </motion.div>
              </div>

              {/* Weekly Trend */}
              <motion.div
                className="card p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Weekly Waste Trend
                  </h3>
                  <TrendingUp className="w-5 h-5 text-primary-600" />
                </div>
                <Line data={weeklyTrendData} options={chartOptions} />
              </motion.div>
            </motion.div>
          )}

          {/* Calendar Tab */}
          {activeTab === 'calendar' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Calendar Header with Month Navigation */}
              <div className="flex items-center justify-between mb-4">
                <button
                  className="p-2 rounded-full hover:bg-gray-200"
                  onClick={() => {
                    if (calendarMonth === 0) {
                      setCalendarMonth(11);
                      setCalendarYear(calendarYear - 1);
                    } else {
                      setCalendarMonth(calendarMonth - 1);
                    }
                  }}
                  aria-label="Previous Month"
                >
                  &lt;
                </button>
                <h3 className="text-lg font-semibold text-gray-900">
                  {today.toLocaleString('default', { month: 'long' })} {calendarYear}
                </h3>
                <button
                  className="p-2 rounded-full hover:bg-gray-200"
                  onClick={() => {
                    if (calendarMonth === 11) {
                      setCalendarMonth(0);
                      setCalendarYear(calendarYear + 1);
                    } else {
                      setCalendarMonth(calendarMonth + 1);
                    }
                  }}
                  aria-label="Next Month"
                >
                  &gt;
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-4">
                {/* Day headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}

                {/* Calendar days */}
                {calendarDays.map((day, index) => {
                  if (!day) {
                    return <div key={index} />; // blank cell
                  }
                  const dateKey = day.toISOString().split('T')[0];
                  const dayData = calendarData[dateKey];
                  const isToday = day.toDateString() === today.toDateString();
                  const isFuture = day > today;
                  return (
                    <motion.div
                      key={index}
                      className={`min-h-24 p-2 border rounded-lg transition-all duration-150 select-none ${
                        isToday ? 'bg-primary-50 border-primary-300' : 'bg-white border-gray-200'
                      } ${isFuture ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:bg-primary-50'} `}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.01 }}
                      onClick={() => {
                        if (!isFuture) {
                          setSelectedDate(day);
                          setModalOpen(true);
                        }
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-medium ${
                          isToday ? 'text-primary-600' : 'text-gray-900'
                        }`}>
                          {day.getDate()}
                        </span>
                        {dayData && (
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(dayData.status)}`}></div>
                        )}
                      </div>
                      {dayData && (
                        <div className="space-y-1">
                          <div className="text-xs text-gray-600">
                            {getStatusText(dayData.status)}
                          </div>
                          {dayData.images.length > 0 && (
                            <div className="flex space-x-1">
                              {dayData.images.slice(0, 2).map((img, idx) => (
                                <img
                                  key={idx}
                                  src={img}
                                  alt="Waste pickup"
                                  className="w-6 h-6 rounded object-cover"
                                />
                              ))}
                              {dayData.images.length > 2 && (
                                <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center">
                                  <span className="text-xs text-gray-600">+{dayData.images.length - 2}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Selected Date Details */}
              {/* Calendar Modal for Selected Date */}
              <CalendarModal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
                {selectedDate ? (() => {
                  const selKey = selectedDate.toISOString().split('T')[0];
                  const selData = calendarData[selKey];
                  return (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">
                        Pickup Details - {selectedDate.toLocaleDateString()}
                      </h4>
                      {!selData ? (
                        <div className="text-gray-500">No pickup data for this date.</div>
                      ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                          {/* Waste Details */}
                          <div>
                            <h5 className="font-medium text-gray-900 mb-3">Waste Collected</h5>
                            <div className="space-y-2">
                              {Object.entries(selData.waste).map(([type, amount]) => (
                                <div key={type} className="flex justify-between items-center">
                                  <span className="capitalize text-gray-600">{type} Waste</span>
                                  <span className="font-medium">{amount} kg</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          {/* Images */}
                          <div>
                            <h5 className="font-medium text-gray-900 mb-3">Collector Images</h5>
                            {selData.images.length === 0 ? (
                              <div className="text-gray-400">No images uploaded.</div>
                            ) : (
                              <div className="grid grid-cols-2 gap-2">
                                {selData.images.map((img, idx) => (
                                  <img
                                    key={idx}
                                    src={img}
                                    alt="Waste pickup"
                                    className="w-full h-20 object-cover rounded"
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })() : null}
              </CalendarModal>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Activity; 