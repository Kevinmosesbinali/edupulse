import React from 'react';
import {
  Users,
  GraduationCap,
  Layers,
  CalendarCheck,
  CreditCard,
  TrendingUp,
  ArrowUpRight,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  School,
  UserPlus,
  Receipt,
  FileSpreadsheet,
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { NavModule } from '../layout/Sidebar';

interface DashboardModuleProps {
  onNavigate: (module: NavModule) => void;
  onOpenAddStudent: () => void;
  onOpenRecordPayment: () => void;
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({
  onNavigate,
  onOpenAddStudent,
  onOpenRecordPayment,
}) => {
  const { stats, students, teachers, classes, settings, activities, currentUser } = useSchool();

  // Male / Female student breakdown
  const maleStudents = students.filter((s) => s.gender === 'Male').length;
  const femaleStudents = students.filter((s) => s.gender === 'Female').length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Academic Year {settings.academicYear} • {settings.currentTerm}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back, {currentUser.name}
            </h2>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Here is the institutional overview for <span className="font-semibold text-white">{settings.name}</span> today.
              All operations are running smoothly with <span className="text-emerald-400 font-bold">{stats.todayAttendanceRate}%</span> attendance recorded.
            </p>
          </div>

          {/* Quick Shortcuts */}
          <div className="flex flex-wrap items-center gap-3">
            {currentUser.role !== 'bursar' && (
              <button
                onClick={onOpenAddStudent}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                Register Student
              </button>
            )}

            {currentUser.role !== 'teacher' && (
              <button
                onClick={onOpenRecordPayment}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <Receipt className="w-4 h-4" />
                Record Fee
              </button>
            )}

            <button
              onClick={() => onNavigate('attendance')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-all cursor-pointer"
            >
              <CalendarCheck className="w-4 h-4 text-sky-400" />
              Take Attendance
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 -mb-10 w-64 h-64 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Primary KPI Grid (4 main cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Students */}
        <div
          onClick={() => onNavigate('students')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Enrolled</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-slate-900 tracking-tight">{stats.totalStudents}</span>
            <span className="text-xs text-slate-500 ml-1.5 font-medium">Students</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>{maleStudents} Boys • {femaleStudents} Girls</span>
            <span className="text-indigo-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
              Manage <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Total Faculty */}
        <div
          onClick={() => onNavigate('teachers')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-sky-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Teaching Staff</span>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-slate-900 tracking-tight">{stats.totalTeachers}</span>
            <span className="text-xs text-slate-500 ml-1.5 font-medium">Teachers</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Across 6 Departments</span>
            <span className="text-sky-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
              Directory <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Daily Attendance Rate */}
        <div
          onClick={() => onNavigate('attendance')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today's Attendance</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-emerald-600 tracking-tight">{stats.todayAttendanceRate}%</span>
            <span className="text-xs text-emerald-700 ml-1.5 font-bold">Present</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>{stats.todayPresentCount} Present • {stats.todayAbsentCount} Absent</span>
            <span className="text-emerald-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
              Roll Call <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Fee Collection Rate */}
        <div
          onClick={() => onNavigate('fees')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-amber-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fee Collection</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-slate-900 tracking-tight">{stats.collectionRate}%</span>
            <span className="text-xs text-slate-500 ml-1.5 font-medium">Collected</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>{settings.currency}{stats.totalFeesCollected.toLocaleString()} received</span>
            <span className="text-amber-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
              Bursary <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>

      {/* Two-Column Middle Section: Attendance & Bursary Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Insights */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CalendarCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Attendance Roll Call Status</h3>
                <p className="text-xs text-slate-500">Live monitoring for 2026-11-12</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('attendance')}
              className="text-xs text-indigo-600 font-bold hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
            >
              Open Register <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-700">Overall School Presence</span>
                <span className="text-emerald-700 font-bold">{stats.todayAttendanceRate}%</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
                <div style={{ width: `${stats.todayAttendanceRate}%` }} className="bg-emerald-500 transition-all duration-500" />
                <div style={{ width: `${100 - stats.todayAttendanceRate}%` }} className="bg-rose-400 transition-all duration-500" />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 pt-2 text-center text-xs">
              <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl">
                <span className="text-[10px] text-emerald-800 font-bold uppercase block">Present</span>
                <span className="text-lg font-black text-emerald-900">{stats.todayPresentCount}</span>
              </div>
              <div className="p-3 bg-amber-50/70 border border-amber-100 rounded-xl">
                <span className="text-[10px] text-amber-800 font-bold uppercase block">Late</span>
                <span className="text-lg font-black text-amber-900">1</span>
              </div>
              <div className="p-3 bg-sky-50/70 border border-sky-100 rounded-xl">
                <span className="text-[10px] text-sky-800 font-bold uppercase block">Excused</span>
                <span className="text-lg font-black text-sky-900">1</span>
              </div>
              <div className="p-3 bg-rose-50/70 border border-rose-100 rounded-xl">
                <span className="text-[10px] text-rose-800 font-bold uppercase block">Absent</span>
                <span className="text-lg font-black text-rose-900">{stats.todayAbsentCount}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Grade 10-A, Grade 10-B, and Grade 11-Science daily roll calls have been submitted by class tutors.
              </span>
            </div>
          </div>
        </div>

        {/* Fees & Bursary Financial Overview */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Fee Collection & Revenue</h3>
                <p className="text-xs text-slate-500">Academic Term 1 Financial Position</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('fees')}
              className="text-xs text-indigo-600 font-bold hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
            >
              View Ledger <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-5 space-y-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Invoiced</span>
                <span className="text-base sm:text-lg font-extrabold text-slate-900">
                  {settings.currency}{stats.totalFeesInvoiced.toLocaleString()}
                </span>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <span className="text-[10px] text-emerald-700 font-bold uppercase block">Collected</span>
                <span className="text-base sm:text-lg font-extrabold text-emerald-800">
                  {settings.currency}{stats.totalFeesCollected.toLocaleString()}
                </span>
              </div>
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
                <span className="text-[10px] text-rose-700 font-bold uppercase block">Outstanding</span>
                <span className="text-base sm:text-lg font-extrabold text-rose-800">
                  {settings.currency}{stats.totalOutstandingFees.toLocaleString()}
                </span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-700">Term Collection Progress</span>
                <span className="text-indigo-600 font-bold">{stats.collectionRate}% Completed</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div style={{ width: `${stats.collectionRate}%` }} className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500" />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-800">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>3 students have overdue or partial balances due this month.</span>
              </div>
              <button
                onClick={onOpenRecordPayment}
                className="font-bold underline text-amber-900 hover:text-amber-950 whitespace-nowrap cursor-pointer"
              >
                Record Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Class Utilization & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Class Overview (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-sm">Class Roster & Capacity</h3>
            </div>
            <button
              onClick={() => onNavigate('classes')}
              className="text-xs text-indigo-600 font-bold hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
            >
              Manage Classes <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-3">Class Name</th>
                  <th className="py-2.5 px-3">Room</th>
                  <th className="py-2.5 px-3">Class Tutor</th>
                  <th className="py-2.5 px-3 text-center">Enrollment</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {classes.map((cls) => {
                  const enrolledCount = students.filter((s) => s.classId === cls.id).length;
                  const teacher = teachers.find((t) => t.id === cls.classTeacherId);
                  const occupancy = Math.round((enrolledCount / cls.capacity) * 100);

                  return (
                    <tr key={cls.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-3 font-bold text-slate-900">
                        {cls.name}
                        <span className="text-[10px] font-normal text-slate-400 block font-mono">
                          Grade {cls.gradeLevel} - Sec {cls.section}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600 font-medium">{cls.room}</td>
                      <td className="py-3 px-3 text-slate-700 font-medium">
                        {teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Unassigned'}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className="font-bold text-slate-900">{enrolledCount}</span>
                          <span className="text-slate-400">/ {cls.capacity}</span>
                        </div>
                        <div className="w-20 mx-auto h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                          <div
                            style={{ width: `${occupancy}%` }}
                            className={`h-full ${
                              occupancy > 90 ? 'bg-amber-500' : 'bg-indigo-500'
                            }`}
                          />
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => onNavigate('classes')}
                          className="px-2.5 py-1 text-[11px] font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                        >
                          View Roster
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Activity Stream (1 Col) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <h3 className="font-bold text-slate-900 text-sm">Recent Activity</h3>
            </div>
            <span className="text-[10px] text-slate-400">Live feed</span>
          </div>

          <div className="mt-4 space-y-4 overflow-y-auto max-h-[300px] flex-1 pr-1">
            {activities.slice(0, 6).map((item) => (
              <div key={item.id} className="relative pl-5 border-l-2 border-slate-200 text-xs">
                <span className="absolute -left-[5px] top-0.5 w-2 h-2 rounded-full bg-indigo-500" />
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{item.title}</span>
                  <span className="text-[10px] text-slate-400">{item.time}</span>
                </div>
                <p className="text-slate-600 mt-0.5 text-[11px] leading-relaxed">{item.description}</p>
                <span className="text-[10px] font-medium text-indigo-500 mt-1 block">
                  Actor: {item.user}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
