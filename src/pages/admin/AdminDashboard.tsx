import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { formatDOB, formatGeneralDate } from '../../utils/dateUtils';
import Layout from '../../components/Layout';
import { Search, Plus, Trash2, Edit2, Upload, FilePlus, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Download, RefreshCw } from 'lucide-react';

interface Staff {
    id: number;
    fileno: string;
    full_name: string;
    remark?: string | null;
    conr?: string | null;
    station?: string | null;
    qualification?: string | null;
    sex?: string | null;
    dob: string | null;
    dofa?: string | null;
    dopa?: string | null;
    doan?: string | null;
    rank?: string | null;
    state?: string | null;
    lga?: string | null;
    email?: string | null;
    phone?: string | null;
}

import StaffModal from '../../components/StaffModal';

const AdminDashboard: React.FC = () => {
    const [staffList, setStaffList] = useState<Staff[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const fetchStaff = async () => {
        try {
            const response = await api.get('/api/admin/staff');
            setStaffList(response.data);
        } catch (err) {
            console.error('Failed to fetch staff', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    const toggleRow = (id: number) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedRows(newExpanded);
    };

    const handleEdit = (staff: Staff) => {
        setSelectedStaff(staff);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setSelectedStaff(null);
        setIsModalOpen(true);
    };

    const handleDeleteAll = async () => {
        if (window.confirm('Are you sure you want to delete ALL staff records? This cannot be undone.')) {
            try {
                await api.delete('/api/admin/staff/delete-all');
                fetchStaff();
            } catch (err) {
                alert('Failed to delete records');
            }
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, mode: 'upload' | 'append' | 'bulk-update') => {
        const file = event.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            setLoading(true);
            let endpoint = '/api/admin/upload';
            if (mode === 'append') endpoint = '/api/admin/append';
            if (mode === 'bulk-update') endpoint = '/api/admin/bulk-update';

            await api.post(endpoint, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            fetchStaff();
            alert(`${mode.charAt(0).toUpperCase() + mode.slice(1).replace('-', ' ')} successful`);
        } catch (err) {
            alert('Upload failed');
        } finally {
            setLoading(false);
            // Reset input
            event.target.value = '';
        }
    };

    const handleExport = () => {
        if (staffList.length === 0) {
            alert('No data to export');
            return;
        }

        // CSV Header
        const headers = ['fileno', 'phone', 'email'];
        const csvRows = [headers.join(',')];

        // CSV Data
        staffList.forEach(staff => {
            const row = [
                staff.fileno || '',
                staff.phone || '',
                staff.email || ''
            ];
            csvRows.push(row.map(val => `"${val}"`).join(','));
        });

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `neco_staff_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredStaff = staffList.filter(s =>
        s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.fileno.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredStaff.length / rowsPerPage);
    const paginatedStaff = filteredStaff.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, rowsPerPage]);

    return (
        <Layout title="Administrator Dashboard">
            <div className="admin-actions">
                <div className="search-bar glass">
                    <Search size={20} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by name or file number..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="action-buttons">
                    <button className="btn-secondary" onClick={handleExport}>
                        <Download size={18} /> Export CSV
                    </button>
                    <label className="btn-secondary">
                        <Upload size={18} /> New Upload
                        <input type="file" hidden onChange={(e) => handleFileUpload(e, 'upload')} />
                    </label>
                    <label className="btn-secondary">
                        <FilePlus size={18} /> Append Data
                        <input type="file" hidden onChange={(e) => handleFileUpload(e, 'append')} />
                    </label>
                    <label className="btn-secondary">
                        <RefreshCw size={18} /> Bulk Update
                        <input type="file" hidden onChange={(e) => handleFileUpload(e, 'bulk-update')} />
                    </label>
                    <button className="btn-danger" onClick={handleDeleteAll}>
                        <Trash2 size={18} /> Delete All
                    </button>
                </div>
            </div>

            <div className="data-table-container glass">
                {loading ? (
                    <div className="loading">Loading staff records...</div>
                ) : (
                    <>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '40px' }}></th>
                                    <th>File No</th>
                                    <th>Full Name</th>
                                    <th>Rank</th>
                                    <th>Station</th>
                                    <th>DOB</th>
                                    <th>Contact</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedStaff.map(staff => (
                                    <React.Fragment key={staff.id}>
                                        <tr className={expandedRows.has(staff.id) ? 'expanded' : ''}>
                                            <td>
                                                <button className="icon-btn expand" onClick={() => toggleRow(staff.id)}>
                                                    {expandedRows.has(staff.id) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                </button>
                                            </td>
                                            <td><strong>{staff.fileno}</strong></td>
                                            <td>{staff.full_name}</td>
                                            <td>{staff.rank || '-'}</td>
                                            <td>{staff.station || '-'}</td>
                                            <td>{formatDOB(staff.dob)}</td>
                                            <td>
                                                <div className="contact-info">
                                                    <span>{staff.email || 'No email'}</span>
                                                    <span>{staff.phone || 'No phone'}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="row-actions">
                                                    <button className="icon-btn edit" onClick={() => handleEdit(staff)}><Edit2 size={16} /></button>
                                                    <button className="icon-btn delete"><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                        {expandedRows.has(staff.id) && (
                                            <tr className="detail-row">
                                                <td colSpan={8}>
                                                    <div className="detail-content">
                                                        <div className="detail-grid">
                                                            <div className="detail-item"><strong>LGA:</strong> {staff.lga || '-'}</div>
                                                            <div className="detail-item"><strong>State:</strong> {staff.state || '-'}</div>
                                                            <div className="detail-item"><strong>Sex:</strong> {staff.sex || '-'}</div>
                                                            <div className="detail-item"><strong>Qualification:</strong> {staff.qualification || '-'}</div>
                                                            <div className="detail-item"><strong>CONR:</strong> {staff.conr || '-'}</div>
                                                            <div className="detail-item"><strong>Remark:</strong> {staff.remark || '-'}</div>
                                                            <div className="detail-item"><strong>DOFA:</strong> {formatGeneralDate(staff.dofa)}</div>
                                                            <div className="detail-item"><strong>DOPA:</strong> {formatGeneralDate(staff.dopa)}</div>
                                                            <div className="detail-item"><strong>DOAN:</strong> {formatGeneralDate(staff.doan)}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                        <div className="pagination">
                            <div className="pagination-info">
                                Showing {((currentPage - 1) * rowsPerPage) + 1} to {Math.min(currentPage * rowsPerPage, filteredStaff.length)} of {filteredStaff.length} entries
                            </div>
                            <div className="pagination-controls">
                                <div className="rows-per-page">
                                    <label>Rows per page:</label>
                                    <select value={rowsPerPage} onChange={(e) => setRowsPerPage(Number(e.target.value))}>
                                        <option value={10}>10</option>
                                        <option value={25}>25</option>
                                        <option value={50}>50</option>
                                        <option value={100}>100</option>
                                    </select>
                                </div>
                                <div className="page-buttons">
                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(p => p - 1)}
                                        className="icon-btn"
                                    >
                                        <ChevronLeft size={18} />
                                    </button>
                                    <span className="page-indicator">Page {currentPage} of {totalPages}</span>
                                    <button
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(p => p + 1)}
                                        className="icon-btn"
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <StaffModal
                isOpen={isModalOpen}
                staff={selectedStaff}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchStaff}
            />

            <style>{`
        .admin-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
          margin-bottom: 2rem;
        }
        .search-bar {
          display: flex;
          align-items: center;
          padding: 0 1rem;
          flex: 1;
          max-width: 500px;
        }
        .search-icon {
          color: var(--text-muted);
        }
        .search-bar input {
          border: none;
          box-shadow: none;
          padding: 1rem;
          background: transparent;
        }
        .action-buttons {
          display: flex;
          gap: 1rem;
        }
        .btn-secondary {
          background: white;
          color: var(--primary);
          border: 1px solid var(--primary);
          padding: 0.8rem 1.2rem;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }
        .btn-danger {
          background: var(--error);
          color: white;
          padding: 0.8rem 1.2rem;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .data-table-container {
          overflow-x: auto;
          background: white;
        }
        .data-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .data-table th {
          padding: 1.2rem;
          border-bottom: 2px solid #eee;
          font-weight: 600;
          color: var(--text-muted);
        }
        .data-table td {
          padding: 1.2rem;
          border-bottom: 1px solid #eee;
        }
        .contact-info {
          display: flex;
          flex-direction: column;
          font-size: 0.85rem;
        }
        .row-actions {
          display: flex;
          gap: 0.5rem;
        }
        .icon-btn {
          padding: 0.5rem;
          border-radius: 4px;
          background: #f4f4f4;
        }
        .icon-btn.edit { color: var(--primary); }
        .icon-btn.delete { color: var(--error); }
        .loading {
          padding: 3rem;
          text-align: center;
          color: var(--text-muted);
        }
        .detail-row td {
          padding: 0;
          background-color: #f9f9f9;
        }
        .detail-content {
          padding: 1.5rem 2rem 1.5rem 4rem;
          border-left: 4px solid var(--primary);
        }
        .detail-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
        }
        .detail-item strong {
          color: var(--text-muted);
          font-size: 0.8rem;
          text-transform: uppercase;
          display: block;
        }
        .icon-btn.expand {
          background: transparent;
          color: var(--primary);
        }
        .pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-top: 1px solid #eee;
          background: white;
        }
        .pagination-info {
          font-size: 0.9rem;
          color: var(--text-muted);
        }
        .pagination-controls {
          display: flex;
          align-items: center;
          gap: 2rem;
        }
        .rows-per-page {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
        }
        .rows-per-page select {
          padding: 0.3rem;
          border-radius: 4px;
          border: 1px solid #ddd;
        }
        .page-buttons {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .page-indicator {
          font-size: 0.9rem;
          font-weight: 500;
        }
        @media (max-width: 1024px) {
          .admin-actions {
            flex-direction: column;
            align-items: stretch;
          }
          .search-bar {
            max-width: none;
          }
        }
      `}</style>
        </Layout>
    );
};

export default AdminDashboard;
