import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Student,
  Teacher,
  SchoolClass,
  Subject,
  AttendanceRecord,
  StudentFee,
  Exam,
  ExamMark,
  UserAccount,
  SchoolSettings,
  ActivityItem,
  UserRole,
  FeePayment,
} from '../types';
import {
  INITIAL_SETTINGS,
  INITIAL_USERS,
  INITIAL_SUBJECTS,
  INITIAL_TEACHERS,
  INITIAL_CLASSES,
  INITIAL_STUDENTS,
  INITIAL_FEES,
  INITIAL_ATTENDANCE,
  INITIAL_EXAMS,
  INITIAL_EXAM_MARKS,
  INITIAL_ACTIVITIES,
} from '../data/mockData';

const STORAGE_KEY = 'edupulse_school_data_v2';

interface SchoolContextType {
  // Active User & Auth
  currentUser: UserAccount;
  switchUserRole: (role: UserRole) => void;
  setCurrentUser: (user: UserAccount) => void;
  users: UserAccount[];
  addUser: (user: Omit<UserAccount, 'id'>) => void;
  updateUser: (user: UserAccount) => void;

  // Settings
  settings: SchoolSettings;
  updateSettings: (newSettings: Partial<SchoolSettings>) => void;
  resetToSampleData: () => void;

  // Students
  students: Student[];
  addStudent: (student: Omit<Student, 'id' | 'admissionNo' | 'avatar'> & { avatar?: string }) => Student;
  updateStudent: (student: Student) => void;
  deleteStudent: (id: string) => void;

  // Teachers
  teachers: Teacher[];
  addTeacher: (teacher: Omit<Teacher, 'id' | 'employeeId' | 'avatar'> & { avatar?: string }) => Teacher;
  updateTeacher: (teacher: Teacher) => void;
  deleteTeacher: (id: string) => void;

  // Classes & Subjects
  classes: SchoolClass[];
  addClass: (cls: Omit<SchoolClass, 'id'>) => SchoolClass;
  updateClass: (cls: SchoolClass) => void;
  deleteClass: (id: string) => void;
  subjects: Subject[];
  addSubject: (subject: Omit<Subject, 'id'>) => Subject;

  // Attendance
  attendanceRecords: AttendanceRecord[];
  saveAttendanceBatch: (records: Array<{ studentId: string; classId: string; date: string; status: AttendanceRecord['status']; remarks?: string }>) => void;
  getAttendanceForDateAndClass: (date: string, classId: string) => AttendanceRecord[];

  // Fees
  fees: StudentFee[];
  recordPayment: (payment: {
    studentId: string;
    amount: number;
    paymentMethod: FeePayment['paymentMethod'];
    referenceNo: string;
    notes?: string;
  }) => FeePayment | null;
  addStudentFeeInvoice: (fee: Omit<StudentFee, 'id' | 'payments' | 'amountPaid' | 'balance' | 'status'>) => void;

  // Exams & Marks
  exams: Exam[];
  addExam: (exam: Omit<Exam, 'id'>) => Exam;
  examMarks: ExamMark[];
  saveExamMarksBatch: (marks: Array<{
    examId: string;
    studentId: string;
    classId: string;
    subjectId: string;
    marksObtained: number;
    remarks?: string;
  }>) => void;
  calculateGrade: (marks: number) => { grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F'; points: number; description: string };

  // Activities
  activities: ActivityItem[];
  addActivity: (title: string, description: string, type: ActivityItem['type']) => void;

  // Calculated Stats
  stats: {
    totalStudents: number;
    totalTeachers: number;
    totalClasses: number;
    todayAttendanceRate: number;
    todayPresentCount: number;
    todayAbsentCount: number;
    totalFeesInvoiced: number;
    totalFeesCollected: number;
    totalOutstandingFees: number;
    collectionRate: number;
  };
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state from localStorage or mock data
  const loadStored = <T,>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(`${STORAGE_KEY}_${key}`);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  };

  const [settings, setSettings] = useState<SchoolSettings>(() => loadStored('settings', INITIAL_SETTINGS));
  const [users, setUsers] = useState<UserAccount[]>(() => loadStored('users', INITIAL_USERS));
  const [currentUser, setCurrentUserState] = useState<UserAccount>(() => {
    const stored = loadStored<UserAccount | null>('currentUser', null);
    return stored || INITIAL_USERS[0];
  });
  const [subjects, setSubjects] = useState<Subject[]>(() => loadStored('subjects', INITIAL_SUBJECTS));
  const [teachers, setTeachers] = useState<Teacher[]>(() => loadStored('teachers', INITIAL_TEACHERS));
  const [classes, setClasses] = useState<SchoolClass[]>(() => loadStored('classes', INITIAL_CLASSES));
  const [students, setStudents] = useState<Student[]>(() => loadStored('students', INITIAL_STUDENTS));
  const [fees, setFees] = useState<StudentFee[]>(() => loadStored('fees', INITIAL_FEES));
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => loadStored('attendance', INITIAL_ATTENDANCE));
  const [exams, setExams] = useState<Exam[]>(() => loadStored('exams', INITIAL_EXAMS));
  const [examMarks, setExamMarks] = useState<ExamMark[]>(() => loadStored('examMarks', INITIAL_EXAM_MARKS));
  const [activities, setActivities] = useState<ActivityItem[]>(() => loadStored('activities', INITIAL_ACTIVITIES));

  // Sync state to localStorage whenever modified
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_settings`, JSON.stringify(settings));
      localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(users));
      localStorage.setItem(`${STORAGE_KEY}_currentUser`, JSON.stringify(currentUser));
      localStorage.setItem(`${STORAGE_KEY}_subjects`, JSON.stringify(subjects));
      localStorage.setItem(`${STORAGE_KEY}_teachers`, JSON.stringify(teachers));
      localStorage.setItem(`${STORAGE_KEY}_classes`, JSON.stringify(classes));
      localStorage.setItem(`${STORAGE_KEY}_students`, JSON.stringify(students));
      localStorage.setItem(`${STORAGE_KEY}_fees`, JSON.stringify(fees));
      localStorage.setItem(`${STORAGE_KEY}_attendance`, JSON.stringify(attendanceRecords));
      localStorage.setItem(`${STORAGE_KEY}_exams`, JSON.stringify(exams));
      localStorage.setItem(`${STORAGE_KEY}_examMarks`, JSON.stringify(examMarks));
      localStorage.setItem(`${STORAGE_KEY}_activities`, JSON.stringify(activities));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
  }, [settings, users, currentUser, subjects, teachers, classes, students, fees, attendanceRecords, exams, examMarks, activities]);

  // Activity logger helper
  const addActivity = (title: string, description: string, type: ActivityItem['type']) => {
    const newItem: ActivityItem = {
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title,
      description,
      time: 'Just now',
      user: currentUser.name,
      type,
    };
    setActivities((prev) => [newItem, ...prev.slice(0, 40)]);
  };

  // Role Switcher
  const switchUserRole = (role: UserRole) => {
    const target = users.find((u) => u.role === role) || {
      id: `usr-${Date.now()}`,
      name: role === 'admin' ? 'Administrator' : role === 'teacher' ? 'Class Teacher' : 'Bursar Officer',
      email: `${role}@edupulse.edu`,
      role,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      status: 'active' as const,
    };
    setCurrentUserState(target);
    addActivity('Role Switched', `Logged in as ${target.name} (${role.toUpperCase()})`, 'student');
  };

  const setCurrentUser = (user: UserAccount) => {
    setCurrentUserState(user);
  };

  const addUser = (userData: Omit<UserAccount, 'id'>) => {
    const newUser: UserAccount = {
      ...userData,
      id: `usr-${Date.now()}`,
    };
    setUsers((prev) => [...prev, newUser]);
    addActivity('User Account Created', `Created account for ${newUser.name} with ${newUser.role.toUpperCase()} role`, 'student');
  };

  const updateUser = (updated: UserAccount) => {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    if (currentUser.id === updated.id) {
      setCurrentUserState(updated);
    }
  };

  // Settings
  const updateSettings = (newSettings: Partial<SchoolSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    addActivity('Settings Updated', 'School institutional configuration modified', 'class');
  };

  const resetToSampleData = () => {
    setSettings(INITIAL_SETTINGS);
    setUsers(INITIAL_USERS);
    setCurrentUserState(INITIAL_USERS[0]);
    setSubjects(INITIAL_SUBJECTS);
    setTeachers(INITIAL_TEACHERS);
    setClasses(INITIAL_CLASSES);
    setStudents(INITIAL_STUDENTS);
    setFees(INITIAL_FEES);
    setAttendanceRecords(INITIAL_ATTENDANCE);
    setExams(INITIAL_EXAMS);
    setExamMarks(INITIAL_EXAM_MARKS);
    setActivities(INITIAL_ACTIVITIES);
    localStorage.clear();
    addActivity('System Reset', 'Restored default sample records and configuration', 'class');
  };

  // Students CRUD
  const addStudent = (studentData: Omit<Student, 'id' | 'admissionNo' | 'avatar'> & { avatar?: string }): Student => {
    const year = new Date().getFullYear();
    const count = students.length + 101;
    const admissionNo = `STU-${year}-${count}`;
    const newStudent: Student = {
      ...studentData,
      id: `stu-${Date.now()}`,
      admissionNo,
      avatar:
        studentData.avatar ||
        `https://images.unsplash.com/photo-${studentData.gender === 'Female' ? '1534528741775-53994a69daeb' : '1507003211169-0a1dd7228f2d'}?w=150&auto=format&fit=crop&q=80`,
    };

    setStudents((prev) => [newStudent, ...prev]);

    // Automatically create tuition fee record for the new student
    const newFee: StudentFee = {
      id: `fee-${Date.now()}`,
      studentId: newStudent.id,
      term: settings.currentTerm,
      academicYear: settings.academicYear,
      totalDue: 2400,
      amountPaid: 0,
      balance: 2400,
      status: 'unpaid',
      dueDate: '2026-11-30',
      breakdown: {
        tuition: 1800,
        lab: 250,
        library: 100,
        development: 150,
        activities: 100,
      },
      payments: [],
    };
    setFees((prev) => [newFee, ...prev]);

    addActivity(
      'New Student Enrolled',
      `Registered ${newStudent.firstName} ${newStudent.lastName} (${newStudent.admissionNo})`,
      'student'
    );
    return newStudent;
  };

  const updateStudent = (updatedStudent: Student) => {
    setStudents((prev) => prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)));
    addActivity('Student Profile Updated', `Updated profile for ${updatedStudent.firstName} ${updatedStudent.lastName}`, 'student');
  };

  const deleteStudent = (id: string) => {
    const student = students.find((s) => s.id === id);
    setStudents((prev) => prev.filter((s) => s.id !== id));
    setFees((prev) => prev.filter((f) => f.studentId !== id));
    setAttendanceRecords((prev) => prev.filter((a) => a.studentId !== id));
    setExamMarks((prev) => prev.filter((m) => m.studentId !== id));
    if (student) {
      addActivity('Student Removed', `Removed ${student.firstName} ${student.lastName} from system`, 'student');
    }
  };

  // Teachers CRUD
  const addTeacher = (teacherData: Omit<Teacher, 'id' | 'employeeId' | 'avatar'> & { avatar?: string }): Teacher => {
    const year = new Date().getFullYear();
    const count = String(teachers.length + 1).padStart(3, '0');
    const employeeId = `TCH-${year}-${count}`;
    const newTeacher: Teacher = {
      ...teacherData,
      id: `tch-${Date.now()}`,
      employeeId,
      avatar:
        teacherData.avatar ||
        `https://images.unsplash.com/photo-${teacherData.gender === 'Female' ? '1573497019940-1c28c88b4f3e' : '1500648767791-00dcc994a43e'}?w=150&auto=format&fit=crop&q=80`,
    };
    setTeachers((prev) => [newTeacher, ...prev]);
    addActivity('Teacher Registered', `Added faculty member ${newTeacher.firstName} ${newTeacher.lastName} (${newTeacher.department})`, 'teacher');
    return newTeacher;
  };

  const updateTeacher = (updatedTeacher: Teacher) => {
    setTeachers((prev) => prev.map((t) => (t.id === updatedTeacher.id ? updatedTeacher : t)));
    addActivity('Teacher Updated', `Updated profile of ${updatedTeacher.firstName} ${updatedTeacher.lastName}`, 'teacher');
  };

  const deleteTeacher = (id: string) => {
    const teacher = teachers.find((t) => t.id === id);
    setTeachers((prev) => prev.filter((t) => t.id !== id));
    if (teacher) {
      addActivity('Teacher Removed', `Removed teacher ${teacher.firstName} ${teacher.lastName}`, 'teacher');
    }
  };

  // Classes CRUD
  const addClass = (clsData: Omit<SchoolClass, 'id'>): SchoolClass => {
    const newClass: SchoolClass = {
      ...clsData,
      id: `cls-${Date.now()}`,
    };
    setClasses((prev) => [...prev, newClass]);
    addActivity('Class Created', `Created class ${newClass.name} (Room ${newClass.room})`, 'class');
    return newClass;
  };

  const updateClass = (updatedClass: SchoolClass) => {
    setClasses((prev) => prev.map((c) => (c.id === updatedClass.id ? updatedClass : c)));
    addActivity('Class Updated', `Updated class details for ${updatedClass.name}`, 'class');
  };

  const deleteClass = (id: string) => {
    const cls = classes.find((c) => c.id === id);
    setClasses((prev) => prev.filter((c) => c.id !== id));
    if (cls) {
      addActivity('Class Removed', `Deleted class ${cls.name}`, 'class');
    }
  };

  const addSubject = (subjectData: Omit<Subject, 'id'>): Subject => {
    const newSubject: Subject = {
      ...subjectData,
      id: `sub-${Date.now()}`,
    };
    setSubjects((prev) => [...prev, newSubject]);
    addActivity('Subject Added', `Added course ${newSubject.name} (${newSubject.code})`, 'class');
    return newSubject;
  };

  // Attendance
  const saveAttendanceBatch = (
    records: Array<{ studentId: string; classId: string; date: string; status: AttendanceRecord['status']; remarks?: string }>
  ) => {
    setAttendanceRecords((prev) => {
      // Filter out any existing records for the same student and date
      const keysToReplace = new Set(records.map((r) => `${r.studentId}_${r.date}`));
      const kept = prev.filter((p) => !keysToReplace.has(`${p.studentId}_${p.date}`));
      const newItems: AttendanceRecord[] = records.map((r, i) => ({
        id: `att-${Date.now()}-${i}`,
        studentId: r.studentId,
        classId: r.classId,
        date: r.date,
        status: r.status,
        remarks: r.remarks,
      }));
      return [...newItems, ...kept];
    });

    const cls = classes.find((c) => c.id === records[0]?.classId);
    addActivity(
      'Attendance Recorded',
      `Saved attendance for ${records.length} students in ${cls?.name || 'Class'} on ${records[0]?.date}`,
      'attendance'
    );
  };

  const getAttendanceForDateAndClass = (date: string, classId: string): AttendanceRecord[] => {
    return attendanceRecords.filter((a) => a.date === date && a.classId === classId);
  };

  // Fees
  const recordPayment = (paymentData: {
    studentId: string;
    amount: number;
    paymentMethod: FeePayment['paymentMethod'];
    referenceNo: string;
    notes?: string;
  }): FeePayment | null => {
    const student = students.find((s) => s.id === paymentData.studentId);
    const existingFee = fees.find((f) => f.studentId === paymentData.studentId);
    if (!existingFee) return null;

    const receiptNo = `REC-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`;
    const newPayment: FeePayment = {
      id: `pmt-${Date.now()}`,
      receiptNo,
      studentId: paymentData.studentId,
      amount: paymentData.amount,
      paymentMethod: paymentData.paymentMethod,
      referenceNo: paymentData.referenceNo,
      date: new Date().toISOString().split('T')[0],
      receivedBy: currentUser.name,
      notes: paymentData.notes,
    };

    setFees((prev) =>
      prev.map((f) => {
        if (f.studentId !== paymentData.studentId) return f;
        const newPaid = f.amountPaid + paymentData.amount;
        const newBalance = Math.max(0, f.totalDue - newPaid);
        let newStatus: StudentFee['status'] = 'partial';
        if (newBalance === 0) newStatus = 'paid';
        else if (newPaid === 0) newStatus = 'unpaid';

        return {
          ...f,
          amountPaid: newPaid,
          balance: newBalance,
          status: newStatus,
          payments: [newPayment, ...f.payments],
        };
      })
    );

    addActivity(
      'Fee Payment Recorded',
      `Received ${settings.currency}${paymentData.amount.toLocaleString()} for ${student ? `${student.firstName} ${student.lastName}` : 'Student'} (${receiptNo})`,
      'fee'
    );

    return newPayment;
  };

  const addStudentFeeInvoice = (feeData: Omit<StudentFee, 'id' | 'payments' | 'amountPaid' | 'balance' | 'status'>) => {
    const newFee: StudentFee = {
      ...feeData,
      id: `fee-${Date.now()}`,
      amountPaid: 0,
      balance: feeData.totalDue,
      status: 'unpaid',
      payments: [],
    };
    setFees((prev) => [newFee, ...prev]);
    addActivity('Fee Invoice Created', `Created invoice for ${settings.currency}${feeData.totalDue}`, 'fee');
  };

  // Exams & Marks
  const addExam = (examData: Omit<Exam, 'id'>): Exam => {
    const newExam: Exam = {
      ...examData,
      id: `ex-${Date.now()}`,
    };
    setExams((prev) => [newExam, ...prev]);
    addActivity('Exam Session Scheduled', `Scheduled ${newExam.name}`, 'exam');
    return newExam;
  };

  const calculateGrade = (marks: number): { grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F'; points: number; description: string } => {
    const scales = [...settings.gradingScale].sort((a, b) => b.minMarks - a.minMarks);
    for (const s of scales) {
      if (marks >= s.minMarks) {
        return { grade: s.grade, points: s.points, description: s.description };
      }
    }
    return { grade: 'F', points: 0.0, description: 'Unsatisfactory' };
  };

  const saveExamMarksBatch = (
    marksList: Array<{
      examId: string;
      studentId: string;
      classId: string;
      subjectId: string;
      marksObtained: number;
      remarks?: string;
    }>
  ) => {
    setExamMarks((prev) => {
      const keysToReplace = new Set(marksList.map((m) => `${m.examId}_${m.studentId}_${m.subjectId}`));
      const kept = prev.filter((p) => !keysToReplace.has(`${p.examId}_${p.studentId}_${p.subjectId}`));
      const newItems: ExamMark[] = marksList.map((m, i) => {
        const gradeInfo = calculateGrade(m.marksObtained);
        return {
          id: `mk-${Date.now()}-${i}`,
          examId: m.examId,
          studentId: m.studentId,
          classId: m.classId,
          subjectId: m.subjectId,
          marksObtained: m.marksObtained,
          maxMarks: 100,
          grade: gradeInfo.grade,
          remarks: m.remarks || gradeInfo.description,
        };
      });
      return [...newItems, ...kept];
    });

    const ex = exams.find((e) => e.id === marksList[0]?.examId);
    const sub = subjects.find((s) => s.id === marksList[0]?.subjectId);
    addActivity(
      'Exam Marks Recorded',
      `Saved grades for ${marksList.length} students in ${sub?.name || 'Subject'} (${ex?.name || 'Exam'})`,
      'exam'
    );
  };

  // Calculated Stats
  const today = '2026-11-12';
  const todayAttendance = attendanceRecords.filter((a) => a.date === today);
  const todayPresent = todayAttendance.filter((a) => a.status === 'present').length;
  const todayAbsent = todayAttendance.filter((a) => a.status === 'absent').length;
  const todayAttendanceRate =
    todayAttendance.length > 0 ? Math.round(((todayPresent + todayAttendance.filter((a) => a.status === 'late').length) / todayAttendance.length) * 100) : 94;

  const totalFeesInvoiced = fees.reduce((acc, f) => acc + f.totalDue, 0);
  const totalFeesCollected = fees.reduce((acc, f) => acc + f.amountPaid, 0);
  const totalOutstandingFees = fees.reduce((acc, f) => acc + f.balance, 0);
  const collectionRate = totalFeesInvoiced > 0 ? Math.round((totalFeesCollected / totalFeesInvoiced) * 100) : 0;

  const stats = {
    totalStudents: students.length,
    totalTeachers: teachers.length,
    totalClasses: classes.length,
    todayAttendanceRate,
    todayPresentCount: todayPresent,
    todayAbsentCount: todayAbsent,
    totalFeesInvoiced,
    totalFeesCollected,
    totalOutstandingFees,
    collectionRate,
  };

  return (
    <SchoolContext.Provider
      value={{
        currentUser,
        switchUserRole,
        setCurrentUser,
        users,
        addUser,
        updateUser,
        settings,
        updateSettings,
        resetToSampleData,
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        teachers,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        classes,
        addClass,
        updateClass,
        deleteClass,
        subjects,
        addSubject,
        attendanceRecords,
        saveAttendanceBatch,
        getAttendanceForDateAndClass,
        fees,
        recordPayment,
        addStudentFeeInvoice,
        exams,
        addExam,
        examMarks,
        saveExamMarksBatch,
        calculateGrade,
        activities,
        addActivity,
        stats,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
