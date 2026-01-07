import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { formatDOB, formatGeneralDate } from '../../utils/dateUtils';
import Layout from '../../components/Layout';
import { Save, User as UserIcon, Phone, Mail, MapPin, Briefcase, Calendar } from 'lucide-react';

interface StaffProfile {
    id: number;
    fileno: string;
    full_name: string;
    email: string | null;
    phone: string | null;
    rank: string | null;
    station: string | null;
    dob: string | null;
    qualification: string | null;
    sex: string | null;
    state: string | null;
    lga: string | null;
    dofa?: string | null;
    dopa?: string | null;
    doan?: string | null;
}

const StaffDashboard: React.FC = () => {
    const [profile, setProfile] = useState<StaffProfile | null>(null);
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/api/staff/me');
                setProfile(response.data);
                setEmail(response.data.email || '');
                setPhone(response.data.phone || '');
            } catch (err) {
                console.error('Failed to fetch profile', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) return;

        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const updatedProfile = { ...profile, email, phone };
            await api.put('/api/staff/me', updatedProfile);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to update profile.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Layout title="Loading..."><div className="loading">Loading your profile...</div></Layout>;
    if (!profile) return <Layout title="Error"><div>Profile not found</div></Layout>;

    return (
        <Layout title={`Welcome, ${profile.full_name}`}>
            <div className="staff-container">
                <div className="profile-grid">
                    {/* Main Info Card - Read Only */}
                    <div className="profile-card glass info-card">
                        <div className="card-header">
                            <UserIcon size={24} className="icon-green" />
                            <h3>Personal Information</h3>
                        </div>
                        <div className="info-grid">
                            <div className="info-item">
                                <label>File Number</label>
                                <div className="read-only-val">{profile.fileno}</div>
                            </div>
                            <div className="info-item">
                                <label>Full Name</label>
                                <div className="read-only-val">{profile.full_name}</div>
                            </div>
                            <div className="info-item">
                                <label><Calendar size={14} /> Date of Birth</label>
                                <div className="read-only-val">{formatDOB(profile.dob)}</div>
                            </div>
                            <div className="info-item">
                                <label>Sex</label>
                                <div className="read-only-val">{profile.sex || '-'}</div>
                            </div>
                            <div className="info-item">
                                <label><Briefcase size={14} /> Rank</label>
                                <div className="read-only-val">{profile.rank || '-'}</div>
                            </div>
                            <div className="info-item">
                                <label><MapPin size={14} /> Station</label>
                                <div className="read-only-val">{profile.station || '-'}</div>
                            </div>
                            <div className="info-item">
                                <label>State of Origin</label>
                                <div className="read-only-val">{profile.state || '-'}</div>
                            </div>
                            <div className="info-item">
                                <label>LGA</label>
                                <div className="read-only-val">{profile.lga || '-'}</div>
                            </div>
                            <div className="info-item full-width">
                                <label>Qualification</label>
                                <div className="read-only-val">{profile.qualification || '-'}</div>
                            </div>
                            <div className="info-item">
                                <label>DOFA</label>
                                <div className="read-only-val">{formatGeneralDate(profile.dofa)}</div>
                            </div>
                            <div className="info-item">
                                <label>DOPA</label>
                                <div className="read-only-val">{formatGeneralDate(profile.dopa)}</div>
                            </div>
                            <div className="info-item">
                                <label>DOAN</label>
                                <div className="read-only-val">{formatGeneralDate(profile.doan)}</div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Update Card - Editable */}
                    <div className="profile-card glass edit-card">
                        <div className="card-header">
                            <Phone size={24} className="icon-green" />
                            <h3>Contact Details</h3>
                        </div>
                        <p className="card-meta">You can only update your phone and email.</p>

                        <form onSubmit={handleUpdate} className="edit-form">
                            <div className="form-group">
                                <label><Mail size={16} /> Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div className="form-group">
                                <label><Phone size={16} /> Phone Number</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="Enter your phone number"
                                />
                            </div>

                            {message.text && (
                                <div className={`app-message ${message.type}`}>
                                    {message.text}
                                </div>
                            )}

                            <button type="submit" className="btn-primary update-btn" disabled={saving}>
                                {saving ? 'Saving...' : <><Save size={20} /> Update Profile</>}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <style>{`
        .staff-container {
          max-width: 1000px;
          margin: 0 auto;
        }
        .profile-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 2rem;
        }
        .profile-card {
          background: white;
          padding: 2rem;
        }
        .card-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
          color: var(--primary);
        }
        .icon-green { color: var(--primary); }
        .card-meta {
          color: var(--text-muted);
          font-size: 0.85rem;
          margin-bottom: 2rem;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }
        .info-item label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-bottom: 0.3rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .read-only-val {
          font-weight: 500;
          color: var(--text-main);
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #f0f0f0;
        }
        .full-width { grid-column: span 2; }
        .edit-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .update-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1rem;
        }
        .app-message {
          padding: 1rem;
          border-radius: 6px;
          font-size: 0.9rem;
        }
        .app-message.success {
          background: rgba(67, 160, 71, 0.1);
          color: var(--success);
        }
        .app-message.error {
          background: rgba(229, 57, 53, 0.1);
          color: var(--error);
        }
        .loading {
          text-align: center;
          padding: 4rem;
          color: var(--text-muted);
        }
        @media (max-width: 900px) {
          .profile-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </Layout>
    );
};

export default StaffDashboard;
