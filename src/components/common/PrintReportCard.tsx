import React from 'react';
import { Student, SchoolClass, Exam, ExamMark, SchoolSettings } from '../../types';
import { Printer, X, Award, CheckCircle2, Calendar, User, School } from 'lucide-react';

interface PrintReportCardProps {
  student: Student;
  schoolClass?: SchoolClass;
  exam: Exam;
  marks: ExamMark[];
  settings: SchoolSettings;
  subjectsMap: Record<string, { name: string; code: string }>;
  attendanceSummary: { totalDays: number; presentDays: number; percentage: number };
  onClose: () => void;
}

export const PrintReportCard: React.FC<PrintReportCardProps> = ({
  student,
  schoolClass,
  exam,
  marks,
  settings,
  subjectsMap,
  attendanceSummary,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const totalMarks = marks.reduce((acc, m) => acc + m.marksObtained, 0);
  const maxPossibleMarks = marks.length * 100;
  const averagePercentage = marks.length > 0 ? Math.round(totalMarks / marks.length) : 0;

  // Grade point mapping
  const getPoints = (marksObtained: number) => {
    if (marksObtained >= 90) return 4.0;
    if (marksObtained >= 80) return 3.8;
    if (marksObtained >= 70) return 3.0;
    if (marksObtained >= 60) return 2.0;
    if (marksObtained >= 50) return 1.0;
    return 0.0;
  };

  const totalPoints = marks.reduce((acc, m) => acc + getPoints(m.marksObtained), 0);
  const gpa = marks.length > 0 ? (totalPoints / marks.length).toFixed(2) : '0.00';

  const getOverallGrade = (pct: number) => {
    if (pct >= 90) return { grade: 'A+', remark: 'Exceptional Distinction' };
    if (pct >= 80) return { grade: 'A', remark: 'Excellent Academic Achievement' };
    if (pct >= 70) return { grade: 'B', remark: 'Good Consistent Performance' };
    if (pct >= 60) return { grade: 'C', remark: 'Satisfactory Progress' };
    if (pct >= 50) return { grade: 'D', remark: 'Pass with Academic Need' };
    return { grade: 'F', remark: 'Requires Remedial Support' };
  };

  const overall = getOverallGrade(averagePercentage);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex justify-center p-4 sm:p-6 print:p-0 print:bg-white">
      <div className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col my-auto border border-slate-200 print:border-none print:shadow-none print:rounded-none">
        {/* Modal Toolbar (hidden when printing) */}
        <div className="no-print flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" />
            <span className="font-semibold text-slate-800 text-sm sm:text-base">Student Academic Report Card</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Sheet */}
        <div className="printable-content p-8 sm:p-12 text-slate-900 bg-white">
          {/* Header */}
          <div className="border-b-2 border-indigo-900/20 pb-6 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-tr from-indigo-700 to-sky-600 text-white flex items-center justify-center font-bold text-2xl shadow-md border-2 border-indigo-200">
                  <School className="w-9 h-9" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{settings.name}</h1>
                  <p className="text-xs sm:text-sm text-indigo-700 font-medium italic mt-0.5">{settings.motto}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {settings.address} • Tel: {settings.phone} • {settings.email}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-block px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-900 font-bold text-xs uppercase tracking-wider rounded-md mb-1">
                  OFFICIAL ACADEMIC TRANSCRIPT
                </span>
                <p className="text-xs text-slate-500">Term: <strong className="text-slate-800">{exam.term}</strong></p>
                <p className="text-xs text-slate-500">Year: <strong className="text-slate-800">{settings.academicYear}</strong></p>
              </div>
            </div>
          </div>

          {/* Student Profile Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200/80 mb-6 text-sm">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Student Name</span>
              <p className="font-bold text-slate-900 text-base">{student.firstName} {student.lastName}</p>
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Admission Number</span>
              <p className="font-mono font-semibold text-indigo-600">{student.admissionNo}</p>
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Class & Section</span>
              <p className="font-bold text-slate-800">{schoolClass ? schoolClass.name : 'Unassigned'}</p>
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Term Attendance</span>
              <p className="font-semibold text-emerald-700">
                {attendanceSummary.percentage}% ({attendanceSummary.presentDays}/{attendanceSummary.totalDays} Days)
              </p>
            </div>
          </div>

          {/* Marks Table */}
          <div className="mb-6 overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">Subject & Code</th>
                  <th className="py-3 px-3 text-center font-semibold">Max</th>
                  <th className="py-3 px-3 text-center font-semibold">Score</th>
                  <th className="py-3 px-3 text-center font-semibold">Grade</th>
                  <th className="py-3 px-3 text-center font-semibold">Points</th>
                  <th className="py-3 px-4 font-semibold">Instructor Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {marks.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-400">
                      No examination marks recorded for this student in {exam.name}.
                    </td>
                  </tr>
                ) : (
                  marks.map((m) => {
                    const sub = subjectsMap[m.subjectId] || { name: 'Subject', code: 'SUB' };
                    const pts = getPoints(m.marksObtained);
                    return (
                      <tr key={m.id} className="hover:bg-slate-50/60">
                        <td className="py-3 px-4">
                          <span className="font-semibold text-slate-900 block">{sub.name}</span>
                          <span className="text-xs font-mono text-slate-500">{sub.code}</span>
                        </td>
                        <td className="py-3 px-3 text-center text-slate-500">100</td>
                        <td className="py-3 px-3 text-center font-bold text-slate-900">{m.marksObtained}</td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded text-xs font-extrabold ${
                              m.grade === 'A+' || m.grade === 'A'
                                ? 'bg-emerald-100 text-emerald-800'
                                : m.grade === 'B'
                                ? 'bg-blue-100 text-blue-800'
                                : m.grade === 'C'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {m.grade}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-medium text-slate-700">{pts.toFixed(1)}</td>
                        <td className="py-3 px-4 text-xs text-slate-600 italic">{m.remarks || 'Satisfactory work'}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Performance Summary Cards */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-xl text-center">
              <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wider block">Aggregate Score</span>
              <span className="text-2xl font-black text-indigo-900">{totalMarks} / {maxPossibleMarks}</span>
              <span className="text-xs text-indigo-600 block mt-0.5">Average: {averagePercentage}%</span>
            </div>
            <div className="p-4 bg-sky-50/70 border border-sky-100 rounded-xl text-center">
              <span className="text-xs font-semibold text-sky-700 uppercase tracking-wider block">Term GPA</span>
              <span className="text-2xl font-black text-sky-900">{gpa}</span>
              <span className="text-xs text-sky-600 block mt-0.5">Scale: 4.0 Max</span>
            </div>
            <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-xl text-center">
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block">Overall Standing</span>
              <span className="text-2xl font-black text-emerald-900">{overall.grade}</span>
              <span className="text-xs text-emerald-700 block mt-0.5 truncate">{overall.remark}</span>
            </div>
          </div>

          {/* Remarks & Signatures */}
          <div className="space-y-4 pt-2">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs leading-relaxed text-slate-700">
              <strong className="text-slate-900">Class Teacher Remarks: </strong>
              {student.firstName} has demonstrated commendable academic focus and social engagement throughout this assessment period.
              Recommended to continue regular revision in science disciplines.
            </div>

            <div className="grid grid-cols-2 gap-12 pt-8">
              <div className="border-t border-slate-300 pt-2 text-center">
                <p className="font-semibold text-slate-800 text-sm">Class Tutor</p>
                <p className="text-xs text-slate-400">Signature & Date</p>
              </div>
              <div className="border-t border-slate-300 pt-2 text-center">
                <p className="font-semibold text-slate-800 text-sm">{settings.principalName}</p>
                <p className="text-xs text-slate-400">Head of School / Principal</p>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-8 pt-4 border-t border-slate-100 text-center text-[10px] text-slate-400">
            Official Document of {settings.name} • Generated electronically on {new Date().toLocaleDateString('en-US', { dateStyle: 'long' })}
          </div>
        </div>
      </div>
    </div>
  );
};
