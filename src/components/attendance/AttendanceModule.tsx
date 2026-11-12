import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  Calendar,
  Check,
  X,
  Clock,
  HelpCircle,
  Save,
  Users,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Filter,
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { AttendanceStatus } from '../../types';

export const AttendanceModule: React.FC = () => {
  const { classes, students, attendanceRecords, saveAttendanceBatch, currentUser } = useSchool();

  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-12');
  const [saveSuccessMessage, setSaveSuccessMessage] = useState(false);

  // Local attendance sheet state: studentId -> { status, remarks }
  const [sheet, setSheet] = useState<Record<string, { status: AttendanceStatus; remarks: string }>>({});

  // When class or date changes, populate sheet from existing attendance records or default to 'present'
  useEffect(() => {
    if (!selectedClassId) return;

    const classStudents = students.filter((s) => s.classId === selectedClassId);
    const existing = attendanceRecords.filter(
      (a) => a.classId === selectedClassId && a.date === selectedDate
    );

    const initialSheet: Record<string, { status: AttendanceStatus; remarks: string }> = {};

    classStudents.forEach((student) => {
      const match = existing.find((e) => e.studentId === student.id);
      if (match) {
        initialSheet[student.id] = {
          status: match.status,
          remarks: match.remarks || '',
        };
      } else {
        // default to present
        initialSheet[student.id] = {
          status: 'present',
          remarks: '',
        };
      }
    });

    setSheet(initialSheet);
  }, [selectedClassId, selectedDate, students, attendanceRecords]);

  const classStudents = students.filter((s) => s.classId === selectedClassId);
  const selectedClass = classes.find((c) => c.id === selectedClassId);

  // Status updates
  const setStudentStatus = (studentId: string, status: AttendanceStatus) => {
    setSheet((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }));
  };

  const setStudentRemark = (studentId: string, remarks: string) => {
    setSheet((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks,
      },
    }));
  };

  const markAll = (status: AttendanceStatus) => {
    setSheet((prev) => {
      const updated = { ...prev };
      classStudents.forEach((s) => {
        updated[s.id] = {
          ...updated[s.id],
          status,
        };
      });
      return updated;
    });
  };

  const handleSave = () => {
    const batch = classStudents.map((s) => ({
      studentId: s.id,
      classId: selectedClassId,
      date: selectedDate,
      status: sheet[s.id]?.status || 'present',
      remarks: sheet[s.id]?.remarks || '',
    }));

    saveAttendanceBatch(batch);
    setSaveSuccessMessage(true);
    setTimeout(() => setSaveSuccessMessage(false), 3000);
  };

  // Compute live counters
  const totalCount = classStudents.length;
  const presentCount = Object.values(sheet).filter((v) => v.status === 'present').length;
  const lateCount = Object.values(sheet).filter((v) => v.status === 'late').length;
  const excusedCount = Object.values(sheet).filter((v) => v.status === 'excused').length;
  const absentCount = Object.values(sheet).filter((v) => v.status === 'absent').length;
  const attendanceRate = totalCount > 0 ? Math.round(((presentCount + lateCount) / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-emerald-600" />
            <span>Daily Roll Call & Attendance Register</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Take official roll call for morning and afternoon sessions
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saveSuccessMessage && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" /> Attendance Saved!
            </span>
          )}

          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Register</span>
          </button>
        </div>
      </div>

      {/* Selector and Filter Strip */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Class Select */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Select Class
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-800 text-xs focus:bg-white focus:border-emerald-500 cursor-pointer"
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} (Room {cls.room})
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Register Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium text-slate-800 text-xs focus:bg-white focus:border-emerald-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Bulk Action Buttons */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold hidden md:inline">Quick Mark:</span>
          <button
            onClick={() => markAll('present')}
            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg text-xs transition-colors cursor-pointer"
          >
            All Present
          </button>
          <button
            onClick={() => markAll('absent')}
            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg text-xs transition-colors cursor-pointer"
          >
            All Absent
          </button>
        </div>
      </div>

      {/* Live Statistics Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Roster</span>
          <span className="text-2xl font-black text-slate-900">{totalCount}</span>
        </div>

        <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-100 text-center">
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Present</span>
          <span className="text-2xl font-black text-emerald-900">{presentCount}</span>
        </div>

        <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-100 text-center">
          <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">Late</span>
          <span className="text-2xl font-black text-amber-900">{lateCount}</span>
        </div>

        <div className="bg-sky-50/70 p-4 rounded-xl border border-sky-100 text-center">
          <span className="text-[10px] font-bold text-sky-800 uppercase tracking-wider block">Excused</span>
          <span className="text-2xl font-black text-sky-900">{excusedCount}</span>
        </div>

        <div className="bg-rose-50/70 p-4 rounded-xl border border-rose-100 text-center col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider block">Absent</span>
          <span className="text-2xl font-black text-rose-900">{absentCount}</span>
        </div>
      </div>

      {/* Student Attendance Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="font-bold text-xs text-slate-800">
            {selectedClass ? selectedClass.name : 'Class'} Roll Call Roster ({classStudents.length} Students)
          </span>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/60 px-2.5 py-0.5 rounded-full">
            {attendanceRate}% Rate Today
          </span>
        </div>

        {classStudents.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No students found in this class section. Please assign students in Student Management.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-3">Admission No</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4">Remarks / Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {classStudents.map((student, idx) => {
                  const studentStatus = sheet[student.id]?.status || 'present';
                  const remarks = sheet[student.id]?.remarks || '';

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 text-center font-mono text-slate-400 font-semibold">
                        {idx + 1}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={student.avatar}
                            alt={student.firstName}
                            className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block">
                              {student.firstName} {student.lastName}
                            </span>
                            <span className="text-[10px] text-slate-400">{student.gender}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3 font-mono text-slate-700 font-medium">
                        {student.admissionNo}
                      </td>

                      {/* Status Toggle Buttons */}
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl gap-1">
                          {/* Present */}
                          <button
                            type="button"
                            onClick={() => setStudentStatus(student.id, 'present')}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              studentStatus === 'present'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-slate-500 hover:text-emerald-700 hover:bg-slate-200'
                            }`}
                          >
                            Present
                          </button>

                          {/* Late */}
                          <button
                            type="button"
                            onClick={() => setStudentStatus(student.id, 'late')}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              studentStatus === 'late'
                                ? 'bg-amber-500 text-white shadow-xs'
                                : 'text-slate-500 hover:text-amber-700 hover:bg-slate-200'
                            }`}
                          >
                            Late
                          </button>

                          {/* Excused */}
                          <button
                            type="button"
                            onClick={() => setStudentStatus(student.id, 'excused')}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              studentStatus === 'excused'
                                ? 'bg-sky-500 text-white shadow-xs'
                                : 'text-slate-500 hover:text-sky-700 hover:bg-slate-200'
                            }`}
                          >
                            Excused
                          </button>

                          {/* Absent */}
                          <button
                            type="button"
                            onClick={() => setStudentStatus(student.id, 'absent')}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              studentStatus === 'absent'
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'text-slate-500 hover:text-rose-700 hover:bg-slate-200'
                            }`}
                          >
                            Absent
                          </button>
                        </div>
                      </td>

                      {/* Remarks Input */}
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={remarks}
                          onChange={(e) => setStudentRemark(student.id, e.target.value)}
                          placeholder={
                            studentStatus === 'absent'
                              ? 'e.g. Unwell / Fever'
                              : studentStatus === 'late'
                              ? 'e.g. Delayed bus'
                              : 'Optional notes'
                          }
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:bg-white focus:border-emerald-500 text-slate-700"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Make sure to press <strong className="text-slate-900">Save Register</strong> after taking attendance.
          </span>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Save Register
          </button>
        </div>
      </div>
    </div>
  );
};
