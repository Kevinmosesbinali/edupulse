import React, { useState } from 'react';
import {
  GraduationCap,
  UserPlus,
  Search,
  Filter,
  Phone,
  Mail,
  BookOpen,
  Layers,
  Award,
  Calendar,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  ExternalLink,
  Briefcase,
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { Teacher } from '../../types';

export const TeacherManagementModule: React.FC = () => {
  const { teachers, classes, subjects, addTeacher, updateTeacher, deleteTeacher, currentUser } =
    useSchool();

  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [viewingTeacher, setViewingTeacher] = useState<Teacher | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: 'Male' as Teacher['gender'],
    department: 'Mathematics' as Teacher['department'],
    qualification: '',
    subjectsTaught: [] as string[],
    assignedClassIds: [] as string[],
    joinDate: new Date().toISOString().split('T')[0],
    status: 'active' as Teacher['status'],
  });

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      gender: 'Male',
      department: 'Mathematics',
      qualification: '',
      subjectsTaught: [],
      assignedClassIds: [],
      joinDate: new Date().toISOString().split('T')[0],
      status: 'active',
    });
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      email: teacher.email,
      phone: teacher.phone,
      gender: teacher.gender,
      department: teacher.department,
      qualification: teacher.qualification,
      subjectsTaught: teacher.subjectsTaught,
      assignedClassIds: teacher.assignedClassIds,
      joinDate: teacher.joinDate,
      status: teacher.status,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTeacher) {
      updateTeacher({
        ...editingTeacher,
        ...formData,
      });
      setEditingTeacher(null);
    } else {
      addTeacher(formData);
      setIsAddModalOpen(false);
    }
    resetForm();
  };

  const filteredTeachers = teachers.filter((t) => {
    const matchSearch =
      `${t.firstName} ${t.lastName} ${t.email} ${t.employeeId} ${t.department}`
        .toLowerCase()
        .includes(search.toLowerCase());
    const matchDept = selectedDept === 'all' || t.department === selectedDept;
    return matchSearch && matchDept;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-sky-600" />
            <span>Faculty & Teacher Management</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Managing {teachers.length} academic instructors and departmental heads
          </p>
        </div>

        {currentUser.role !== 'teacher' && (
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register Faculty Member</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search faculty by name, department, ID..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500 focus:bg-white transition-all text-xs"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium text-slate-700 cursor-pointer"
          >
            <option value="all">All Departments</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Sciences">Sciences</option>
            <option value="Languages">Languages</option>
            <option value="Humanities">Humanities</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Arts & Music">Arts & Music</option>
          </select>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'grid' ? 'bg-white shadow-xs text-sky-600' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Card Grid
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'table' ? 'bg-white shadow-xs text-sky-600' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Table View
          </button>
        </div>
      </div>

      {/* Teacher Cards Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTeachers.map((teacher) => {
            const assignedClassesList = classes.filter((c) =>
              teacher.assignedClassIds.includes(c.id)
            );
            const subjectsTaughtList = subjects.filter((s) =>
              teacher.subjectsTaught.includes(s.id)
            );

            return (
              <div
                key={teacher.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={teacher.avatar}
                        alt={teacher.firstName}
                        className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100 shadow-sm"
                      />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">
                          {teacher.firstName} {teacher.lastName}
                        </h4>
                        <span className="text-[10px] font-mono text-slate-500 block">
                          {teacher.employeeId}
                        </span>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                          {teacher.department}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                        teacher.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {teacher.status === 'on_leave' ? 'On Leave' : 'Active'}
                    </span>
                  </div>

                  {/* Qualification & Subjects */}
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                    <div className="flex items-start gap-1.5 text-slate-600">
                      <Award className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                      <span className="text-[11px] font-medium leading-tight">
                        {teacher.qualification}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-[11px] truncate">{teacher.email}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-[11px] font-mono">{teacher.phone}</span>
                    </div>

                    {/* Assigned Classes */}
                    <div className="pt-2">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                        Assigned Classes ({assignedClassesList.length})
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {assignedClassesList.length > 0 ? (
                          assignedClassesList.map((c) => (
                            <span
                              key={c.id}
                              className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-semibold"
                            >
                              {c.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 text-[10px]">No assigned classes</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setViewingTeacher(teacher)}
                    className="text-xs font-bold text-sky-600 hover:text-sky-700 cursor-pointer"
                  >
                    View Full Profile
                  </button>

                  <div className="flex items-center gap-1">
                    {currentUser.role !== 'teacher' && (
                      <button
                        onClick={() => handleOpenEdit(teacher)}
                        className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => {
                          if (confirm(`Remove faculty member ${teacher.firstName} ${teacher.lastName}?`)) {
                            deleteTeacher(teacher.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Faculty Member</th>
                  <th className="py-3 px-3">Employee ID</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3">Qualification</th>
                  <th className="py-3 px-3">Contact</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTeachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={teacher.avatar}
                          alt={teacher.firstName}
                          className="w-9 h-9 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-bold text-slate-900">
                            {teacher.firstName} {teacher.lastName}
                          </p>
                          <p className="text-[11px] text-slate-400">{teacher.gender}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono font-medium text-slate-700">
                      {teacher.employeeId}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-sky-800 bg-sky-50 px-2 py-0.5 rounded text-[11px]">
                        {teacher.department}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 max-w-xs truncate">
                      {teacher.qualification}
                    </td>
                    <td className="py-3 px-3">
                      <p className="text-slate-800">{teacher.email}</p>
                      <p className="text-slate-500 font-mono text-[11px]">{teacher.phone}</p>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                          teacher.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {teacher.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingTeacher(teacher)}
                          className="p-1.5 text-slate-400 hover:text-sky-600 rounded-lg cursor-pointer"
                        >
                          <BookOpen className="w-4 h-4" />
                        </button>
                        {currentUser.role !== 'teacher' && (
                          <button
                            onClick={() => handleOpenEdit(teacher)}
                            className="p-1.5 text-slate-400 hover:text-amber-600 rounded-lg cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                        {currentUser.role === 'admin' && (
                          <button
                            onClick={() => {
                              if (confirm(`Remove faculty member ${teacher.firstName} ${teacher.lastName}?`)) {
                                deleteTeacher(teacher.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Teacher Modal */}
      {(isAddModalOpen || editingTeacher) && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl my-8 overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  {editingTeacher ? 'Edit Faculty Record' : 'Register New Faculty Member'}
                </h3>
                <p className="text-xs text-slate-500">
                  Fill in academic qualifications, department, and teaching assignments
                </p>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingTeacher(null);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="e.g. Marcus"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-sky-500 outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="e.g. Vance"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-sky-500 outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="m.vance@edupulse.edu"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-sky-500 outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-sky-500 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Department *</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-sky-500 outline-none"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Sciences">Sciences</option>
                    <option value="Languages">Languages</option>
                    <option value="Humanities">Humanities</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Arts & Music">Arts & Music</option>
                    <option value="Physical Education">Physical Education</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Gender *</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-sky-500 outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">Degree & Qualification *</label>
                  <input
                    type="text"
                    required
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    placeholder="e.g. M.Sc. Applied Mathematics, Cambridge"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-sky-500 outline-none"
                  />
                </div>
              </div>

              {/* Class Assignments Multi-select */}
              <div className="pt-2 border-t border-slate-100">
                <label className="font-semibold text-slate-700 block mb-1.5">
                  Assigned Classes (Select all that apply)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {classes.map((cls) => {
                    const isChecked = formData.assignedClassIds.includes(cls.id);
                    return (
                      <label
                        key={cls.id}
                        className={`flex items-center gap-2 p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-sky-50 border-sky-300 text-sky-900 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                assignedClassIds: [...formData.assignedClassIds, cls.id],
                              });
                            } else {
                              setFormData({
                                ...formData,
                                assignedClassIds: formData.assignedClassIds.filter((id) => id !== cls.id),
                              });
                            }
                          }}
                          className="rounded text-sky-600"
                        />
                        <span>{cls.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-sky-500 outline-none"
                >
                  <option value="active">Active Faculty</option>
                  <option value="on_leave">On Sabbatical / Leave</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingTeacher(null);
                  }}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold shadow-sm transition-colors cursor-pointer"
                >
                  {editingTeacher ? 'Update Faculty Details' : 'Register Faculty'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Teacher Details Modal */}
      {viewingTeacher && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-sky-900 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={viewingTeacher.avatar}
                  alt={viewingTeacher.firstName}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white/30"
                />
                <div>
                  <h3 className="text-lg font-bold">
                    {viewingTeacher.firstName} {viewingTeacher.lastName}
                  </h3>
                  <span className="text-xs text-sky-200 font-mono block">
                    ID: {viewingTeacher.employeeId}
                  </span>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-white/20 text-white">
                    {viewingTeacher.department}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setViewingTeacher(null)}
                className="p-1.5 text-white/70 hover:text-white rounded-lg bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <p>Qualification: <strong className="text-slate-900">{viewingTeacher.qualification}</strong></p>
                <p>Email: <strong className="text-slate-900">{viewingTeacher.email}</strong></p>
                <p>Phone: <strong className="text-slate-900 font-mono">{viewingTeacher.phone}</strong></p>
                <p>Date Joined: <span className="text-slate-800">{viewingTeacher.joinDate}</span></p>
              </div>

              <div>
                <h5 className="font-bold text-slate-900 mb-2">Assigned Class Sections:</h5>
                <div className="flex flex-wrap gap-1.5">
                  {classes
                    .filter((c) => viewingTeacher.assignedClassIds.includes(c.id))
                    .map((c) => (
                      <span
                        key={c.id}
                        className="px-3 py-1 bg-sky-50 text-sky-800 rounded-lg font-bold border border-sky-200"
                      >
                        {c.name} (Room {c.room})
                      </span>
                    ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setViewingTeacher(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
