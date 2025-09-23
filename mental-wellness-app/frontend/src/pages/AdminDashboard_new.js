import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
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
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
);

function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [emailFilter, setEmailFilter] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel using API service
      const [studentsData, assessmentsData, analyticsData] = await Promise.all([
        apiService.admin.getStudents(),
        apiService.admin.getAssessments(),
        apiService.admin.getAnalytics()
      ]);

      setStudents(studentsData.students || []);
      setAssessments(assessmentsData.assessments || []);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterByEmail = async () => {
    if (!emailFilter.trim()) {
      fetchDashboardData();
      return;
    }

    try {
      const data = await apiService.admin.getAssessments(emailFilter);
      setAssessments(data.assessments || []);
    } catch (error) {
      console.error('Error filtering assessments:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const getSeverityColor = (severity) => {
    const colors = {
      'low': 'text-green-400',
      'moderate': 'text-yellow-400',
      'high': 'text-red-400',
      'severe': 'text-purple-400',
      'moderately-severe': 'text-purple-400'
    };
    return colors[severity?.toLowerCase()] || 'text-gray-400';
  };

  const getSeverityBadge = (severity) => {
    const badges = {
      'low': 'bg-green-900/30 text-green-300 border-green-500',
      'moderate': 'bg-yellow-900/30 text-yellow-300 border-yellow-500',
      'high': 'bg-red-900/30 text-red-300 border-red-500',
      'severe': 'bg-purple-900/30 text-purple-300 border-purple-500',
      'moderately-severe': 'bg-purple-900/30 text-purple-300 border-purple-500'
    };
    return badges[severity?.toLowerCase()] || 'bg-gray-900/30 text-gray-300 border-gray-500';
  };

  // Chart configurations
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#E5E7EB',
          font: { size: 12 }
        }
      },
      tooltip: {
        backgroundColor: '#1F2937',
        titleColor: '#E5E7EB',
        bodyColor: '#E5E7EB',
        borderColor: '#374151',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        ticks: { color: '#9CA3AF' },
        grid: { color: '#374151' }
      },
      y: {
        ticks: { color: '#9CA3AF' },
        grid: { color: '#374151' }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#E5E7EB',
          font: { size: 12 },
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: '#1F2937',
        titleColor: '#E5E7EB',
        bodyColor: '#E5E7EB',
        borderColor: '#374151',
        borderWidth: 1
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-400 mt-1">Mental Wellness Analytics & Management</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-400">Welcome back,</p>
                <p className="font-medium text-white">{JSON.parse(localStorage.getItem('user') || '{}').name}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: '📊' },
              { id: 'analytics', name: 'Analytics', icon: '📈' },
              { id: 'students', name: 'Students', icon: '👥' },
              { id: 'assessments', name: 'Assessments', icon: '📋' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Overview Tab */}
        {activeTab === 'overview' && analytics && (
          <div className="space-y-6">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: 'Total Students',
                  value: analytics.overview.total_students,
                  icon: '👥',
                  color: 'blue',
                  trend: '+12% from last month'
                },
                {
                  title: 'Total Assessments',
                  value: analytics.overview.total_assessments,
                  icon: '📋',
                  color: 'green',
                  trend: `${analytics.overview.recent_assessments} this week`
                },
                {
                  title: 'Average Score',
                  value: analytics.overview.average_score,
                  icon: '📊',
                  color: 'yellow',
                  trend: analytics.insights.trend
                },
                {
                  title: 'High Risk Students',
                  value: analytics.overview.high_risk_students,
                  icon: '⚠️',
                  color: 'red',
                  trend: 'Needs attention'
                }
              ].map((metric, index) => (
                <div key={index} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm font-medium">{metric.title}</p>
                      <p className="text-2xl font-bold text-white mt-1">{metric.value}</p>
                      <p className="text-xs text-gray-500 mt-1">{metric.trend}</p>
                    </div>
                    <div className={`text-3xl opacity-80`}>
                      {metric.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Insights */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">📈 Quick Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-900/50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-400">{analytics.overview.completion_rate}%</p>
                  <p className="text-sm text-gray-400">Assessment Completion Rate</p>
                </div>
                <div className="text-center p-4 bg-gray-900/50 rounded-lg">
                  <p className="text-2xl font-bold text-green-400">{analytics.insights.most_common_severity}</p>
                  <p className="text-sm text-gray-400">Most Common Severity</p>
                </div>
                <div className="text-center p-4 bg-gray-900/50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-400">{analytics.insights.average_monthly_assessments}</p>
                  <p className="text-sm text-gray-400">Avg Monthly Assessments</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && analytics && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">📊 Detailed Analytics</h2>
            
            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Severity Distribution Pie Chart */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Mental Health Severity Distribution</h3>
                <div className="h-80">
                  <Pie
                    data={{
                      labels: analytics.charts.severity_distribution.labels,
                      datasets: [{
                        data: analytics.charts.severity_distribution.data,
                        backgroundColor: analytics.charts.severity_distribution.colors,
                        borderColor: '#374151',
                        borderWidth: 2
                      }]
                    }}
                    options={pieOptions}
                  />
                </div>
              </div>

              {/* Score Distribution Bar Chart */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Assessment Score Distribution</h3>
                <div className="h-80">
                  <Bar
                    data={{
                      labels: analytics.charts.score_distribution.labels,
                      datasets: [{
                        label: 'Number of Students',
                        data: analytics.charts.score_distribution.data,
                        backgroundColor: 'rgba(59, 130, 246, 0.8)',
                        borderColor: 'rgba(59, 130, 246, 1)',
                        borderWidth: 1,
                        borderRadius: 4
                      }]
                    }}
                    options={chartOptions}
                  />
                </div>
              </div>

              {/* Monthly Trends Line Chart */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Assessment Trends (Last 6 Months)</h3>
                <div className="h-80">
                  <Line
                    data={{
                      labels: analytics.charts.monthly_trends.labels,
                      datasets: [{
                        label: 'Assessments Completed',
                        data: analytics.charts.monthly_trends.data,
                        borderColor: 'rgba(16, 185, 129, 1)',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.4,
                        pointBackgroundColor: 'rgba(16, 185, 129, 1)',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 6
                      }]
                    }}
                    options={chartOptions}
                  />
                </div>
              </div>

              {/* Completion Stats Doughnut Chart */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Assessment Participation</h3>
                <div className="h-80">
                  <Doughnut
                    data={{
                      labels: analytics.charts.completion_stats.labels,
                      datasets: [{
                        data: analytics.charts.completion_stats.data,
                        backgroundColor: analytics.charts.completion_stats.colors,
                        borderColor: '#374151',
                        borderWidth: 2
                      }]
                    }}
                    options={pieOptions}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">👥 Students ({students.length})</h2>
            </div>
            
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Joined</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Last Login</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {students.map((student, index) => (
                      <tr key={student.id} className="hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                              {student.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-white">{student.name}</div>
                              <div className="text-sm text-gray-400">ID: {student.id.substring(0, 8)}...</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{student.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {new Date(student.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {student.last_login ? new Date(student.last_login).toLocaleDateString() : 'Never'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Assessments Tab */}
        {activeTab === 'assessments' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-2xl font-bold text-white">📋 Assessments ({assessments.length})</h2>
              
              {/* Email Filter */}
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Filter by email..."
                  value={emailFilter}
                  onChange={(e) => setEmailFilter(e.target.value)}
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleFilterByEmail}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Filter
                </button>
                {emailFilter && (
                  <button
                    onClick={() => {
                      setEmailFilter('');
                      fetchDashboardData();
                    }}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Severity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Responses</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {assessments.map((assessment, index) => (
                      <tr key={assessment.id} className="hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">{assessment.user_email}</div>
                          <div className="text-sm text-gray-400">ID: {assessment.user_id.substring(0, 8)}...</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-lg font-bold text-white">{assessment.total_score}</div>
                          <div className="text-sm text-gray-400">out of 63</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getSeverityBadge(assessment.severity_level)}`}>
                            {assessment.severity_level}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {new Date(assessment.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => {
                              const responses = assessment.responses;
                              const formatted = typeof responses === 'string' 
                                ? JSON.parse(responses) 
                                : responses;
                              alert(`Responses:\n${JSON.stringify(formatted, null, 2)}`);
                            }}
                            className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;