import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Download,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  FileSpreadsheet,
  Printer,
  Phone,
  Mail,
  MapPin,
  Calendar,
  HeartPulse,
  AlertTriangle,
  CheckCircle2,
  X,
  CreditCard,
  Award,
  IdCard,
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { Student } from '../../types';
import { PrintReportCard } from '../common/PrintReportCard';

interface StudentManagementProps {
  onOpenRecordFeeForStudent?: (studentId: string) => void;
}

export const StudentManagementModule: React.FC<StudentManagementProps> = ({
  onOpenRecordFeeForStudent,
}) => {
  const {
    students,
    classes,
    addStudent,
    updateStudent,
    deleteStudent,
    fees,
    attendanceRecords,
    exams,
    examMarks,
    subjects,
    settings,
    currentUser,
  } = useSchool();

  // Search & Filters
  const [search, setSearch] = useState('');
  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [selectedStudentForView, setSelectedStudentForView] = useState<Student | null>(null);
  const [studentForReportCard, setStudentForReportCard] = useState<Student | null>(null);
  const [studentForIdCard, setStudentForIdCard] = useState<Student | null>(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: 'Male' as Student['gender'],
    dob: '2009-01-01',
    classId: classes[0]?.id || '',
    admissionDate: new Date().toISOString().split('T')[0],
    bloodGroup: 'O+',
    parentName: '',
    parentRelationship: 'Father' as Student['parentRelationship'],
    parentPhone: '',
    parentEmail: '',
    homeAddress: '',
    emergencyContact: '',
    medicalNotes: '',
    status: 'active' as Student['status'],
  });

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      gender: 'Male',
      dob: '2009-01-01',
      classId: classes[0]?.id || '',
      admissionDate: new Date().toISOString().split('T')[0],
      bloodGroup: 'O+',
      parentName: '',
      parentRelationship: 'Father',
      parentPhone: '',
      parentEmail: '',
      homeAddress: '',
      emergencyContact: '',
      medicalNotes: '',
      status: 'active',
    });
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      gender: student.gender,
      dob: student.dob,
      classId: student.classId,
      admissionDate: student.admissionDate,
      bloodGroup: student.bloodGroup || 'O+',
      parentName: student.parentName,
      parentRelationship: student.parentRelationship,
      parentPhone: student.parentPhone,
      parentEmail: student.parentEmail,
      homeAddress: student.homeAddress,
      emergencyContact: student.emergencyContact,
      medicalNotes: student.medicalNotes || '',
      status: student.status,
    });
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudent) {
      updateStudent({
        ...editingStudent,
        ...formData,
      });
      setEditingStudent(null);
    } else {
      addStudent(formData);
      setIsAddModalOpen(false);
    }
    resetForm();
  };

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchSearch =
      `${s.firstName} ${s.lastName} ${s.admissionNo} ${s.parentName}`
        .toLowerCase()
        .includes(search.toLowerCase());
    const matchClass = selectedClassId === 'all' || s.classId === selectedClassId;
    const matchGender = selectedGender === 'all' || s.gender === selectedGender;
    const matchStatus = selectedStatus === 'all' || s.status === selectedStatus;
    return matchSearch && matchClass && matchGender && matchStatus;
  });

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Admission No,First Name,Last Name,Gender,Class,Parent Name,Phone,Email,Status\n'];
    const rows = filteredStudents.map((s) => {
      const cls = classes.find((c) => c.id === s.classId)?.name || 'N/A';
      return `"${s.admissionNo}","${s.firstName}","${s.lastName}","${s.gender}","${cls}","${s.parentName}","${s.parentPhone}","${s.parentEmail}","${s.status}"\n`;
    });
    const blob = new Blob([...headers, ...rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `edupulse_students_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Build subject map for report card
  const subjectsMap: Record<string, { name: string; code: string }> = {};
  subjects.forEach((s) => {
    subjectsMap[s.id] = { name: s.name, code: s.code };
  });

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <span>Student Management & Enrollment</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Showing {filteredStudents.length} of {students.length} enrolled students
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            title="Export filtered records to CSV"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          {currentUser.role !== 'bursar' && (
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register New Student</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name, ID or parent..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white transition-all text-xs"
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

          {/* Class Filter */}
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium text-slate-700 cursor-pointer"
          >
            <option value="all">All Classes</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Gender Filter */}
          <select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium text-slate-700 cursor-pointer"
          >
            <option value="all">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium text-slate-700 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="graduated">Graduated</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'table' ? 'bg-white shadow-xs text-indigo-600' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Table View
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'grid' ? 'bg-white shadow-xs text-indigo-600' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Grid Cards
          </button>
        </div>
      </div>

      {/* Main Student Directory View */}
      {filteredStudents.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No students found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or register a new student.
          </p>
          <button
            onClick={resetForm}
            className="mt-4 px-4 py-2 bg-indigo-50 text-indigo-600 font-semibold text-xs rounded-xl hover:bg-indigo-100 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : viewMode === 'table' ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-3">Admission No</th>
                  <th className="py-3 px-3">Class</th>
                  <th className="py-3 px-3">Parent / Contact</th>
                  <th className="py-3 px-3 text-center">Fee Status</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((student) => {
                  const studentClass = classes.find((c) => c.id === student.classId);
                  const fee = fees.find((f) => f.studentId === student.id);

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Name & Avatar */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={student.avatar}
                            alt={student.firstName}
                            className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200"
                          />
                          <div>
                            <span
                              onClick={() => setSelectedStudentForView(student)}
                              className="font-bold text-slate-900 hover:text-indigo-600 cursor-pointer block"
                            >
                              {student.firstName} {student.lastName}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {student.gender} • DOB: {student.dob}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Admission No */}
                      <td className="py-3 px-3">
                        <span className="font-mono font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {student.admissionNo}
                        </span>
                      </td>

                      {/* Class */}
                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-800">
                          {studentClass?.name || 'Unassigned'}
                        </span>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          Room {studentClass?.room || '-'}
                        </span>
                      </td>

                      {/* Parent & Phone */}
                      <td className="py-3 px-3">
                        <p className="font-medium text-slate-800">{student.parentName}</p>
                        <p className="text-[11px] text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400" /> {student.parentPhone}
                        </p>
                      </td>

                      {/* Fee Status */}
                      <td className="py-3 px-3 text-center">
                        {fee ? (
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              fee.status === 'paid'
                                ? 'bg-emerald-100 text-emerald-800'
                                : fee.status === 'partial'
                                ? 'bg-amber-100 text-amber-800'
                                : fee.status === 'overdue'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {fee.status === 'paid' ? 'Paid in Full' : `Bal: $${fee.balance}`}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[10px]">-</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                            student.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {student.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedStudentForView(student)}
                            title="View Student Profile"
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setStudentForReportCard(student)}
                            title="Print Term Report Card"
                            className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Award className="w-4 h-4" />
                          </button>

                          {currentUser.role !== 'bursar' && (
                            <button
                              onClick={() => handleOpenEdit(student)}
                              title="Edit Record"
                              className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}

                          {currentUser.role === 'admin' && (
                            <button
                              onClick={() => {
                                if (confirm(`Delete student record for ${student.firstName} ${student.lastName}?`)) {
                                  deleteStudent(student.id);
                                }
                              }}
                              title="Delete Record"
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid Card View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredStudents.map((student) => {
            const studentClass = classes.find((c) => c.id === student.classId);
            const fee = fees.find((f) => f.studentId === student.id);

            return (
              <div
                key={student.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={student.avatar}
                        alt={student.firstName}
                        className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-100"
                      />
                      <div>
                        <h4
                          onClick={() => setSelectedStudentForView(student)}
                          className="font-bold text-slate-900 text-sm hover:text-indigo-600 cursor-pointer"
                        >
                          {student.firstName} {student.lastName}
                        </h4>
                        <span className="text-[11px] font-mono text-slate-500">
                          {student.admissionNo}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                        student.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {student.status}
                    </span>
                  </div>

                  <div className="mt-4 space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Class:</span>
                      <strong className="text-slate-800">{studentClass?.name || 'Unassigned'}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Parent:</span>
                      <span className="text-slate-800 font-medium">{student.parentName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Phone:</span>
                      <span className="font-mono text-slate-700">{student.parentPhone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Fee Balance:</span>
                      <strong className={fee?.balance === 0 ? 'text-emerald-600' : 'text-rose-600'}>
                        {fee ? `$${fee.balance}` : '$0'}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedStudentForView(student)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => setStudentForReportCard(student)}
                      className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Award className="w-3.5 h-3.5" /> Report
                    </button>
                  </div>

                  {currentUser.role !== 'bursar' && (
                    <button
                      onClick={() => handleOpenEdit(student)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Register / Edit Student */}
      {(isAddModalOpen || editingStudent) && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl my-8 overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  {editingStudent ? 'Edit Student Profile' : 'Register New Student'}
                </h3>
                <p className="text-xs text-slate-500">
                  {editingStudent
                    ? `Modifying record for ${editingStudent.admissionNo}`
                    : 'Enter official admission records and parent contact details'}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingStudent(null);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              {/* Personal Section */}
              <div>
                <h4 className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider mb-2">
                  1. Student Personal Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">First Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="e.g. Liam"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Last Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="e.g. Sterling"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Gender *</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none text-xs"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Date of Birth *</label>
                    <input
                      type="date"
                      required
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Class Assignment *</label>
                    <select
                      value={formData.classId}
                      onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none text-xs font-medium"
                    >
                      {classes.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} (Room {c.room})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Blood Group</label>
                    <input
                      type="text"
                      value={formData.bloodGroup}
                      onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                      placeholder="e.g. O+, A-, B+"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Parent / Guardian Section */}
              <div className="pt-2 border-t border-slate-100">
                <h4 className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider mb-2">
                  2. Parent / Guardian Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Parent/Guardian Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.parentName}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                      placeholder="e.g. Eleanor Sterling"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Relationship</label>
                    <select
                      value={formData.parentRelationship}
                      onChange={(e) => setFormData({ ...formData, parentRelationship: e.target.value as any })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none text-xs"
                    >
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Guardian">Guardian</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.parentPhone}
                      onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Parent Email</label>
                    <input
                      type="email"
                      value={formData.parentEmail}
                      onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                      placeholder="parent@example.com"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none text-xs"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="font-semibold text-slate-700 block mb-1">Residential Address *</label>
                    <input
                      type="text"
                      required
                      value={formData.homeAddress}
                      onChange={(e) => setFormData({ ...formData, homeAddress: e.target.value })}
                      placeholder="Street address, city, state"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Emergency & Health */}
              <div className="pt-2 border-t border-slate-100">
                <h4 className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider mb-2">
                  3. Emergency Contact & Health Notes
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Emergency Contact Number *</label>
                    <input
                      type="text"
                      required
                      value={formData.emergencyContact}
                      onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                      placeholder="+1 (555) 123-4567"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Enrollment Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none text-xs capitalize"
                    >
                      <option value="active">Active</option>
                      <option value="graduated">Graduated</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="font-semibold text-slate-700 block mb-1">Medical / Allergy Notes</label>
                    <input
                      type="text"
                      value={formData.medicalNotes}
                      onChange={(e) => setFormData({ ...formData, medicalNotes: e.target.value })}
                      placeholder="e.g. Asthma, Peanut Allergy, or None"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingStudent(null);
                  }}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-sm transition-colors cursor-pointer"
                >
                  {editingStudent ? 'Save Profile Changes' : 'Register Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Full Student Profile View */}
      {selectedStudentForView && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl my-8 overflow-hidden">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-indigo-900 to-slate-900 p-6 text-white">
              <button
                onClick={() => setSelectedStudentForView(null)}
                className="absolute top-4 right-4 p-1.5 text-white/70 hover:text-white rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <img
                  src={selectedStudentForView.avatar}
                  alt={selectedStudentForView.firstName}
                  className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white/20 shadow-lg"
                />
                <div className="text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <h3 className="text-xl font-extrabold text-white">
                      {selectedStudentForView.firstName} {selectedStudentForView.lastName}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 uppercase">
                      {selectedStudentForView.status}
                    </span>
                  </div>
                  <p className="text-xs text-indigo-200 mt-1 font-mono">
                    Admission ID: {selectedStudentForView.admissionNo}
                  </p>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Class: <strong className="text-white">
                      {classes.find((c) => c.id === selectedStudentForView.classId)?.name || 'Unassigned'}
                    </strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="p-6 space-y-5 text-xs max-h-[60vh] overflow-y-auto">
              {/* Quick Actions Bar inside profile */}
              <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-slate-100">
                <button
                  onClick={() => {
                    setStudentForReportCard(selectedStudentForView);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl transition-colors cursor-pointer"
                >
                  <Award className="w-4 h-4" /> Generate Report Card
                </button>

                <button
                  onClick={() => {
                    setStudentForIdCard(selectedStudentForView);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold rounded-xl transition-colors cursor-pointer"
                >
                  <IdCard className="w-4 h-4" /> View Student Badge
                </button>

                {onOpenRecordFeeForStudent && (
                  <button
                    onClick={() => {
                      onOpenRecordFeeForStudent(selectedStudentForView.id);
                      setSelectedStudentForView(null);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4" /> Pay Fee
                  </button>
                )}
              </div>

              {/* Grid Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                  <h5 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider text-indigo-700">
                    Academic & Personal
                  </h5>
                  <div className="space-y-1 text-slate-600">
                    <p>Gender: <strong className="text-slate-900">{selectedStudentForView.gender}</strong></p>
                    <p>Date of Birth: <strong className="text-slate-900">{selectedStudentForView.dob}</strong></p>
                    <p>Enrolled Date: <strong className="text-slate-900">{selectedStudentForView.admissionDate}</strong></p>
                    <p>Blood Group: <strong className="text-slate-900">{selectedStudentForView.bloodGroup || 'Not specified'}</strong></p>
                    <p>Medical Notes: <span className="text-slate-800 italic">{selectedStudentForView.medicalNotes || 'None'}</span></p>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                  <h5 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider text-indigo-700">
                    Parent / Guardian Contact
                  </h5>
                  <div className="space-y-1 text-slate-600">
                    <p>Name: <strong className="text-slate-900">{selectedStudentForView.parentName} ({selectedStudentForView.parentRelationship})</strong></p>
                    <p className="flex items-center gap-1 font-mono">
                      <Phone className="w-3 h-3 text-slate-400" /> {selectedStudentForView.parentPhone}
                    </p>
                    <p className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-400" /> {selectedStudentForView.parentEmail || 'N/A'}
                    </p>
                    <p className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" /> {selectedStudentForView.homeAddress}
                    </p>
                    <p>Emergency: <strong className="text-rose-600">{selectedStudentForView.emergencyContact}</strong></p>
                  </div>
                </div>
              </div>

              {/* Fee Standing */}
              {(() => {
                const fee = fees.find((f) => f.studentId === selectedStudentForView.id);
                if (!fee) return null;
                return (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-slate-900">Term Fee Standing</h5>
                      <span className="font-bold text-xs uppercase px-2 py-0.5 rounded bg-white border border-slate-200">
                        {fee.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center pt-2">
                      <div className="p-2 bg-white rounded-lg border border-slate-200">
                        <span className="text-[10px] text-slate-400 block font-bold">TOTAL DUE</span>
                        <span className="font-black text-slate-800 text-sm">${fee.totalDue}</span>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-slate-200">
                        <span className="text-[10px] text-emerald-600 block font-bold">AMOUNT PAID</span>
                        <span className="font-black text-emerald-700 text-sm">${fee.amountPaid}</span>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-slate-200">
                        <span className="text-[10px] text-rose-600 block font-bold">BALANCE</span>
                        <span className="font-black text-rose-700 text-sm">${fee.balance}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
              <button
                onClick={() => setSelectedStudentForView(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-semibold transition-colors cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable ID Card Badge Modal */}
      {studentForIdCard && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden p-6 text-center">
            <div className="border-4 border-indigo-600 rounded-2xl p-6 bg-gradient-to-b from-indigo-50/50 to-white shadow-inner">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-900 block">
                {settings.name}
              </span>
              <span className="text-[9px] text-indigo-600 block mb-3 font-medium">STUDENT IDENTITY PASS</span>

              <img
                src={studentForIdCard.avatar}
                alt={studentForIdCard.firstName}
                className="w-24 h-24 mx-auto rounded-full object-cover ring-4 ring-indigo-500/40 shadow-md mb-3"
              />

              <h4 className="text-lg font-black text-slate-900">
                {studentForIdCard.firstName} {studentForIdCard.lastName}
              </h4>
              <p className="text-xs font-mono font-bold text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full inline-block mt-1">
                {studentForIdCard.admissionNo}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-600 space-y-1">
                <p>
                  Class: <strong className="text-slate-900">
                    {classes.find((c) => c.id === studentForIdCard.classId)?.name || 'N/A'}
                  </strong>
                </p>
                <p>
                  Academic Year: <strong className="text-slate-900">{settings.academicYear}</strong>
                </p>
                <p>
                  Emergency: <strong className="text-slate-900">{studentForIdCard.emergencyContact}</strong>
                </p>
              </div>

              <div className="mt-4 pt-2 border-t border-dashed border-slate-300 text-[10px] text-slate-400">
                Valid for Campus Entry & Library Borrowing
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Print Badge
              </button>
              <button
                onClick={() => setStudentForIdCard(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Report Card Modal */}
      {studentForReportCard && (
        <PrintReportCard
          student={studentForReportCard}
          schoolClass={classes.find((c) => c.id === studentForReportCard.classId)}
          exam={exams[0] || { id: 'ex-1', name: 'Term 1 Mid-Term Assessment', term: 'Term 1', academicYear: '2026 - 2027', startDate: '', endDate: '', status: 'completed' }}
          marks={examMarks.filter((m) => m.studentId === studentForReportCard.id)}
          settings={settings}
          subjectsMap={subjectsMap}
          attendanceSummary={{
            totalDays: 45,
            presentDays: 43,
            percentage: 96,
          }}
          onClose={() => setStudentForReportCard(null)}
        />
      )}
    </div>
  );
};
