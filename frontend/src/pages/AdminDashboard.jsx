import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../components/admin/Header';
import Sidebar from '../components/admin/Sidebar';
import Users from '../components/sidebarElements/Users';
import Services from '../components/sidebarElements/Services';
import Settings from '../components/sidebarElements/Settings';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();


  useEffect(() => {
    if (!user || !token || user.role !== 'admin') {
      navigate('/signin');
    }
  }, [user, token, navigate]);


  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <Users />;
      case 'services':
        return <Services />;
      case 'settings':
        return <Settings />;
      default:
        return <Users />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />
      <div className="flex" style={{ height: 'calc(100vh - 80px)' }}>
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 overflow-auto">{renderContent()}</main>
      </div>
    </div>
  );
};

export default AdminDashboard;
