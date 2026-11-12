import React from 'react';
import { Student, SchoolClass, FeePayment, StudentFee, SchoolSettings } from '../../types';
import { Printer, X, Receipt, CheckCircle, School, ShieldCheck } from 'lucide-react';

interface PrintReceiptProps {
  payment: FeePayment;
  student: Student;
  schoolClass?: SchoolClass;
  feeRecord?: StudentFee;
  settings: SchoolSettings;
  onClose: () => void;
}

export const PrintReceipt: React.FC<PrintReceiptProps> = ({
  payment,
  student,
  schoolClass,
  feeRecord,
  settings,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const remainingBalance = feeRecord ? feeRecord.balance : 0;
  const isFullySettled = remainingBalance === 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex justify-center p-4 sm:p-6 print:p-0 print:bg-white">
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col my-auto border border-slate-200 print:border-none print:shadow-none print:rounded-none">
        {/* Modal Toolbar (hidden when printing) */}
        <div className="no-print flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-600" />
            <span className="font-semibold text-slate-800 text-sm sm:text-base">Official Fee Payment Receipt</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print Receipt
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt */}
        <div className="printable-content p-8 sm:p-10 text-slate-900 bg-white">
          {/* Header */}
          <div className="border-b-2 border-emerald-900/20 pb-5 mb-5 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-xl shadow-md">
                <School className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{settings.name}</h1>
                <p className="text-xs text-slate-500">{settings.address} • {settings.phone}</p>
                <p className="text-xs text-emerald-700 font-medium">Bursar & Treasury Department</p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono font-bold text-xs uppercase tracking-wider rounded-md mb-1">
                {payment.receiptNo}
              </span>
              <p className="text-xs text-slate-500">Date: <strong className="text-slate-800">{payment.date}</strong></p>
            </div>
          </div>

          {/* Student & Payment Meta */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200/80 mb-6 text-xs sm:text-sm">
            <div>
              <span className="text-slate-400 font-semibold uppercase text-[11px] block">Student Details</span>
              <p className="font-bold text-slate-900 text-base">{student.firstName} {student.lastName}</p>
              <p className="text-slate-600">Admission No: <span className="font-mono font-medium text-slate-800">{student.admissionNo}</span></p>
              <p className="text-slate-600">Class: <span className="font-medium text-slate-800">{schoolClass ? schoolClass.name : 'N/A'}</span></p>
            </div>
            <div>
              <span className="text-slate-400 font-semibold uppercase text-[11px] block">Transaction Details</span>
              <p className="text-slate-600">Method: <strong className="text-slate-900">{payment.paymentMethod}</strong></p>
              <p className="text-slate-600">Ref Code: <span className="font-mono text-slate-800">{payment.referenceNo}</span></p>
              <p className="text-slate-600">Cashier: <span className="text-slate-800">{payment.receivedBy}</span></p>
            </div>
          </div>

          {/* Amount Paid Box */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-5 mb-6 text-center">
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block">Amount Paid In Full Or Part</span>
            <span className="text-3xl sm:text-4xl font-black text-emerald-900 tracking-tight">
              {settings.currency}{payment.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            {payment.notes && (
              <p className="text-xs text-emerald-700 italic mt-1 font-medium">"{payment.notes}"</p>
            )}
          </div>

          {/* Account Status Table */}
          {feeRecord && (
            <div className="mb-6 border border-slate-200 rounded-xl overflow-hidden text-xs sm:text-sm">
              <div className="bg-slate-100 px-4 py-2 font-semibold text-slate-700 border-b border-slate-200">
                Term Fee Ledger Statement ({feeRecord.term} - {feeRecord.academicYear})
              </div>
              <div className="divide-y divide-slate-100 p-4 space-y-2">
                <div className="flex justify-between text-slate-600">
                  <span>Total Invoiced Tuition & Levies:</span>
                  <span className="font-medium text-slate-800">{settings.currency}{feeRecord.totalDue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600 pt-2">
                  <span>Total Accumulated Paid to Date:</span>
                  <span className="font-bold text-emerald-700">{settings.currency}{feeRecord.amountPaid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-900 pt-2 font-bold text-sm">
                  <span>Outstanding Balance Remaining:</span>
                  <span className={feeRecord.balance === 0 ? 'text-emerald-700' : 'text-rose-700'}>
                    {feeRecord.balance === 0 ? 'PAID IN FULL ($0.00)' : `${settings.currency}${feeRecord.balance.toLocaleString()}`}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Stamp & Verification */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-200">
            <div className="flex items-center gap-2 text-emerald-700 text-xs font-semibold">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Verified School Treasury Receipt</span>
            </div>

            <div className="text-right">
              <div className="inline-block border-2 border-dashed border-emerald-400 rounded-lg px-4 py-2 text-center bg-emerald-50/50">
                <span className="block text-[10px] font-black uppercase tracking-widest text-emerald-800">
                  {isFullySettled ? 'OFFICIALLY PAID' : 'PARTIAL PAYMENT ACCEPTED'}
                </span>
                <span className="block text-[9px] text-emerald-600">EDUPULSE BURSARY STAMP</span>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-[10px] text-slate-400">
            Thank you for your payment. Please retain this physical or digital receipt for your student financial records.
          </div>
        </div>
      </div>
    </div>
  );
};
