import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const navItems = [
    { path: '/test', label: 'Assessment', icon: '📝' },
    { path: '/results', label: 'Results', icon: '📊' },
    { path: '/music', label: 'Music', icon: '🎵' },
    { path: '/chatbot', label: 'Chat', icon: '🤖' }
  ];

  if (user.institution) {
    navItems.push({ path: '/institution', label: 'Dashboard', icon: '🏥' });
  }

  return (
    <nav className="bg-white/80 backdrop-blur-lg shadow-lg sticky top-0 z-50 border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <div className="text-2xl font-bold text-purple-600">
              🧠 Mento
            </div>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200"
              >
                <span>{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-3">
              <div className="text-2xl">👤</div>
              <div>
                <div className="text-sm font-semibold text-gray-800">{user.name}</div>
                <div className="text-xs text-gray-500">{user.institution?.name || 'Individual User'}</div>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200/50">
        <div className="flex justify-around py-2">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center py-2 px-3 text-xs text-gray-600 hover:text-purple-600"
            >
              <span className="text-lg mb-1">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;