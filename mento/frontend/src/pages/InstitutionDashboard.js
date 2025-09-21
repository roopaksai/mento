import React, { useState, useEffect } from 'react';
import { getCounselorRequests, getInstitutionStats, updateRequestStatus } from '../utils/api';

const InstitutionDashboard = ({ user }) => {
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [requestsResponse, statsResponse] = await Promise.all([
        getCounselorRequests(),
        getInstitutionStats()
      ]);

      setRequests(requestsResponse.data || []);
      setStats(statsResponse.data || {});
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Fallback data for development
      setRequests([
        {
          id: 1,
          user_name: "Anonymous Student",
          severity_level: "high",
          status: "pending",
          priority: "urgent",
          created_at: new Date().toISOString(),
          message: "High severity mental health assessment. Immediate support recommended."
        },
        {
          id: 2,
          user_name: "Anonymous Student",
          severity_level: "moderate",
          status: "assigned",
          priority: "normal",
          created_at: new Date(Date.now() - 86400000).toISOString(),
          message: "Student requesting counselor support after assessment."
        }
      ]);
      setStats({
        total_requests: 15,
        pending_requests: 3,
        urgent_requests: 1,
        weekly_tests: 45,
        average_severity: 2.3
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      await updateRequestStatus(requestId, newStatus);
      setRequests(prev => prev.map(req => 
        req.id === requestId ? { ...req, status: newStatus } : req
      ));
    } catch (error) {
      console.error('Error updating request status:', error);
      // For development, update locally
      setRequests(prev => prev.map(req => 
        req.id === requestId ? { ...req, status: newStatus } : req
      ));
    }
  };

  const filteredRequests = requests.filter(request => {
    if (filter === 'all') return true;
    if (filter === 'urgent') return request.priority === 'urgent';
    if (filter === 'pending') return request.status === 'pending';
    return true;
  });

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-orange-600 bg-orange-100';
      case 'assigned': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'normal': return 'text-blue-600 bg-blue-100';
      case 'low': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">⏳</div>
          <h3 className="text-xl font-semibold text-gray-700">Loading Dashboard...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🏥</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Institution Dashboard</h1>
          <p className="text-gray-600">{user.institution} - Mental Wellness Management</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-2xl font-bold text-blue-600">{stats?.total_requests || 0}</div>
            <div className="text-sm text-gray-600">Total Requests</div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl mb-2">⏰</div>
            <div className="text-2xl font-bold text-orange-600">{stats?.pending_requests || 0}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl mb-2">🚨</div>
            <div className="text-2xl font-bold text-red-600">{stats?.urgent_requests || 0}</div>
            <div className="text-sm text-gray-600">Urgent</div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl mb-2">📝</div>
            <div className="text-2xl font-bold text-green-600">{stats?.weekly_tests || 0}</div>
            <div className="text-sm text-gray-600">Weekly Tests</div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl mb-2">📈</div>
            <div className="text-2xl font-bold text-purple-600">{stats?.average_severity?.toFixed(1) || '0.0'}</div>
            <div className="text-sm text-gray-600">Avg Severity</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Filter Requests</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Requests
            </button>
            <button
              onClick={() => setFilter('urgent')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'urgent' 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Urgent Only
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'pending' 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending Only
            </button>
          </div>
        </div>

        {/* Counselor Requests */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-800">Counselor Requests</h3>
            <p className="text-gray-600">Manage student support requests</p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Severity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-2xl mr-3">👤</div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {request.user_name || 'Anonymous Student'}
                          </div>
                          <div className="text-sm text-gray-500">ID: {request.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(request.severity_level)}`}>
                        {request.severity_level}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(request.priority)}`}>
                        {request.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(request.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {request.status === 'pending' && (
                        <button
                          onClick={() => handleStatusUpdate(request.id, 'assigned')}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Assign
                        </button>
                      )}
                      {request.status === 'assigned' && (
                        <button
                          onClick={() => handleStatusUpdate(request.id, 'completed')}
                          className="text-green-600 hover:text-green-900"
                        >
                          Complete
                        </button>
                      )}
                      <button className="text-purple-600 hover:text-purple-900">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredRequests.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
              <p className="text-gray-500">
                {filter === 'all' 
                  ? 'No counselor requests at this time.' 
                  : `No ${filter} requests found.`}
              </p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-3">📞</div>
            <h3 className="font-bold text-gray-800 mb-2">Emergency Protocol</h3>
            <p className="text-sm text-gray-600 mb-4">For immediate crisis intervention</p>
            <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
              Activate Crisis Response
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="font-bold text-gray-800 mb-2">Weekly Report</h3>
            <p className="text-sm text-gray-600 mb-4">Generate institution wellness report</p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
              Generate Report
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-3">👥</div>
            <h3 className="font-bold text-gray-800 mb-2">Counselor Team</h3>
            <p className="text-sm text-gray-600 mb-4">Manage counselor assignments</p>
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
              Manage Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstitutionDashboard;