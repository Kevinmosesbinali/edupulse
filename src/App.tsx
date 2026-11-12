/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SchoolProvider, useSchool } from './context/SchoolContext';
import { Sidebar, NavModule } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardModule } from './components/dashboard/DashboardModule';
import { StudentManagementModule } from './components/students/StudentManagementModule';
import { TeacherManagementModule } from './components/teachers/TeacherManagementModule';
import { ClassManagementModule } from './components/classes/ClassManagementModule';
import { AttendanceModule } from './components/attendance/AttendanceModule';
import { FeesManagementModule } from './components/fees/FeesManagementModule';
import { ExaminationsModule } from './components/exams/ExaminationsModule';
import { UserAccountsModule } from './components/accounts/UserAccountsModule';

function SchoolAppContent() {
  const [activeModule, setActiveModule] = useState<NavModule>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [preselectedFeeStudentId, setPreselectedFeeStudentId] = useState<string | null>(null);

  // Quick Action Handlers
  const handleQuickAddStudent = () => {
    setActiveModule('students');
  };

  const handleQuickRecordPayment = () => {
    setActiveModule('fees');
  };

  const handleRecordFeeForStudent = (studentId: string) => {
    setPreselectedFeeStudentId(studentId);
    setActiveModule('fees');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Persistent Left Sidebar */}
      <Sidebar
        activeModule={activeModule}
        onSelectModule={(mod) => {
          setActiveModule(mod);
          setIsSidebarOpen(false);
        }}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area (offset by sidebar width on lg screens) */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0 min-h-screen">
        {/* Sticky Header with Search & Role Status */}
        <Header
          activeModule={activeModule}
          onSelectModule={setActiveModule}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onQuickAddStudent={handleQuickAddStudent}
          onQuickRecordPayment={handleQuickRecordPayment}
        />

        {/* Dynamic Module Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeModule === 'dashboard' && (
            <DashboardModule
              onNavigate={setActiveModule}
              onOpenAddStudent={handleQuickAddStudent}
              onOpenRecordPayment={handleQuickRecordPayment}
            />
          )}

          {activeModule === 'students' && (
            <StudentManagementModule
              onOpenRecordFeeForStudent={handleRecordFeeForStudent}
            />
          )}

          {activeModule === 'teachers' && <TeacherManagementModule />}

          {activeModule === 'classes' && (
            <ClassManagementModule
              onNavigateToAttendance={() => setActiveModule('attendance')}
            />
          )}

          {activeModule === 'attendance' && <AttendanceModule />}

          {activeModule === 'fees' && (
            <FeesManagementModule
              initialStudentIdForPayment={preselectedFeeStudentId}
              onClearInitialStudentId={() => setPreselectedFeeStudentId(null)}
            />
          )}

          {activeModule === 'exams' && <ExaminationsModule />}

          {activeModule === 'accounts' && <UserAccountsModule />}
        </main>

        {/* School System Footer */}
        <footer className="no-print py-4 px-6 border-t border-slate-200/80 bg-white text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 mt-auto">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">EduPulse School Management System</span>
            <span>•</span>
            <span>Release 1.0</span>
          </div>
          <div className="text-slate-400 text-[11px]">
            Modules: Dashboard • Students • Teachers • Classes • Attendance • Fees • Examinations • Accounts
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <SchoolProvider>
      <SchoolAppContent />
    </SchoolProvider>
  );
}
