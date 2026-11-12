import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Search,
  Users,
  BookOpen,
  DoorOpen,
  UserCheck,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  BookMarked,
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { SchoolClass, Subject } from '../../types';

interface ClassManagementProps {
  onNavigateToAttendance?: () => void;
}

export const ClassManagementModule: React.FC<ClassManagementProps> = ({
  onNavigateToAttendance,
}) => {
  const { classes, students, teachers, subjects, addClass, updateClass, deleteClass, addSubject, currentUser } =
    useSchool();

  const [search, setSearch] = useState('');
  const [selectedClassForView, setSelectedClassForView] = useState<SchoolClass | null>(null);
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<SchoolClass | null>(null);
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);

  // Class Form State
  const [classForm, setClassForm] = useState({
    name: '',
    gradeLevel: '10',
    section: 'A',
    classTeacherId: teachers[0]?.id || '',
    room: 'Room 101',
    capacity: 35,
    subjectIds: [] as string[],
  });

  // Subject Form State
  const [subjectForm, setSubjectForm] = useState({
    code: '',
    name: '',
    department: 'Sciences',
    creditHours: 4,
  });

  const handleOpenAddClass = () => {
    setClassForm({
      name: '',
      gradeLevel: '10',
      section: 'A',
      classTeacherId: teachers[0]?.id || '',
      room: 'Room 101',
      capacity: 35,
      subjectIds: subjects.slice(0, 5).map((s) => s.id),
    });
    setIsAddClassModalOpen(true);
  };

  const handleOpenEditClass = (cls: SchoolClass) => {
    setEditingClass(cls);
    setClassForm({
      name: cls.name,
      gradeLevel: cls.gradeLevel,
      section: cls.section,
      classTeacherId: cls.classTeacherId,
      room: cls.room,
      capacity: cls.capacity,
      subjectIds: cls.subjectIds,
    });
  };

  const handleSubmitClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClass) {
      updateClass({
        ...editingClass,
        ...classForm,
      });
      setEditingClass(null);
    } else {
      addClass(classForm);
      setIsAddClassModalOpen(false);
    }
  };

  const handleSubmitSubject = (e: React.FormEvent) => {
    e.preventDefault();
    addSubject(subjectForm);
    setSubjectForm({ code: '', name: '', department: 'Sciences', creditHours: 4 });
    setIsAddSubjectModalOpen(false);
  };

  const filteredClasses = classes.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <span>Class & Curriculum Management</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize grades, class sections, room allocations and assigned curriculum subjects
          </p>
        </div>

        <div className="flex items-center gap-2">
          {currentUser.role !== 'teacher' && (
            <>
              <button
                onClick={() => setIsAddSubjectModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>+ Add Subject</span>
              </button>

              <button
                onClick={handleOpenAddClass}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Class</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Class Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredClasses.map((cls) => {
          const classStudents = students.filter((s) => s.classId === cls.id);
          const teacher = teachers.find((t) => t.id === cls.classTeacherId);
          const occupancy = Math.round((classStudents.length / cls.capacity) * 100);
          const boys = classStudents.filter((s) => s.gender === 'Male').length;
          const girls = classStudents.filter((s) => s.gender === 'Female').length;

          return (
            <div
              key={cls.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-sky-400 text-white flex items-center justify-center font-black text-lg shadow-sm">
                      {cls.gradeLevel}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base">{cls.name}</h4>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <DoorOpen className="w-3.5 h-3.5 text-slate-400" /> {cls.room}
                      </span>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                    Grade {cls.gradeLevel}
                  </span>
                </div>

                {/* Class Tutor */}
                <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                  <UserCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none">
                      Class Tutor
                    </span>
                    <p className="text-xs font-bold text-slate-800 truncate mt-0.5">
                      {teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Unassigned'}
                    </p>
                  </div>
                </div>

                {/* Enrollment Progress */}
                <div className="mt-4 space-y-1.5 text-xs">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-500">Student Capacity:</span>
                    <span className="text-slate-900 font-bold">
                      {classStudents.length} / {cls.capacity} Enrolled ({occupancy}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${occupancy}%` }}
                      className={`h-full transition-all ${
                        occupancy > 90 ? 'bg-amber-500' : 'bg-indigo-600'
                      }`}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 pt-0.5">
                    <span>{boys} Boys • {girls} Girls</span>
                    <span>{cls.subjectIds.length} Subjects Taught</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setSelectedClassForView(cls)}
                  className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-xs transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5" /> View Roster ({classStudents.length})
                </button>

                <div className="flex items-center gap-1">
                  {currentUser.role !== 'teacher' && (
                    <button
                      onClick={() => handleOpenEditClass(cls)}
                      className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}
                  {currentUser.role === 'admin' && (
                    <button
                      onClick={() => {
                        if (confirm(`Delete class ${cls.name}?`)) {
                          deleteClass(cls.id);
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

      {/* Curriculum & Subjects Overview */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">School Curriculum & Subjects</h3>
              <p className="text-xs text-slate-500">Standard subject offerings across grades</p>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {subjects.map((sub) => (
            <div
              key={sub.id}
              className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start justify-between"
            >
              <div>
                <span className="font-mono text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  {sub.code}
                </span>
                <h5 className="font-bold text-slate-900 text-xs mt-1.5">{sub.name}</h5>
                <span className="text-[11px] text-slate-500 block">{sub.department}</span>
              </div>
              <span className="text-xs font-semibold text-slate-400">
                {sub.creditHours} hrs/wk
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: View Class Roster */}
      {selectedClassForView && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden">
            <div className="p-5 bg-gradient-to-r from-indigo-900 to-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">{selectedClassForView.name} Student Roster</h3>
                <p className="text-xs text-indigo-200">
                  Allocated Room: {selectedClassForView.room} • Max Capacity: {selectedClassForView.capacity}
                </p>
              </div>
              <button
                onClick={() => setSelectedClassForView(null)}
                className="p-1.5 text-white/70 hover:text-white rounded-lg bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4 text-xs">
              {(() => {
                const classStudents = students.filter((s) => s.classId === selectedClassForView.id);
                if (classStudents.length === 0) {
                  return (
                    <div className="py-8 text-center text-slate-400">
                      No students are currently enrolled in this class.
                    </div>
                  );
                }

                return (
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                    {classStudents.map((student, idx) => (
                      <div
                        key={student.id}
                        className="p-3 bg-white flex items-center justify-between hover:bg-slate-50"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-slate-400 font-bold w-5 text-center">
                            {idx + 1}
                          </span>
                          <img
                            src={student.avatar}
                            alt={student.firstName}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-bold text-slate-900">
                              {student.firstName} {student.lastName}
                            </p>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {student.admissionNo} • {student.gender}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-[11px] font-medium text-slate-700">
                            Parent: {student.parentName}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono">{student.parentPhone}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedClassForView(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold cursor-pointer"
              >
                Close Roster
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create / Edit Class */}
      {(isAddClassModalOpen || editingClass) && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">
                {editingClass ? 'Edit Class Parameters' : 'Create New Class'}
              </h3>
              <button
                onClick={() => {
                  setIsAddClassModalOpen(false);
                  setEditingClass(null);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitClass} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Class Display Name *</label>
                <input
                  type="text"
                  required
                  value={classForm.name}
                  onChange={(e) => setClassForm({ ...classForm, name: e.target.value })}
                  placeholder="e.g. Grade 11-Arts"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Grade Level *</label>
                  <input
                    type="text"
                    required
                    value={classForm.gradeLevel}
                    onChange={(e) => setClassForm({ ...classForm, gradeLevel: e.target.value })}
                    placeholder="e.g. 11"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Section *</label>
                  <input
                    type="text"
                    required
                    value={classForm.section}
                    onChange={(e) => setClassForm({ ...classForm, section: e.target.value })}
                    placeholder="e.g. A, B, Arts"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Room Assignment *</label>
                  <input
                    type="text"
                    required
                    value={classForm.room}
                    onChange={(e) => setClassForm({ ...classForm, room: e.target.value })}
                    placeholder="e.g. Hall 401"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Max Capacity *</label>
                  <input
                    type="number"
                    required
                    min={10}
                    max={60}
                    value={classForm.capacity}
                    onChange={(e) => setClassForm({ ...classForm, capacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Designated Class Tutor *</label>
                <select
                  value={classForm.classTeacherId}
                  onChange={(e) => setClassForm({ ...classForm, classTeacherId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none font-medium"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.firstName} {t.lastName} ({t.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddClassModalOpen(false);
                    setEditingClass(null);
                  }}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold"
                >
                  {editingClass ? 'Update Class' : 'Create Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Subject */}
      {isAddSubjectModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Add Curriculum Subject</h3>
              <button onClick={() => setIsAddSubjectModalOpen(false)} className="p-1.5 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitSubject} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Subject Code *</label>
                <input
                  type="text"
                  required
                  value={subjectForm.code}
                  onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })}
                  placeholder="e.g. ECO201"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none uppercase font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Subject Name *</label>
                <input
                  type="text"
                  required
                  value={subjectForm.name}
                  onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                  placeholder="e.g. Economics & Commerce"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Department</label>
                  <select
                    value={subjectForm.department}
                    onChange={(e) => setSubjectForm({ ...subjectForm, department: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                  >
                    <option value="Sciences">Sciences</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Languages">Languages</option>
                    <option value="Humanities">Humanities</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Arts & Music">Arts & Music</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Credit Hours / Wk</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={subjectForm.creditHours}
                    onChange={(e) => setSubjectForm({ ...subjectForm, creditHours: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddSubjectModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold"
                >
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
