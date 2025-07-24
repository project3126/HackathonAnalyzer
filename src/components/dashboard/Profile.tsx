import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  User,
  Mail,
  Briefcase,
  Target,
  Edit3,
  Save,
  X,
  Award,
  Calendar
} from 'lucide-react';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentRole: user?.currentRole || '',
    desiredRole: user?.desiredRole || ''
  });

  const handleSave = () => {
    updateUser(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      currentRole: user?.currentRole || '',
      desiredRole: user?.desiredRole || ''
    });
    setIsEditing(false);
  };

  const profileStats = [
    { label: 'Level', value: user?.level || 1, icon: Award, color: 'blue' },
    { label: 'XP Points', value: user?.xp || 0, icon: Target, color: 'purple' },
    { label: 'Badges Earned', value: user?.badges?.length || 0, icon: Award, color: 'yellow' },
    { label: 'Days Active', value: '28', icon: Calendar, color: 'green' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
          <p className="text-gray-600">Manage your account and learning preferences</p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          </div>
        )}
      </div>

      {/* Profile Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {profileStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className={`bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100 p-6 rounded-xl border border-${stat.color}-200`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium text-${stat.color}-800`}>{stat.label}</p>
                  <p className={`text-3xl font-bold text-${stat.color}-900 mt-2`}>{stat.value}</p>
                </div>
                <IconComponent className={`w-8 h-8 text-${stat.color}-600`} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">{user?.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">{user?.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Briefcase className="w-4 h-4 inline mr-2" />
                Current Role
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.currentRole}
                  onChange={(e) => setFormData({ ...formData, currentRole: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Junior Developer"
                />
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                  {user?.currentRole || 'Not specified'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Target className="w-4 h-4 inline mr-2" />
                Desired Role
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.desiredRole}
                  onChange={(e) => setFormData({ ...formData, desiredRole: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Senior Full Stack Developer"
                />
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                  {user?.desiredRole || 'Not specified'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Skills & Badges */}
        <div className="space-y-6">
          {/* Current Skills */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Skills</h3>
            <div className="flex flex-wrap gap-2">
              {user?.skills?.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              )) || (
                <p className="text-gray-500 text-sm">No skills added yet</p>
              )}
            </div>
          </div>

          {/* Earned Badges */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Earned Badges</h3>
            <div className="grid grid-cols-2 gap-3">
              {user?.badges?.map((badge, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <Award className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">{badge}</span>
                </div>
              )) || (
                <p className="text-gray-500 text-sm col-span-2">No badges earned yet</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Learning Preferences */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Learning Preferences</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Preferred Learning Path</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="radio" name="learningPath" value="free" className="mr-2" defaultChecked />
                <span className="text-sm text-gray-700">Free Path - Basic content and community support</span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="learningPath" value="premium" className="mr-2" />
                <span className="text-sm text-gray-700">Premium Path - Full access with mentorship</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Difficulty Preference</label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="adaptive">Adaptive (Recommended)</option>
              <option value="beginner">Always Beginner</option>
              <option value="intermediate">Always Intermediate</option>
              <option value="advanced">Always Advanced</option>
            </select>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h3>
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Export Learning Data
          </button>
          <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
            Reset Progress
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}