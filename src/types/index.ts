export type UserRole = 'admin' | 'teacher' | 'bursar';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  department?: string;
  assignedTeacherId?: string;
  lastLogin?: string;
  status: 'active' | 'inactive';
}

export interface Student {
  id: string;
  admissionNo: string;
  firstName: string;
  lastName: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  classId: string;
  admissionDate: string;
  avatar: string;
  status: 'active' | 'graduated' | 'suspended';
  bloodGroup?: string;
  // Parent/Guardian Info
  parentName: string;
  parentRelationship: 'Father' | 'Mother' | 'Guardian';
  parentPhone: string;
  parentEmail: string;
  homeAddress: string;
  emergencyContact: string;
  medicalNotes?: string;
}

export interface Teacher {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: 'Male' | 'Female' | 'Other';
  department: 'Sciences' | 'Mathematics' | 'Languages' | 'Humanities' | 'Arts & Music' | 'Physical Education' | 'Computer Science';
  qualification: string; // e.g. "M.Sc. Applied Mathematics", "B.Ed. English Literature"
  subjectsTaught: string[];
  assignedClassIds: string[];
  joinDate: string;
  avatar: string;
  status: 'active' | 'on_leave';
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  department: string;
  creditHours: number;
}

export interface SchoolClass {
  id: string;
  name: string; // e.g. "Grade 10-A"
  gradeLevel: string; // "10"
  section: string; // "A"
  classTeacherId: string; // Teacher ID
  room: string;
  capacity: number;
  subjectIds: string[];
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  remarks?: string;
}

export interface FeePayment {
  id: string;
  receiptNo: string;
  studentId: string;
  amount: number;
  paymentMethod: 'Bank Transfer' | 'Cash' | 'Credit/Debit Card' | 'Mobile Money' | 'Cheque';
  referenceNo: string;
  date: string;
  receivedBy: string;
  notes?: string;
}

export interface StudentFee {
  id: string;
  studentId: string;
  term: string;
  academicYear: string;
  totalDue: number;
  amountPaid: number;
  balance: number;
  status: 'paid' | 'partial' | 'unpaid' | 'overdue';
  dueDate: string;
  breakdown: {
    tuition: number;
    lab: number;
    library: number;
    development: number;
    activities: number;
  };
  payments: FeePayment[];
}

export interface Exam {
  id: string;
  name: string; // e.g. "Term 1 Mid-Term Assessment"
  term: string;
  academicYear: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface ExamMark {
  id: string;
  examId: string;
  studentId: string;
  classId: string;
  subjectId: string;
  marksObtained: number; // 0 - 100
  maxMarks: number; // default 100
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  remarks: string;
}

export interface SchoolSettings {
  name: string;
  motto: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  academicYear: string;
  currentTerm: string;
  currency: string;
  principalName: string;
  gradingScale: {
    minMarks: number;
    grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
    points: number;
    description: string;
  }[];
}

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  time: string;
  user: string;
  type: 'student' | 'teacher' | 'attendance' | 'fee' | 'exam' | 'class';
}
