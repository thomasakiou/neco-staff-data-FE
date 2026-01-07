import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Save } from 'lucide-react';
import api from '../services/api';

interface Staff {
    id?: number;
    fileno: string;
    full_name: string;
    email?: string | null;
    phone?: string | null;
    rank?: string | null;
    station?: string | null;
    dob?: string | null;
    qualification?: string | null;
    sex?: string | null;
    state?: string | null;
    lga?: string | null;
}

interface StaffModalProps {
    staff: Staff | null;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const StaffModal: React.FC<StaffModalProps> = ({ staff, isOpen, onClose, onSuccess }) => {
    const { register, handleSubmit, reset, setValue } = useForm<Staff>();

    useEffect(() => {
        if (staff) {
            Object.keys(staff).forEach((key) => {
                setValue(key as keyof Staff, staff[key as keyof Staff]);
            });
        } else {
            reset();
        }
    }, [staff, reset, setValue]);

    const onSubmit = async (data: Staff) => {
        try {
            if (staff?.id) {
                await api.put(`/api/admin/staff/${staff.id}`, data);
            } else {
                // Handle add if needed, although openapi only shows update
                alert('Add functionality not fully implemented in API yet, but update works.');
            }
            onSuccess();
            onClose();
        } catch (err) {
            alert('Failed to save staff data');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content glass">
                <div className="modal-header">
                    <h3>{staff?.id ? 'Edit Staff Member' : 'Add Staff Member'}</h3>
                    <button onClick={onClose} className="close-btn"><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="modal-form">
                    <div className="form-grid">
                        <div className="form-group">
                            <label>File Number</label>
                            <input {...register('fileno')} placeholder="e.g. NECO/HQ/..." required />
                        </div>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input {...register('full_name')} placeholder="Surname Firstname Lastname" required />
                        </div>
                        <div className="form-group">
                            <label>Rank</label>
                            <input {...register('rank')} placeholder="Job Title" />
                        </div>
                        <div className="form-group">
                            <label>Station</label>
                            <input {...register('station')} placeholder="Office/State Office" />
                        </div>
                        <div className="form-group">
                            <label>DOB (YYMMDD)</label>
                            <input {...register('dob')} placeholder="e.g. 810426" />
                            <small>Used as login password</small>
                        </div>
                        <div className="form-group">
                            <label>Phone</label>
                            <input {...register('phone')} placeholder="080..." />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input {...register('email')} type="email" placeholder="email@example.com" />
                        </div>
                        <div className="form-group">
                            <label>Sex</label>
                            <select {...register('sex')}>
                                <option value="">Select...</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" onClick={onClose} className="btn-cancel">Cancel</button>
                        <button type="submit" className="btn-primary">
                            <Save size={18} /> {staff?.id ? 'Update' : 'Save'} Staff
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
        }
        .modal-content {
          background: white;
          width: 100%;
          max-width: 700px;
          border-radius: 12px;
          padding: 2rem;
          max-height: 90vh;
          overflow-y: auto;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          color: var(--primary);
        }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          font-size: 0.9rem;
        }
        .form-group small {
          color: var(--text-muted);
          font-size: 0.75rem;
        }
        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          padding-top: 1.5rem;
          border-top: 1px solid #eee;
        }
        .btn-cancel {
          background: #eee;
          padding: 0.8rem 1.5rem;
          border-radius: 6px;
        }
        @media (max-width: 600px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </div>
    );
};

export default StaffModal;
