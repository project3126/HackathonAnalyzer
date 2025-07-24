import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Home,
  Target,
  BookOpen,
  Brain,
  Video,
  TrendingUp,
  User,
  LogOut,
  Award
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export default function Sidebar({ activeSection, setActiveSection }: SidebarProps) {
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'skills', label: 'Skill Analysis', icon: Target },
    { id: 'learning', label: 'Learning Path', icon: BookOpen },
    { id: 'quiz', label: 'Adaptive Quiz', icon: Brain },
    { id: 'interview', label: 'Mock Interview', icon: Video },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">SkillForge</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-blue-600 font-medium">Level {user?.level}</span>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-purple-600 font-medium">{user?.xp} XP</span>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <IconComponent className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
}