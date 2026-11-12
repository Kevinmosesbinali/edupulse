import React from 'react';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Layers,
  CalendarCheck,
  CreditCard,
  FileSpreadsheet,
  ShieldAlert,
  School,
  ChevronRight,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { UserRole } from '../../types';

export type NavModule =
  | 'dashboard'
  | 'students'
  | 'teachers'
  | 'classes'
  | 'attendance'
  | 'fees'
  | 'exams'
  | 'accounts';

interface SidebarProps {
  activeModule: NavModule;
  onSelectModule: (module: NavModule) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeModule,
  onSelectModule,
  isOpen,
  onClose,
}) => {
  const { currentUser, switchUserRole, stats, settings } = useSchool();

  const navItems = [
    {
      id: 'dashboard' as NavModule,
      num: '01',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
      allowedRoles: ['admin', 'teacher', 'bursar'],
    },
    {
      id: 'students' as NavModule,
      num: '02',
      label: 'Student Management',
      icon: Users,
      badge: stats.totalStudents,
      allowedRoles: ['admin', 'teacher', 'bursar'],
    },
    {
      id: 'teachers' as NavModule,
      num: '03',
      label: 'Teacher Management',
      icon: GraduationCap,
      badge: stats.totalTeachers,
      allowedRoles: ['admin', 'teacher', 'bursar'],
    },
    {
      id: 'classes' as NavModule,
      num: '04',
      label: 'Class Management',
      icon: Layers,
      badge: stats.totalClasses,
      allowedRoles: ['admin', 'teacher', 'bursar'],
    },
    {
      id: 'attendance' as NavModule,
      num: '05',
      label: 'Attendance',
      icon: CalendarCheck,
      badge: `${stats.todayAttendanceRate}%`,
      badgeColor: 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20',
      allowedRoles: ['admin', 'teacher'],
    },
    {
      id: 'fees' as NavModule,
      num: '06',
      label: 'Fees Management',
      icon: CreditCard,
      badge: stats.totalOutstandingFees > 0 ? 'Due' : null,
      badgeColor: 'bg-amber-500/10 text-amber-600 border border-amber-500/20',
      allowedRoles: ['admin', 'bursar'],
    },
    {
      id: 'exams' as NavModule,
      num: '07',
      label: 'Examinations & Results',
      icon: FileSpreadsheet,
      badge: null,
      allowedRoles: ['admin', 'teacher'],
    },
    {
      id: 'accounts' as NavModule,
      num: '08',
      label: 'User Accounts',
      icon: ShieldAlert,
      badge: 'Roles',
      allowedRoles: ['admin', 'teacher', 'bursar'],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-slate-950 text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 text-white flex items-center justify-center font-bold shadow-lg shadow-indigo-600/30">
              <School className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-white text-base tracking-tight">EduPulse</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  v1.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate max-w-[150px] font-medium">
                {settings.name}
              </p>
            </div>
          </div>
        </div>

        {/* Current Active Role Switcher Pill */}
        <div className="px-4 py-3 bg-slate-900/60 border-b border-slate-800/80">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Active Access Role
            </span>
            <span className="text-[10px] text-indigo-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Quick Switch
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800">
            {(['admin', 'teacher', 'bursar'] as UserRole[]).map((role) => {
              const active = currentUser.role === role;
              return (
                <button
                  key={role}
                  onClick={() => switchUserRole(role)}
                  className={`py-1 text-[11px] font-semibold rounded capitalize transition-all cursor-pointer ${
                    active
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  {role}
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Core Modules
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isSelected = activeModule === item.id;
            const isRoleRestricted = !item.allowedRoles.includes(currentUser.role);

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectModule(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all group cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-900/30'
                    : isRoleRestricted
                    ? 'opacity-50 text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-900 text-slate-400 group-hover:text-indigo-400'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                  </div>
                  <div className="min-w-0 flex items-center gap-2">
                    <span className="text-[11px] font-mono text-slate-400 group-hover:text-slate-300">
                      {item.num}.
                    </span>
                    <span className="text-xs truncate font-medium">{item.label}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : item.badgeColor || 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isSelected && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* User Card & Institutional Info */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/90">
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/40 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400">
                  {currentUser.role}
                </span>
              </div>
            </div>
            <button
              onClick={() => onSelectModule('accounts')}
              title="Manage Account"
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 rotate-180" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
