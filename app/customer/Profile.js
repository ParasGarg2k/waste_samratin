import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Award, 
  Trophy, 
  Star, 
  TrendingUp, 
  Calendar,
  Settings,
  Edit,
  Share,
  Download,
  Crown,
  Medal,
  Target,
  CheckCircle,
  Clock
} from 'lucide-react';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');

  // Hardcoded user data
  const userData = {
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    joinDate: "2023-06-15",
    totalWaste: 45.2,
    accuracyRate: 94.5,
    streak: 28,
    rank: 3,
    achievements: [
      { id: 1, name: "Perfect Week", description: "7 days of 100% accuracy", icon: Trophy, color: "text-yellow-500", earned: "2024-01-10" },
      { id: 2, name: "Waste Warrior", description: "Segregated 50kg of waste", icon: Award, color: "text-green-500", earned: "2024-01-05" },
      { id: 3, name: "Consistency King", description: "30-day streak", icon: Star, color: "text-blue-500", earned: "2024-01-01" }
    ],
    stats: {
      totalPickups: 45,
      totalWaste: 45.2,
      averageAccuracy: 94.5,
      bestAccuracy: 100,
      daysActive: 180
    }
  };

  // Hardcoded community leaderboard
  const leaderboard = [
    {
      id: 1,
      name: "Michael Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
      accuracy: 98.2,
      totalWaste: 67.8,
      rank: 1,
      streak: 45
    },
    {
      id: 2,
      name: "Emma Rodriguez",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
      accuracy: 96.7,
      totalWaste: 52.3,
      rank: 2,
      streak: 32
    },
    {
      id: 3,
      name: userData.name,
      avatar: userData.avatar,
      accuracy: userData.accuracyRate,
      totalWaste: userData.totalWaste,
      rank: 3,
      streak: userData.streak
    },
    {
      id: 4,
      name: "David Kim",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
      accuracy: 92.1,
      totalWaste: 38.9,
      rank: 4,
      streak: 18
    },
    {
      id: 5,
      name: "Lisa Wang",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50&h=50&fit=crop&crop=face",
      accuracy: 89.5,
      totalWaste: 29.7,
      rank: 5,
      streak: 12
    }
  ];

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2: return <Medal className="w-5 h-5 text-gray-400" />;
      case 3: return <Medal className="w-5 h-5 text-amber-600" />;
      default: return <span className="text-sm font-bold text-gray-500">{rank}</span>;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return "bg-gradient-to-r from-yellow-400 to-yellow-600";
      case 2: return "bg-gradient-to-r from-gray-300 to-gray-500";
      case 3: return "bg-gradient-to-r from-amber-500 to-amber-700";
      default: return "bg-white";
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
          Profile & Community
        </h1>
        <p className="text-xl text-gray-600">
          Your waste management journey and community rankings
        </p>
      </motion.div>

      {/* Tab Navigation */}
      <div className="card">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'profile', label: 'My Profile', icon: User },
              { id: 'leaderboard', label: 'Community', icon: Trophy }
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
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Profile Header */}
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                <div className="relative">
                  <img
                    src={userData.avatar}
                    alt={userData.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-primary-500 text-white rounded-full p-2">
                    <Edit className="w-4 h-4" />
                  </div>
                </div>
                
                <div className="text-center md:text-left flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{userData.name}</h2>
                  <p className="text-gray-600 mb-4">{userData.email}</p>
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Member since {new Date(userData.joinDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Target className="w-4 h-4" />
                      <span>Rank #{userData.rank}</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button className="btn-secondary flex items-center space-x-2">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <button className="btn-primary flex items-center space-x-2">
                    <Share className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: "Total Waste", value: `${userData.stats.totalWaste}kg`, icon: TrendingUp, color: "text-green-600" },
                  { label: "Accuracy Rate", value: `${userData.stats.averageAccuracy}%`, icon: Target, color: "text-blue-600" },
                  { label: "Current Streak", value: `${userData.streak} days`, icon: Clock, color: "text-purple-600" },
                  { label: "Total Pickups", value: userData.stats.totalPickups, icon: CheckCircle, color: "text-orange-600" }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="card p-6 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                    <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Achievements */}
              <div className="card p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Award className="w-6 h-6 text-yellow-500 mr-2" />
                  Achievements
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {userData.achievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.id}
                      className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className={`p-3 rounded-full bg-white ${achievement.color}`}>
                        <achievement.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{achievement.name}</h4>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Earned {new Date(achievement.earned).toLocaleDateString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="card p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
                <div className="space-y-4">
                  {[
                    { action: "Classified waste as Dry", accuracy: "98%", time: "2 hours ago" },
                    { action: "Achieved Perfect Week badge", accuracy: "100%", time: "1 day ago" },
                    { action: "Segregated 2.5kg of waste", accuracy: "94%", time: "2 days ago" },
                    { action: "Reached 30-day streak", accuracy: "96%", time: "3 days ago" }
                  ].map((activity, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                        <div>
                          <p className="font-medium text-gray-900">{activity.action}</p>
                          <p className="text-sm text-gray-600">{activity.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-primary-600">{activity.accuracy}</span>
                        <p className="text-xs text-gray-500">accuracy</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Leaderboard Tab */}
          {activeTab === 'leaderboard' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Community Leaderboard
                </h3>
                <p className="text-gray-600">
                  Top performers based on segregation accuracy and consistency
                </p>
              </div>

              {/* Top 3 Podium */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {leaderboard.slice(0, 3).map((user, index) => (
                  <motion.div
                    key={user.id}
                    className={`card p-6 text-center ${getRankColor(user.rank)}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    style={{ 
                      transform: index === 1 ? 'translateY(-10px)' : 'translateY(0)',
                      order: index === 1 ? 1 : index === 0 ? 2 : 3
                    }}
                  >
                    <div className="flex justify-center mb-4">
                      {getRankIcon(user.rank)}
                    </div>
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-16 h-16 rounded-full mx-auto mb-3 border-4 border-white"
                    />
                    <h4 className="font-bold text-gray-900 mb-1">{user.name}</h4>
                    <div className="space-y-1">
                      <p className="text-lg font-bold text-primary-600">{user.accuracy}%</p>
                      <p className="text-sm text-gray-600">Accuracy</p>
                      <p className="text-sm text-gray-500">{user.totalWaste}kg waste</p>
                      <p className="text-xs text-gray-500">{user.streak} day streak</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Full Leaderboard */}
              <div className="card p-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Complete Rankings</h4>
                <div className="space-y-3">
                  {leaderboard.map((user, index) => (
                    <motion.div
                      key={user.id}
                      className={`flex items-center justify-between p-4 rounded-lg ${
                        user.name === userData.name ? 'bg-primary-50 border border-primary-200' : 'bg-gray-50'
                      }`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {getRankIcon(user.rank)}
                          <span className="font-bold text-gray-900">#{user.rank}</span>
                        </div>
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.streak} day streak</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-bold text-primary-600">{user.accuracy}%</p>
                        <p className="text-sm text-gray-600">{user.totalWaste}kg</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Community Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: "Total Members", value: "1,247", icon: User },
                  { label: "Average Accuracy", value: "87.3%", icon: Target },
                  { label: "Total Waste Segregated", value: "2,456kg", icon: TrendingUp }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="card p-6 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary-600" />
                    <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile; 