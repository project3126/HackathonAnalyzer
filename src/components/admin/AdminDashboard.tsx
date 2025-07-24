import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AdminSidebar from './AdminSidebar';
import UserManagement from './UserManagement';
import Analytics from './Analytics';
import Reports from './Reports';
import SystemSettings from './SystemSettings';

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('analytics');
  const { user } = useAuth();

  const renderContent = () => {
    switch (activeSection) {
      case 'analytics':
        return <Analytics />;
      case 'users':
        return <UserManagement />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <SystemSettings />;
      default:
        return <Analytics />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Monitor platform performance and manage users
            </p>
          </div>
          {renderContent()}
        </div>
      </main>
    </div>
  );
}