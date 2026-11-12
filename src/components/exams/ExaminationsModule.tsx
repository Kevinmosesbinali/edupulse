import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Award,
  Search,
  Plus,
  Save,
  Printer,
  TrendingUp,
  Users,
  CheckCircle2,
  Calendar,
  Sparkles,
  BarChart3,
  X,
  BookOpen,
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { Exam, ExamMark, Student } from '../../types';
import { PrintReportCard } from '../common/PrintReportCard';

export const ExaminationsModule: React.FC = () => {
  const {
    exams,
    addExam,
    classes,
    subjects,
    students,
    examMarks,
    saveExamMarksBatch,
    calculateGrade,
    settings,
    currentUser,
  } = useSchool();

  const [selectedExamId, setSelectedExamId] = useState<string>(exams[0]?.id || '');
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'entry' | 'rankings'>('entry');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Local marks entry table: studentId -> { marks: number, remarks: string }
  const [marksSheet, setMarksSheet] = useState<Record<string, { marks: number; remarks: string }>>({});

  // Report Card Modal
  const [selectedStudentForReport, setSelectedStudentForReport] = useState<Student | null>(null);

  // New Exam Modal
  const [isAddExamOpen, setIsAddExamOpen] = useState(false);
  const [examForm, setExamForm] = useState({
    name: '',
    term: settings.currentTerm,
    academicYear: settings.academicYear,
    startDate: '2026-11-20',
    endDate: '2026-11-28',
    status: 'upcoming' as Exam['status'],
  });

  const classStudents = students.filter((s) => s.classId === selectedClassId);
  const selectedClass = classes.find((c) => c.id === selectedClassId);
  const selectedSubject = subjects.find((s) => s.id === selectedSubjectId);
  const selectedExam = exams.find((e) => e.id === selectedExamId);

  // Load existing marks into local sheet
  useEffect(() => {
    if (!selectedExamId || !selectedSubjectId || !selectedClassId) return;

    const initialSheet: Record<string, { marks: number; remarks: string }> = {};

    classStudents.forEach((student) => {
      const existing = examMarks.find(
        (m) =>
          m.examId === selectedExamId &&
          m.subjectId === selectedSubjectId &&
          m.studentId === student.id
      );

      if (existing) {
        initialSheet[student.id] = {
          marks: existing.marksObtained,
          remarks: existing.remarks || '',
        };
      } else {
        initialSheet[student.id] = {
          marks: 75,
          remarks: '',
        };
      }
    });

    setMarksSheet(initialSheet);
  }, [selectedExamId, selectedClassId, selectedSubjectId, students, examMarks]);

  const updateStudentMark = (studentId: string, val: number) => {
    const clamped = Math.max(0, Math.min(100, isNaN(val) ? 0 : val));
    setMarksSheet((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        marks: clamped,
      },
    }));
  };

  const updateStudentRemark = (studentId: string, remarks: string) => {
    setMarksSheet((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks,
      },
    }));
  };

  const handleSaveMarks = () => {
    const batch = classStudents.map((s) => ({
      examId: selectedExamId,
      classId: selectedClassId,
      subjectId: selectedSubjectId,
      studentId: s.id,
      marksObtained: marksSheet[s.id]?.marks ?? 70,
      remarks: marksSheet[s.id]?.remarks || '',
    }));

    saveExamMarksBatch(batch);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    const created = addExam(examForm);
    setSelectedExamId(created.id);
    setIsAddExamOpen(false);
  };

  // Class performance statistics for current subject
  const currentSubjectMarks = classStudents.map((s) => marksSheet[s.id]?.marks ?? 0);
  const averageScore =
    currentSubjectMarks.length > 0
      ? Math.round(currentSubjectMarks.reduce((a, b) => a + b, 0) / currentSubjectMarks.length)
      : 0;
  const highestScore = currentSubjectMarks.length > 0 ? Math.max(...currentSubjectMarks) : 0;
  const passingCount = currentSubjectMarks.filter((m) => m >= 50).length;
  const passRate =
    currentSubjectMarks.length > 0 ? Math.round((passingCount / currentSubjectMarks.length) * 100) : 0;

  // Class aggregate student rankings (across all subjects for this exam)
  const studentRankings = classStudents
    .map((student) => {
      const studentMarks = examMarks.filter(
        (m) => m.examId === selectedExamId && m.studentId === student.id
      );
      const totalScore = studentMarks.reduce((acc, m) => acc + m.marksObtained, 0);
      const avg = studentMarks.length > 0 ? Math.round(totalScore / studentMarks.length) : 0;
      return {
        student,
        marksCount: studentMarks.length,
        totalScore,
        averagePercentage: avg,
        overallGrade: calculateGrade(avg),
      };
    })
    .sort((a, b) => b.averagePercentage - a.averagePercentage);

  // Subject dictionary
  const subjectsMap: Record<string, { name: string; code: string }> = {};
  subjects.forEach((s) => {
    subjectsMap[s.id] = { name: s.name, code: s.code };
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
            <span>Examinations, Marks & Academic Reports</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Grade examinations, compute term standings, and generate printable student report cards
          </p>
        </div>

        <div className="flex items-center gap-2">
          {currentUser.role === 'admin' && (
            <button
              onClick={() => setIsAddExamOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 text-indigo-600" />
              <span>Schedule Exam</span>
            </button>
          )}

          {activeTab === 'entry' && (
            <button
              onClick={handleSaveMarks}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Marks</span>
            </button>
          )}
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Exam Session */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Examination Session
            </label>
            <select
              value={selectedExamId}
              onChange={(e) => setSelectedExamId(e.target.value)}
              className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-800 text-xs focus:bg-white focus:border-indigo-500 cursor-pointer"
            >
              {exams.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.name} ({ex.term})
                </option>
              ))}
            </select>
          </div>

          {/* Class Select */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Class Section
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-800 text-xs focus:bg-white focus:border-indigo-500 cursor-pointer"
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subject Select (relevant for marks entry) */}
          {activeTab === 'entry' && (
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Subject Course
              </label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-800 text-xs focus:bg-white focus:border-indigo-500 cursor-pointer"
              >
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name} ({sub.code})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('entry')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'entry'
                ? 'bg-white shadow-xs text-indigo-600 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Subject Grading Entry
          </button>
          <button
            onClick={() => setActiveTab('rankings')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'rankings'
                ? 'bg-white shadow-xs text-indigo-600 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Class Standings & Report Cards
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Examination marks recorded and saved successfully!</span>
        </div>
      )}

      {activeTab === 'entry' ? (
        <>
          {/* Quick Subject Metrics Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Students Graded</span>
              <span className="text-2xl font-black text-slate-900">{classStudents.length}</span>
            </div>
            <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-100 text-center">
              <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider block">Class Average</span>
              <span className="text-2xl font-black text-indigo-900">{averageScore}%</span>
            </div>
            <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-100 text-center">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Highest Mark</span>
              <span className="text-2xl font-black text-emerald-900">{highestScore}/100</span>
            </div>
            <div className="bg-sky-50/70 p-4 rounded-xl border border-sky-100 text-center">
              <span className="text-[10px] font-bold text-sky-800 uppercase tracking-wider block">Pass Rate</span>
              <span className="text-2xl font-black text-sky-900">{passRate}%</span>
            </div>
          </div>

          {/* Grading Entry Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="font-bold text-xs text-slate-800">
                Grading Matrix: {selectedSubject?.name} • {selectedClass?.name}
              </span>
              <span className="text-[11px] text-slate-500">Max Score: 100</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 w-12 text-center">#</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-3">Admission No</th>
                    <th className="py-3 px-4 w-32 text-center">Score (/100)</th>
                    <th className="py-3 px-3 w-24 text-center">Grade</th>
                    <th className="py-3 px-4">Instructor Feedback</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {classStudents.map((student, idx) => {
                    const markVal = marksSheet[student.id]?.marks ?? 0;
                    const remarkVal = marksSheet[student.id]?.remarks ?? '';
                    const gradeInfo = calculateGrade(markVal);

                    return (
                      <tr key={student.id} className="hover:bg-slate-50/70">
                        <td className="py-3 px-4 text-center font-mono text-slate-400 font-bold">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={student.avatar}
                              alt={student.firstName}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <span className="font-bold text-slate-900">
                              {student.firstName} {student.lastName}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-600">
                          {student.admissionNo}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={markVal}
                            onChange={(e) => updateStudentMark(student.id, Number(e.target.value))}
                            className="w-20 px-2.5 py-1.5 text-center font-black text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-indigo-500 text-slate-900"
                          />
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`inline-block px-2.5 py-1 rounded text-xs font-black ${
                              gradeInfo.grade === 'A+' || gradeInfo.grade === 'A'
                                ? 'bg-emerald-100 text-emerald-800'
                                : gradeInfo.grade === 'B'
                                ? 'bg-blue-100 text-blue-800'
                                : gradeInfo.grade === 'C'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {gradeInfo.grade}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="text"
                            value={remarkVal}
                            onChange={(e) => updateStudentRemark(student.id, e.target.value)}
                            placeholder={gradeInfo.description}
                            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:bg-white focus:border-indigo-500"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={handleSaveMarks}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Save Marks Matrix
              </button>
            </div>
          </div>
        </>
      ) : (
        /* Rankings & Official Report Cards View */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <span className="font-bold text-xs text-slate-800">
              {selectedClass?.name} Academic Standings ({selectedExam?.name})
            </span>
            <span className="text-xs text-slate-500">
              Ranked by aggregate assessment scores
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-14 text-center">Rank</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-3">Admission ID</th>
                  <th className="py-3 px-3 text-center">Subjects Graded</th>
                  <th className="py-3 px-3 text-center">Aggregate Average</th>
                  <th className="py-3 px-3 text-center">Standing</th>
                  <th className="py-3 px-4 text-right">Academic Report Card</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {studentRankings.map((item, idx) => (
                  <tr key={item.student.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-black text-xs ${
                          idx === 0
                            ? 'bg-amber-100 text-amber-800 ring-2 ring-amber-300'
                            : idx === 1
                            ? 'bg-slate-200 text-slate-700'
                            : idx === 2
                            ? 'bg-amber-50 text-amber-700'
                            : 'text-slate-400 font-mono'
                        }`}
                      >
                        {idx + 1}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.student.avatar}
                          alt={item.student.firstName}
                          className="w-9 h-9 rounded-full object-cover"
                        />
                        <span className="font-bold text-slate-900">
                          {item.student.firstName} {item.student.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600">
                      {item.student.admissionNo}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-700">
                      {item.marksCount} Courses
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="font-black text-sm text-slate-900">
                        {item.averagePercentage}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold ${
                          item.overallGrade.grade === 'A+' || item.overallGrade.grade === 'A'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.overallGrade.grade === 'B'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.overallGrade.grade}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedStudentForReport(item.student)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>Print Report Card</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Add Exam */}
      {isAddExamOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Schedule New Examination</h3>
              <button onClick={() => setIsAddExamOpen(false)} className="p-1.5 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateExam} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Exam Title *</label>
                <input
                  type="text"
                  required
                  value={examForm.name}
                  onChange={(e) => setExamForm({ ...examForm, name: e.target.value })}
                  placeholder="e.g. Term 2 Mid-Term Tests"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Term *</label>
                  <input
                    type="text"
                    required
                    value={examForm.term}
                    onChange={(e) => setExamForm({ ...examForm, term: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Academic Year *</label>
                  <input
                    type="text"
                    required
                    value={examForm.academicYear}
                    onChange={(e) => setExamForm({ ...examForm, academicYear: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={examForm.startDate}
                    onChange={(e) => setExamForm({ ...examForm, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={examForm.endDate}
                    onChange={(e) => setExamForm({ ...examForm, endDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddExamOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold"
                >
                  Schedule Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Report Card Modal */}
      {selectedStudentForReport && selectedExam && (
        <PrintReportCard
          student={selectedStudentForReport}
          schoolClass={classes.find((c) => c.id === selectedStudentForReport.classId)}
          exam={selectedExam}
          marks={examMarks.filter(
            (m) => m.examId === selectedExam.id && m.studentId === selectedStudentForReport.id
          )}
          settings={settings}
          subjectsMap={subjectsMap}
          attendanceSummary={{
            totalDays: 45,
            presentDays: 43,
            percentage: 96,
          }}
          onClose={() => setSelectedStudentForReport(null)}
        />
      )}
    </div>
  );
};
