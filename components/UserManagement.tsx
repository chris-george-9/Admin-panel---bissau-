
import React, { useState, useMemo } from 'react';
import { 
  Users, 
  UserPlus, 
  Mail, 
  MapPin, 
  Shield, 
  MoreVertical,
  X,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Lock,
  Unlock,
  Filter
} from 'lucide-react';
import { User, UserRole, Department } from '../types';

interface UserManagementProps {
  users: User[];
  onAddUser: (user: User) => void;
  onUpdateStatus: (userId: string, status: 'Active' | 'Inactive') => void;
  searchTerm: string;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, onAddUser, onUpdateStatus, searchTerm }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ 
    name: '', 
    email: '', 
    role: UserRole.OPERATIONS_SPECIALIST, 
    department: Department.BISSAU 
  });

  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const roleStats = useMemo(() => {
    const stats: Record<string, number> = {};
    users.forEach(u => {
      stats[u.role] = (stats[u.role] || 0) + 1;
    });
    return stats;
  }, [users]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;

    onAddUser({
      id: `u-${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      department: newUser.department,
      status: 'Active',
      lastLogin: new Date().toISOString()
    });

    setNewUser({ 
      name: '', 
      email: '', 
      role: UserRole.OPERATIONS_SPECIALIST, 
      department: Department.BISSAU 
    });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Staff Directory</h2>
          <p className="text-slate-500">Access control for London HQ and Bissau Hub operations.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-xl hover:bg-slate-800 transition-all active:scale-95"
        >
          <UserPlus size={18} />
          Provision New Staff
        </button>
      </div>

      {/* Role Summary Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Object.values(UserRole).map(role => (
          <div key={role} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{role}</span>
            <span className="text-xl font-black text-slate-800">{roleStats[role] || 0}</span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-400" />
            <span className="text-xs font-bold text-slate-500">Showing {filteredUsers.length} Team Members</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                <th className="px-6 py-4">Staff Member</th>
                <th className="px-6 py-4">Role & Access</th>
                <th className="px-6 py-4">Hub Location</th>
                <th className="px-6 py-4">Last Active</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border ${user.department === Department.LONDON ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                        {user.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 text-sm">{user.name}</span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Mail size={10} /> {user.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                      <Shield size={14} className="text-orange-500" />
                      {user.role}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 w-fit ${
                      user.department === Department.LONDON ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      <MapPin size={12} />
                      {user.department} Hub
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-slate-500 font-medium">
                      {new Date(user.lastLogin).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase w-fit ${
                      user.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-50 text-red-600'
                    }`}>
                      {user.status === 'Active' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onUpdateStatus(user.id, user.status === 'Active' ? 'Inactive' : 'Active')}
                        className={`p-2 rounded-lg transition-all ${user.status === 'Active' ? 'text-red-500 hover:bg-red-50' : 'text-emerald-500 hover:bg-emerald-50'}`}
                        title={user.status === 'Active' ? 'Suspend Access' : 'Restore Access'}
                      >
                        {user.status === 'Active' ? <Lock size={18} /> : <Unlock size={18} />}
                      </button>
                      <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-400">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-xl"><Briefcase size={20} /></div>
                <h3 className="text-xl font-bold text-slate-800">Provision Staff</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} className="text-slate-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Full Legal Name</label>
                <input 
                  required 
                  type="text" 
                  value={newUser.name} 
                  onChange={e => setNewUser({...newUser, name: e.target.value})} 
                  className="w-full p-3 bg-slate-100 border-none rounded-xl outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium" 
                  placeholder="e.g. John Doe" 
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Company Email</label>
                <input 
                  required 
                  type="email" 
                  value={newUser.email} 
                  onChange={e => setNewUser({...newUser, email: e.target.value})} 
                  className="w-full p-3 bg-slate-100 border-none rounded-xl outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium" 
                  placeholder="j.doe@bissauexpress.com" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Access Level</label>
                  <select 
                    value={newUser.role} 
                    onChange={e => setNewUser({...newUser, role: e.target.value as UserRole})}
                    className="w-full p-3 bg-slate-100 border-none rounded-xl outline-none focus:ring-2 focus:ring-orange-500 transition-all font-bold text-sm"
                  >
                    {Object.values(UserRole).map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Deployment Hub</label>
                  <select 
                    value={newUser.department} 
                    onChange={e => setNewUser({...newUser, department: e.target.value as Department})}
                    className="w-full p-3 bg-slate-100 border-none rounded-xl outline-none focus:ring-2 focus:ring-orange-500 transition-all font-bold text-sm"
                  >
                    <option value={Department.BISSAU}>Bissau Hub</option>
                    <option value={Department.LONDON}>London Hub</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full py-4 bg-slate-900 text-white font-black uppercase tracking-widest text-sm rounded-2xl shadow-lg hover:bg-black transition-all mt-4 flex items-center justify-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-400" />
                Confirm Provisioning
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
