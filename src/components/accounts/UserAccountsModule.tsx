import React, { useState } from 'react';
import {
  ShieldAlert,
  UserCheck,
  KeyRound,
  Settings,
  Users,
  Check,
  Plus,
  RotateCcw,
  Sparkles,
  School,
  Lock,
  Edit2,
  X,
  CheckCircle2,
  DollarSign,
  GraduationCap,
  Briefcase,
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { UserAccount, UserRole } from '../../types';

export const UserAccountsModule: React.FC = () => {
  const {
    currentUser,
    switchUserRole,
    setCurrentUser,
    users,
    addUser,
    updateUser,
    settings,
    updateSettings,
    resetToSampleData,
  } = useSchool();

  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'settings'>('users');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [saveSettingsSuccess, setSaveSettingsSuccess] = useState(false);

  // Settings form
  const [settingsForm, setSettingsForm] = useState({
    name: settings.name,
    motto: settings.motto,
    address: settings.address,
    phone: settings.phone,
    email: settings.email,
    academicYear: settings.academicYear,
    currentTerm: settings.currentTerm,
    currency: settings.currency,
    principalName: settings.principalName,
  });

  // User form
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    role: 'teacher' as UserRole,
    department: 'Languages',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'active' as UserAccount['status'],
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    addUser({
      ...userForm,
      lastLogin: 'Never',
    });
    setIsAddUserOpen(false);
    setUserForm({
      name: '',
      email: '',
      role: 'teacher',
      department: 'Languages',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      status: 'active',
    });
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
    setSaveSettingsSuccess(true);
    setTimeout(() => setSaveSettingsSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-indigo-600" />
            <span>User Accounts & Institutional Administration</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Role-based security access (Administrator, Teacher, Bursar) and institutional configuration
          </p>
        </div>

        <div className="flex items-center gap-2">
          {currentUser.role === 'admin' && (
            <button
              onClick={() => setIsAddUserOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Account</span>
            </button>
          )}

          <button
            onClick={() => {
              if (
                confirm(
                  'Restore all default sample data? Any newly created entries will be reset.'
                )
              ) {
                resetToSampleData();
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            title="Reset system to clean demo seed data"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-1 bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-xs max-w-fit">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'users'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          Staff User Accounts ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('roles')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'roles'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          Role Permissions Matrix
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          School Profile & Preferences
        </button>
      </div>

      {/* Active Role Quick-Switching Banner */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl text-white shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500 shadow-md"
            />
            <div>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                Current Authenticated Session
              </span>
              <h4 className="text-base font-extrabold text-white">
                {currentUser.name}
              </h4>
              <p className="text-xs text-slate-300">
                Logged in as <strong className="text-indigo-300 uppercase">{currentUser.role}</strong> ({currentUser.email})
              </p>
            </div>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1.5 md:text-right">
              Switch persona to test permissions:
            </span>
            <div className="flex items-center gap-2">
              {(['admin', 'teacher', 'bursar'] as UserRole[]).map((role) => (
                <button
                  key={role}
                  onClick={() => switchUserRole(role)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                    currentUser.role === role
                      ? 'bg-white text-slate-950 shadow-md ring-2 ring-indigo-400'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {role === 'admin' ? '🛡️ Admin' : role === 'teacher' ? '📚 Teacher' : '💰 Bursar'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <span className="font-bold text-xs text-slate-800">
              Registered System Accounts ({users.length})
            </span>
            <span className="text-xs text-slate-500">
              Assigned credentials and module access levels
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-3">Email Address</th>
                  <th className="py-3 px-3">Designation / Role</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3">Last Active</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Switch Persona</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => {
                  const isCurrent = currentUser.id === user.id;

                  return (
                    <tr key={user.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block">{user.name}</span>
                            {isCurrent && (
                              <span className="text-[10px] font-bold text-emerald-600 block">
                                (Active Session)
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3 font-mono text-slate-600">{user.email}</td>

                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-extrabold capitalize ${
                            user.role === 'admin'
                              ? 'bg-purple-100 text-purple-800'
                              : user.role === 'teacher'
                              ? 'bg-sky-100 text-sky-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-slate-600">{user.department || 'General'}</td>

                      <td className="py-3 px-3 text-slate-400">{user.lastLogin || 'Recent'}</td>

                      <td className="py-3 px-3 text-center">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 capitalize border border-emerald-200">
                          {user.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setCurrentUser(user)}
                          disabled={isCurrent}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            isCurrent
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700'
                          }`}
                        >
                          {isCurrent ? 'Current' : 'Log in as'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'roles' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Administrator */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h4 className="text-base font-extrabold text-slate-900">Administrator</h4>
              <p className="text-xs text-slate-500 mt-1">
                Full governance, system settings, faculty records, student admissions, and financial oversight.
              </p>

              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Full access to all 8 modules</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Register/Delete students & teachers</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Configure institution settings & grading</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Audit fee payments & examination reports</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => switchUserRole('admin')}
              className="mt-6 w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              Test as Administrator
            </button>
          </div>

          {/* Teacher */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h4 className="text-base font-extrabold text-slate-900">Teacher / Tutor</h4>
              <p className="text-xs text-slate-500 mt-1">
                Academic classroom focus: recording daily roll calls, grade entry, and student academic progress.
              </p>

              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Daily student attendance register</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Enter & save examination marks</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>View class rosters & student profiles</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 line-through">
                  <X className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>Restricted from bursary & fee ledger</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => switchUserRole('teacher')}
              className="mt-6 w-full py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              Test as Teacher
            </button>
          </div>

          {/* Bursar */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6" />
              </div>
              <h4 className="text-base font-extrabold text-slate-900">Bursar / Accountant</h4>
              <p className="text-xs text-slate-500 mt-1">
                Financial treasury focus: fee collection, invoicing, payment receipts, and balance tracking.
              </p>

              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Record tuition payments</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Generate official payment receipts</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Track overdue accounts & balances</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 line-through">
                  <X className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>Restricted from modifying exam grades</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => switchUserRole('bursar')}
              className="mt-6 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              Test as Bursar
            </button>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 max-w-3xl">
          <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">School Profile & Preferences</h4>
              <p className="text-xs text-slate-500">
                These institutional details will appear on official report cards, fee receipts, and transcripts.
              </p>
            </div>
            {saveSettingsSuccess && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4" /> Saved!
              </span>
            )}
          </div>

          <form onSubmit={handleSaveSettings} className="mt-5 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Institution Name</label>
                <input
                  type="text"
                  required
                  value={settingsForm.name}
                  onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">School Motto / Tagline</label>
                <input
                  type="text"
                  required
                  value={settingsForm.motto}
                  onChange={(e) => setSettingsForm({ ...settingsForm, motto: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Academic Year</label>
                <input
                  type="text"
                  required
                  value={settingsForm.academicYear}
                  onChange={(e) => setSettingsForm({ ...settingsForm, academicYear: e.target.value })}
                  placeholder="e.g. 2026 - 2027"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Current Active Term</label>
                <input
                  type="text"
                  required
                  value={settingsForm.currentTerm}
                  onChange={(e) => setSettingsForm({ ...settingsForm, currentTerm: e.target.value })}
                  placeholder="e.g. Term 1"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Currency Symbol</label>
                <input
                  type="text"
                  required
                  value={settingsForm.currency}
                  onChange={(e) => setSettingsForm({ ...settingsForm, currency: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none font-bold"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Head of School / Principal</label>
                <input
                  type="text"
                  required
                  value={settingsForm.principalName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, principalName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold text-slate-700 block mb-1">Campus Address</label>
                <input
                  type="text"
                  required
                  value={settingsForm.address}
                  onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs transition-colors cursor-pointer"
              >
                Save Institutional Settings
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Add User Account */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Create User Account</h3>
              <button onClick={() => setIsAddUserOpen(false)} className="p-1.5 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  placeholder="e.g. Rachel Adams"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  placeholder="r.adams@edupulse.edu"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Security Role *</label>
                <select
                  value={userForm.role}
                  onChange={(e) => setUserForm({ ...userForm, role: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none font-bold"
                >
                  <option value="admin">Administrator (Full Access)</option>
                  <option value="teacher">Teacher / Faculty</option>
                  <option value="bursar">Bursar / Accounts Officer</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Department</label>
                <input
                  type="text"
                  value={userForm.department}
                  onChange={(e) => setUserForm({ ...userForm, department: e.target.value })}
                  placeholder="e.g. Science, Accounts, Administration"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
