import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, LayoutDashboard } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div className="app-layout">
      <nav className="sidebar glass">
        <div className="sidebar-top">
          <div className="sidebar-header">
            <img src="/images/neco.png" alt="NECO Logo" className="logo-small" />
            <h2>NECO Staff</h2>
          </div>

          <div className="nav-links">
            <button className="nav-item active" onClick={() => navigate(role === 'admin' ? '/admin/dashboard' : '/staff/dashboard')}>
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </button>
            {role === 'staff' && (
              <button className="nav-item" onClick={() => navigate('/staff/profile')}>
                <User size={20} />
                <span>My Profile</span>
              </button>
            )}
          </div>
        </div>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      <main className="content">
        <header className="content-header">
          <h1>{title}</h1>
          <div className="user-info">
            <span className="badge">{role}</span>
            <button className="mobile-logout icon-btn" onClick={handleLogout} title="Logout">
              <LogOut size={20} />
            </button>
          </div>
        </header>
        <div className="content-body">
          {children}
        </div>
      </main>

      <style>{`
        .app-layout {
          display: flex;
          min-height: 100vh;
        }
        .sidebar {
          width: 260px;
          height: 100vh;
          position: sticky;
          top: 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 2rem 1.5rem;
          background: white;
          border-right: 1px solid #eee;
          z-index: 100;
        }
        .sidebar-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 3rem;
        }
        .logo-small {
          width: 40px;
        }
        .sidebar-header h2 {
          font-size: 1.2rem;
          color: var(--primary);
        }
        .nav-links {
          flex: 1;
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          width: 100%;
          padding: 1rem;
          border-radius: 8px;
          color: var(--text-muted);
          background: transparent;
          font-size: 1rem;
          margin-bottom: 0.5rem;
        }
        .nav-item:hover, .nav-item.active {
          background-color: rgba(0, 136, 68, 0.1);
          color: var(--primary);
        }
        .logout-btn {
          display: flex;
          align-items: center;
          gap: 1rem;
          width: 100%;
          padding: 1rem;
          color: var(--error);
          background: transparent;
        }
        .mobile-logout {
          display: none;
          color: var(--error);
        }
        .content {
          flex: 1;
          background-color: var(--bg-main);
          padding: 2rem;
          overflow-y: auto;
        }
        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          gap: 1rem;
        }
        .content-header h1 {
          font-size: 1.5rem;
        }
        .user-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .badge {
          background: var(--primary);
          color: white;
          padding: 0.2rem 0.8rem;
          border-radius: 20px;
          font-size: 0.8rem;
          text-transform: capitalize;
        }
        @media (max-width: 768px) {
          .app-layout {
            flex-direction: column;
          }
          .sidebar {
            display: none;
          }
          .mobile-logout {
            display: flex;
          }
          .content {
            padding: 1.5rem 1rem;
          }
          .content-header h1 {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Layout;
