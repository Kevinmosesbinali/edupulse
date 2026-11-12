import React, { useState } from 'react';
import {
  CreditCard,
  Receipt,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Download,
  Plus,
  Eye,
  Printer,
  X,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { FeePayment, Student, StudentFee } from '../../types';
import { PrintReceipt } from '../common/PrintReceipt';

interface FeesManagementProps {
  initialStudentIdForPayment?: string | null;
  onClearInitialStudentId?: () => void;
}

export const FeesManagementModule: React.FC<FeesManagementProps> = ({
  initialStudentIdForPayment,
  onClearInitialStudentId,
}) => {
  const { fees, students, classes, settings, recordPayment, currentUser } = useSchool();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [classFilter, setClassFilter] = useState<string>('all');

  // Modals
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(
    !!initialStudentIdForPayment
  );
  const [selectedStudentForPayment, setSelectedStudentForPayment] = useState<string>(
    initialStudentIdForPayment || students[0]?.id || ''
  );
  const [paymentAmount, setPaymentAmount] = useState<number>(1000);
  const [paymentMethod, setPaymentMethod] = useState<FeePayment['paymentMethod']>('Bank Transfer');
  const [referenceNo, setReferenceNo] = useState<string>(
    `TXN-${Math.floor(Math.random() * 900000) + 100000}`
  );
  const [paymentNotes, setPaymentNotes] = useState<string>('');

  // Receipt Modal State
  const [activeReceiptPayment, setActiveReceiptPayment] = useState<FeePayment | null>(null);
  const [receiptStudent, setReceiptStudent] = useState<Student | null>(null);

  // When initialStudentIdForPayment changes
  React.useEffect(() => {
    if (initialStudentIdForPayment) {
      setSelectedStudentForPayment(initialStudentIdForPayment);
      const studentFee = fees.find((f) => f.studentId === initialStudentIdForPayment);
      if (studentFee && studentFee.balance > 0) {
        setPaymentAmount(studentFee.balance);
      }
      setIsRecordPaymentOpen(true);
    }
  }, [initialStudentIdForPayment, fees]);

  // Handle Record Payment
  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForPayment || paymentAmount <= 0) return;

    const receipt = recordPayment({
      studentId: selectedStudentForPayment,
      amount: Number(paymentAmount),
      paymentMethod,
      referenceNo,
      notes: paymentNotes || 'Term tuition payment',
    });

    setIsRecordPaymentOpen(false);
    if (onClearInitialStudentId) onClearInitialStudentId();

    if (receipt) {
      const student = students.find((s) => s.id === selectedStudentForPayment);
      setReceiptStudent(student || null);
      setActiveReceiptPayment(receipt);
    }
  };

  // Pre-fill full balance
  const handlePayFullBalance = () => {
    const studentFee = fees.find((f) => f.studentId === selectedStudentForPayment);
    if (studentFee) {
      setPaymentAmount(studentFee.balance);
    }
  };

  // Filtered fee records
  const filteredFees = fees.filter((fee) => {
    const student = students.find((s) => s.id === fee.studentId);
    if (!student) return false;

    const matchSearch =
      `${student.firstName} ${student.lastName} ${student.admissionNo} ${student.parentName}`
        .toLowerCase()
        .includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || fee.status === statusFilter;
    const matchClass = classFilter === 'all' || student.classId === classFilter;

    return matchSearch && matchStatus && matchClass;
  });

  // KPI Calculations
  const totalInvoiced = fees.reduce((acc, f) => acc + f.totalDue, 0);
  const totalCollected = fees.reduce((acc, f) => acc + f.amountPaid, 0);
  const totalOutstanding = fees.reduce((acc, f) => acc + f.balance, 0);
  const collectionRate = totalInvoiced > 0 ? Math.round((totalCollected / totalInvoiced) * 100) : 0;
  const overdueCount = fees.filter((f) => f.status === 'overdue' || (f.status === 'partial' && f.balance > 0)).length;

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-600" />
            <span>School Bursary & Fees Management</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track student fee ledgers, process bank receipts, and monitor outstanding tuition balances
          </p>
        </div>

        {currentUser.role !== 'teacher' && (
          <button
            onClick={() => {
              setReferenceNo(`TXN-${Math.floor(Math.random() * 900000) + 100000}`);
              setIsRecordPaymentOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Receipt className="w-4 h-4" />
            <span>+ Record Fee Payment</span>
          </button>
        )}
      </div>

      {/* Financial Health KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Invoiced
          </span>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 block">
            {settings.currency}{totalInvoiced.toLocaleString()}
          </span>
          <span className="text-xs text-slate-500 block mt-1 font-medium">
            Across {fees.length} student accounts
          </span>
        </div>

        <div className="bg-emerald-50/70 rounded-2xl p-5 border border-emerald-100 shadow-xs">
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
            Total Collected
          </span>
          <span className="text-2xl sm:text-3xl font-black text-emerald-900 mt-1 block">
            {settings.currency}{totalCollected.toLocaleString()}
          </span>
          <span className="text-xs text-emerald-700 block mt-1 font-bold">
            {collectionRate}% Overall Collection
          </span>
        </div>

        <div className="bg-rose-50/70 rounded-2xl p-5 border border-rose-100 shadow-xs">
          <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider block">
            Outstanding Arrears
          </span>
          <span className="text-2xl sm:text-3xl font-black text-rose-900 mt-1 block">
            {settings.currency}{totalOutstanding.toLocaleString()}
          </span>
          <span className="text-xs text-rose-700 block mt-1 font-medium">
            Pending collection this term
          </span>
        </div>

        <div className="bg-amber-50/70 rounded-2xl p-5 border border-amber-100 shadow-xs">
          <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
            Overdue / Partial
          </span>
          <span className="text-2xl sm:text-3xl font-black text-amber-900 mt-1 block">
            {overdueCount} Accounts
          </span>
          <span className="text-xs text-amber-800 block mt-1 font-medium">
            Notice reminders active
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name or admission ID..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:bg-white transition-all text-xs"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium text-slate-700 cursor-pointer"
          >
            <option value="all">All Payment Statuses</option>
            <option value="paid">Paid in Full</option>
            <option value="partial">Partial Balance</option>
            <option value="overdue">Overdue</option>
            <option value="unpaid">Unpaid</option>
          </select>

          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium text-slate-700 cursor-pointer"
          >
            <option value="all">All Classes</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Student Fee Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-3">Class</th>
                <th className="py-3 px-3 text-right">Invoiced</th>
                <th className="py-3 px-3 text-right">Paid to Date</th>
                <th className="py-3 px-3 text-right">Balance Due</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFees.map((fee) => {
                const student = students.find((s) => s.id === fee.studentId);
                if (!student) return null;
                const studentClass = classes.find((c) => c.id === student.classId);
                const latestPayment = fee.payments[0];

                return (
                  <tr key={fee.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.avatar}
                          alt={student.firstName}
                          className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900">
                            {student.firstName} {student.lastName}
                          </p>
                          <span className="text-[10px] font-mono text-slate-400">
                            {student.admissionNo}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-800">
                        {studentClass?.name || 'Unassigned'}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right font-medium text-slate-600">
                      {settings.currency}{fee.totalDue.toLocaleString()}
                    </td>

                    <td className="py-3 px-3 text-right font-bold text-emerald-700">
                      {settings.currency}{fee.amountPaid.toLocaleString()}
                    </td>

                    <td className="py-3 px-3 text-right font-bold">
                      <span
                        className={
                          fee.balance === 0
                            ? 'text-slate-400'
                            : fee.status === 'overdue'
                            ? 'text-rose-600 font-extrabold'
                            : 'text-amber-600'
                        }
                      >
                        {settings.currency}{fee.balance.toLocaleString()}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                          fee.status === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : fee.status === 'partial'
                            ? 'bg-amber-100 text-amber-800'
                            : fee.status === 'overdue'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {fee.status === 'paid' ? 'Paid in Full' : fee.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {latestPayment && (
                          <button
                            onClick={() => {
                              setReceiptStudent(student);
                              setActiveReceiptPayment(latestPayment);
                            }}
                            title="Print Latest Receipt"
                            className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        )}

                        {currentUser.role !== 'teacher' && fee.balance > 0 && (
                          <button
                            onClick={() => {
                              setSelectedStudentForPayment(student.id);
                              setPaymentAmount(fee.balance);
                              setReferenceNo(`TXN-${Math.floor(Math.random() * 900000) + 100000}`);
                              setIsRecordPaymentOpen(true);
                            }}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg text-[11px] transition-colors cursor-pointer"
                          >
                            Collect Fee
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Record Fee Payment */}
      {isRecordPaymentOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">Record Tuition Fee Payment</h3>
              </div>
              <button
                onClick={() => {
                  setIsRecordPaymentOpen(false);
                  if (onClearInitialStudentId) onClearInitialStudentId();
                }}
                className="p-1.5 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitPayment} className="p-6 space-y-4 text-xs">
              {/* Select Student */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Select Student *</label>
                <select
                  value={selectedStudentForPayment}
                  onChange={(e) => {
                    setSelectedStudentForPayment(e.target.value);
                    const fee = fees.find((f) => f.studentId === e.target.value);
                    if (fee && fee.balance > 0) setPaymentAmount(fee.balance);
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none text-xs font-semibold"
                >
                  {students.map((s) => {
                    const fee = fees.find((f) => f.studentId === s.id);
                    return (
                      <option key={s.id} value={s.id}>
                        {s.firstName} {s.lastName} ({s.admissionNo}) — Balance: ${fee?.balance ?? 0}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Outstanding Balance Banner */}
              {(() => {
                const curFee = fees.find((f) => f.studentId === selectedStudentForPayment);
                if (!curFee) return null;
                return (
                  <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-emerald-800 uppercase font-bold block">
                        Outstanding Due
                      </span>
                      <span className="text-lg font-black text-emerald-900">
                        {settings.currency}{curFee.balance.toLocaleString()}
                      </span>
                    </div>
                    {curFee.balance > 0 && (
                      <button
                        type="button"
                        onClick={handlePayFullBalance}
                        className="px-2.5 py-1 bg-white border border-emerald-300 text-emerald-800 font-bold rounded-lg text-[11px] shadow-2xs hover:bg-emerald-50"
                      >
                        Set Full Balance
                      </button>
                    )}
                  </div>
                );
              })()}

              {/* Amount */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Payment Amount ({settings.currency}) *</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-black text-slate-900 outline-none focus:bg-white focus:border-emerald-500"
                />
              </div>

              {/* Method & Ref */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Payment Method *</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
                  >
                    <option value="Bank Transfer">Bank Transfer / Wire</option>
                    <option value="Cash">Cash at Bursar Desk</option>
                    <option value="Credit/Debit Card">Credit / Debit Card</option>
                    <option value="Mobile Money">Mobile Money (M-Pesa / etc)</option>
                    <option value="Cheque">Bank Cheque</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Reference / Code *</label>
                  <input
                    type="text"
                    required
                    value={referenceNo}
                    onChange={(e) => setReferenceNo(e.target.value)}
                    placeholder="e.g. TXN-100234"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Payment Memo / Notes</label>
                <input
                  type="text"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  placeholder="e.g. Term 1 Tuition installment 1"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsRecordPaymentOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-sm transition-colors"
                >
                  Issue Receipt & Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {activeReceiptPayment && receiptStudent && (
        <PrintReceipt
          payment={activeReceiptPayment}
          student={receiptStudent}
          schoolClass={classes.find((c) => c.id === receiptStudent.classId)}
          feeRecord={fees.find((f) => f.studentId === receiptStudent.id)}
          settings={settings}
          onClose={() => setActiveReceiptPayment(null)}
        />
      )}
    </div>
  );
};
