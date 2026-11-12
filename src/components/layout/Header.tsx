import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  Calendar,
  Sparkles,
  UserPlus,
  Receipt,
  GraduationCap,
  X,
  ChevronDown,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { NavModule } from './Sidebar';

interface HeaderProps {
  activeModule: NavModule;
  onSelectModule: (module: NavModule) => void;
  onToggleSidebar: () => void;
  onQuickAddStudent: () => void;
  onQuickRecordPayment: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeModule,
  onSelectModule,
  onToggleSidebar,
  onQuickAddStudent,
  onQuickRecordPayment,
}) => {
  const { currentUser, settings, students, teachers, classes, activities } = useSchool();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close search/notif on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const moduleTitles: Record<NavModule, { title: string; subtitle: string }> = {
    dashboard: {
      title: '01. Executive School Dashboard',
      subtitle: 'Overview of students, teachers, classes and institutional statistics',
    },
    students: {
      title: '02. Student Records & Enrollment',
      subtitle: 'Register students, edit profiles and manage academic records',
    },
    teachers: {
      title: '03. Faculty & Teacher Directory',
      subtitle: 'Register teachers, departments, qualifications and timetables',
    },
    classes: {
      title: '04. Class & Curriculum Management',
      subtitle: 'Configure class sections, assign room capacities and subjects',
    },
    attendance: {
      title: '05. Daily Student Attendance',
      subtitle: 'Record and monitor roll calls, status percentages and logs',
    },
    fees: {
      title: '06. Bursary & Fees Management',
      subtitle: 'Track tuition invoices, payments, balances and generate official receipts',
    },
    exams: {
      title: '07. Examinations, Marks & Report Cards',
      subtitle: 'Record subject marks, calculate grade rankings and print report cards',
    },
    accounts: {
      title: '08. User Accounts & Institutional Settings',
      subtitle: 'Role-based access control, security permissions and system settings',
    },
  };

  // Search filtering
  const filteredStudents = searchQuery.trim()
    ? students
        .filter(
          (s) =>
            s.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.admissionNo.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 4)
    : [];

  const filteredTeachers = searchQuery.trim()
    ? teachers
        .filter(
          (t) =>
            t.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.department.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 3)
    : [];

  const filteredClasses = searchQuery.trim()
    ? classes
        .filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 3)
    : [];

  const totalResults = filteredStudents.length + filteredTeachers.length + filteredClasses.length;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3.5 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Active Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
              {moduleTitles[activeModule].title}
            </h1>
            <p className="text-xs text-slate-500 hidden sm:block truncate max-w-md">
              {moduleTitles[activeModule].subtitle}
            </p>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-3">
          {/* Global Search Bar with Live Popover */}
          <div ref={searchRef} className="relative hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Search students, faculty, classes..."
                className="w-64 lg:w-72 pl-9 pr-4 py-1.5 bg-slate-100 hover:bg-slate-200/70 focus:bg-white text-xs font-medium rounded-xl border border-transparent focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Search Dropdown Results */}
            {isSearchOpen && searchQuery.trim() && (
              <div className="absolute left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-2 border-b border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
                  <span>Found {totalResults} matches</span>
                  <span className="text-[10px] uppercase font-mono">ESC to close</span>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 p-1">
                  {totalResults === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">
                      No matching student, teacher or class found.
                    </div>
                  ) : (
                    <>
                      {/* Students */}
                      {filteredStudents.length > 0 && (
                        <div className="py-1">
                          <span className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Students
                          </span>
                          {filteredStudents.map((s) => (
                            <div
                              key={s.id}
                              onClick={() => {
                                onSelectModule('students');
                                setIsSearchOpen(false);
                                setSearchQuery('');
                              }}
                              className="px-2.5 py-2 hover:bg-indigo-50/70 rounded-lg cursor-pointer flex items-center gap-2.5 transition-colors"
                            >
                              <img
                                src={s.avatar}
                                alt={s.firstName}
                                className="w-6 h-6 rounded-full object-cover"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold text-slate-900 truncate">
                                  {s.firstName} {s.lastName}
                                </p>
                                <p className="text-[10px] text-slate-500 font-mono">
                                  {s.admissionNo}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Teachers */}
                      {filteredTeachers.length > 0 && (
                        <div className="py-1">
                          <span className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Teachers
                          </span>
                          {filteredTeachers.map((t) => (
                            <div
                              key={t.id}
                              onClick={() => {
                                onSelectModule('teachers');
                                setIsSearchOpen(false);
                                setSearchQuery('');
                              }}
                              className="px-2.5 py-2 hover:bg-indigo-50/70 rounded-lg cursor-pointer flex items-center gap-2.5 transition-colors"
                            >
                              <img
                                src={t.avatar}
                                alt={t.firstName}
                                className="w-6 h-6 rounded-full object-cover"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold text-slate-900 truncate">
                                  {t.firstName} {t.lastName}
                                </p>
                                <p className="text-[10px] text-slate-500">{t.department}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Classes */}
                      {filteredClasses.length > 0 && (
                        <div className="py-1">
                          <span className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Classes
                          </span>
                          {filteredClasses.map((c) => (
                            <div
                              key={c.id}
                              onClick={() => {
                                onSelectModule('classes');
                                setIsSearchOpen(false);
                                setSearchQuery('');
                              }}
                              className="px-2.5 py-2 hover:bg-indigo-50/70 rounded-lg cursor-pointer flex items-center gap-2.5 transition-colors"
                            >
                              <div className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                                {c.name.slice(0, 2)}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold text-slate-900 truncate">
                                  {c.name}
                                </p>
                                <p className="text-[10px] text-slate-500">Room: {c.room}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Academic Term Chip */}
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-xl text-xs font-medium text-slate-700 border border-slate-200/60">
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            <span>
              {settings.currentTerm} • {settings.academicYear}
            </span>
          </div>

          {/* Quick Action Button */}
          {currentUser.role === 'bursar' ? (
            <button
              onClick={onQuickRecordPayment}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Record Fee</span>
            </button>
          ) : (
            <button
              onClick={onQuickAddStudent}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Admit Student</span>
            </button>
          )}

          {/* Notifications Center */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title="Recent Activity Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50">
                <div className="p-3.5 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">Activity & Alerts</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-bold">
                      Live
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">Past 48 Hours</span>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
                  {activities.slice(0, 6).map((act) => (
                    <div key={act.id} className="p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-bold text-slate-800">{act.title}</p>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">{act.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{act.description}</p>
                      <span className="text-[10px] text-indigo-500 font-medium block mt-1">
                        By {act.user}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Current Role Indicator */}
          <div
            onClick={() => onSelectModule('accounts')}
            className="flex items-center gap-2 pl-2 border-l border-slate-200 cursor-pointer group"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20 group-hover:ring-indigo-500/60 transition-all"
            />
            <div className="hidden md:block text-left">
              <span className="text-xs font-bold text-slate-900 block leading-none group-hover:text-indigo-600 transition-colors">
                {currentUser.name}
              </span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                {currentUser.role}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
