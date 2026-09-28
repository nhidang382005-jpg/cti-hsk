import React, { useState, useMemo } from 'react';
import {
  AttendanceRecord,
  AttendanceStatusCode,
  CalculatedPayroll,
  CatalogItem,
  CatalogKey,
  EmployeeRecord,
  RewardDisciplineRecord,
  computeEmployeePayroll,
  formatVND
} from '../data/hrData';
import {
  CalendarCheck,
  Calculator,
  Download,
  Clock,
  FileSpreadsheet,
  CheckCircle2,
  Printer,
  RefreshCw
} from 'lucide-react';

interface AttendancePayrollViewProps {
  employees: EmployeeRecord[];
  attendance: AttendanceRecord[];
  catalogs: Record<CatalogKey, CatalogItem[]>;
  rewardsDisciplines: RewardDisciplineRecord[];
  canEditAttendance: boolean;
  canApprovePayroll: boolean;
  onUpdateAttendance: (updated: AttendanceRecord) => void;
  onToggleLockAllAttendance: (locked: boolean) => void;
}

const STATUS_CYCLE: AttendanceStatusCode[] = ['X', 'TC', 'P', 'M', 'N'];

export const AttendancePayrollView: React.FC<AttendancePayrollViewProps> = ({
  employees,
  attendance,
  catalogs,
  rewardsDisciplines,
  canEditAttendance,
  canApprovePayroll,
  onUpdateAttendance,
  onToggleLockAllAttendance
}) => {
  const [subTab, setSubTab] = useState<'both' | 'attendance' | 'payroll'>('both');
  const [selectedMonth, setSelectedMonth] = useState('2026-09');
  const [selectedPayslip, setSelectedPayslip] = useState<CalculatedPayroll | null>(null);
  const [checkInEmpId, setCheckInEmpId] = useState<string>(employees[0]?.id || '');
  const [statusMessage, setStatusMessage] = useState<string>('');

  const payrollRows: CalculatedPayroll[] = useMemo(() => {
    return employees.map((emp) => {
      const att = attendance.find((a) => a.empId === emp.id);
      return computeEmployeePayroll(emp, att, catalogs, rewardsDisciplines);
    });
  }, [employees, attendance, catalogs, rewardsDisciplines]);

  const totals = useMemo(() => {
    return payrollRows.reduce(
      (acc, r) => {
        acc.gross += r.grossSalary;
        acc.allowances += r.positionAllowance + r.hskAllowance;
        acc.overtimeAndRewards += r.overtimePay + r.rewardBonus;
        acc.deductions += r.totalDeductions;
        acc.net += r.netSalary;
        return acc;
      },
      { gross: 0, allowances: 0, overtimeAndRewards: 0, deductions: 0, net: 0 }
    );
  }, [payrollRows]);

  const isAnyLocked = useMemo(() => attendance.some((a) => a.isLocked), [attendance]);

  const handleCycleDayStatus = (att: AttendanceRecord, dayNumber: number) => {
    if (!canEditAttendance || att.isLocked) return;
    const current = att.recentDays[dayNumber] || 'X';
    const nextIdx = (STATUS_CYCLE.indexOf(current) + 1) % STATUS_CYCLE.length;
    const nextCode = STATUS_CYCLE[nextIdx];

    const updatedRecent = { ...att.recentDays, [dayNumber]: nextCode };

    let presentDays = att.presentDays;
    let paidLeaveDays = att.paidLeaveDays;
    let unpaidLeaveDays = att.unpaidLeaveDays;
    let lateCount = att.lateCount;
    let overtimeHours = att.overtimeHours;

    if (nextCode === 'P') {
      presentDays = Math.max(0, presentDays - 1);
      paidLeaveDays = Math.min(26, paidLeaveDays + 1);
    } else if (nextCode === 'N') {
      paidLeaveDays = Math.max(0, paidLeaveDays - 1);
      unpaidLeaveDays += 1;
    } else if (nextCode === 'M') {
      unpaidLeaveDays = Math.max(0, unpaidLeaveDays - 1);
      presentDays = Math.min(26, presentDays + 1);
      lateCount += 1;
    } else if (nextCode === 'TC') {
      overtimeHours += 4;
    } else if (nextCode === 'X') {
      lateCount = Math.max(0, lateCount - 1);
    }

    onUpdateAttendance({
      ...att,
      presentDays,
      paidLeaveDays,
      unpaidLeaveDays,
      lateCount,
      overtimeHours,
      recentDays: updatedRecent
    });
  };

  const handleQuickCheckIn = () => {
    const att = attendance.find((a) => a.empId === checkInEmpId);
    const emp = employees.find((e) => e.id === checkInEmpId);
    if (!att || !emp) return;

    const nowStr = new Date().toTimeString().slice(0, 5);
    onUpdateAttendance({
      ...att,
      todayCheckIn: nowStr,
      presentDays: Math.min(att.standardDays, att.presentDays + 1)
    });
    setStatusMessage(
      `Đã ghi nhận Check-in lúc ${nowStr} cho ${emp.fullName} (${emp.empCode}). Bảng lương đã tự động đồng bộ.`
    );
  };

  const handleExportCSV = () => {
    const headers = [
      'Ma_NV',
      'Ho_Va_Ten',
      'Don_Vi_Quan_Ly',
      'Chuc_Vu',
      'Trinh_Do_HSK',
      'Cong_Huong_Luong',
      'Gio_Tang_Ca_HSK',
      'Luong_Ngay_Cong',
      'Phu_Cap_Chuc_Vu',
      'Phu_Cap_HSK',
      'Luong_Tang_Ca',
      'Thuong_KPI',
      'Khen_Thuong_QD',
      'Tong_Thu_Nhap_Gross',
      'Khau_Tru_BHXH_10.5%',
      'Thue_TNCN',
      'Phat_Di_Muon_Va_Ky_Luat',
      'Thuc_Linh_Net'
    ];

    const rows = payrollRows.map((r) => [
      r.empCode,
      `"${r.fullName}"`,
      `"${r.unitName}"`,
      `"${r.positionName}"`,
      `"${r.hskLevelName}"`,
      r.paidWorkDays,
      r.overtimeHours,
      r.proratedBaseSalary,
      r.positionAllowance,
      r.hskAllowance,
      r.overtimePay,
      r.kpiBonus,
      r.rewardBonus,
      r.grossSalary,
      r.insuranceDeduction,
      r.personalIncomeTax,
      r.latePenalty + r.disciplinePenalty,
      r.netSalary
    ]);

    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Bang_Luong_Tu_Dong_CTI_HSK_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Kỳ hạch toán: Tháng {selectedMonth}</span>
            <span aria-hidden="true">·</span>
            <span>Công chuẩn: 26 ngày</span>
            <span aria-hidden="true">·</span>
            <span>Tích hợp Phụ cấp 18 Danh mục & Khen thưởng / Kỷ luật</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Bảng Chấm công & Báo cáo Tính lương Tự động CTI HSK
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
            {[
              { id: 'both', label: 'Chấm công + Lương Tự động' },
              { id: 'attendance', label: 'Bảng Chấm công' },
              { id: 'payroll', label: 'Báo cáo Lương' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setSubTab(t.id as 'both' | 'attendance' | 'payroll')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  subTab === t.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded-md"
          />

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-red-700 rounded-md hover:bg-red-800 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Xuất Bảng lương CSV
          </button>
        </div>
      </div>

      {/* Summary Financial Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="text-xs text-slate-500">Tổng Quỹ Lương Gross</div>
          <div className="text-lg font-bold font-mono text-slate-900 tabular-nums mt-1">
            {formatVND(totals.gross)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {employees.length} nhân sự trong kỳ {selectedMonth}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="text-xs text-slate-500">Tổng Phụ cấp Danh mục (#05 + #15)</div>
          <div className="text-lg font-bold font-mono text-emerald-700 tabular-nums mt-1">
            +{formatVND(totals.allowances)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Tự động từ Chức vụ & Trình độ HSK
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="text-xs text-slate-500">Tăng ca HSK & Quyết định Khen thưởng</div>
          <div className="text-lg font-bold font-mono text-emerald-700 tabular-nums mt-1">
            +{formatVND(totals.overtimeAndRewards)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Cộng tự động từ Chấm công & QĐKT
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="text-xs text-slate-500">Khấu trừ BHXH, Thuế & Kỷ luật</div>
          <div className="text-lg font-bold font-mono text-amber-700 tabular-nums mt-1">
            -{formatVND(totals.deductions)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            BHXH 10.5% + TNCN + Kỷ luật
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="text-xs text-slate-500">Tổng Thực Lĩnh (Net Pay)</div>
          <div className="text-lg font-bold font-mono text-red-700 tabular-nums mt-1">
            {formatVND(totals.net)}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">
            Tự động cập nhật tức thời
          </div>
        </div>
      </div>

      {/* Quick Timekeeping Simulator Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
            <Clock className="w-4 h-4 text-red-700" />
            <span>Trạm Chấm công Nhanh (Check-in Ca làm việc / Coi thi HSK):</span>
          </div>
          <select
            value={checkInEmpId}
            onChange={(e) => setCheckInEmpId(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md"
          >
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.empCode} — {e.fullName}
              </option>
            ))}
          </select>
          <button
            onClick={handleQuickCheckIn}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Ghi nhận Check-in Hôm nay (+1 Công)
          </button>
        </div>

        <div className="flex items-center gap-3">
          {canApprovePayroll && (
            <button
              onClick={() => {
                onToggleLockAllAttendance(!isAnyLocked);
                setStatusMessage(
                  !isAnyLocked
                    ? 'Đã chốt khóa bảng chấm công tháng. Số liệu lương đã sẵn sàng giải ngân.'
                    : 'Đã mở khóa bảng chấm công để điều chỉnh dữ liệu.'
                );
              }}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                isAnyLocked
                  ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                  : 'bg-emerald-700 text-white hover:bg-emerald-800'
              }`}
            >
              {isAnyLocked ? 'Mở khóa Bảng công' : 'Chốt Bảng công & Duyệt Lương'}
            </button>
          )}
        </div>
      </div>

      {statusMessage && (
        <div className="px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-900">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{statusMessage}</span>
          </div>
          <button
            onClick={() => setStatusMessage('')}
            className="font-semibold underline hover:text-emerald-950"
          >
            Ẩn
          </button>
        </div>
      )}

      {/* SECTION 1: BẢNG CHẤM CÔNG THÁNG */}
      {(subTab === 'both' || subTab === 'attendance') && (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-red-700" />
                Bảng Chấm công Chi tiết & Giờ Coi thi HSK (Tháng {selectedMonth})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Nhấp trực tiếp vào từng ô ngày (1–10) hoặc chỉnh số công/giờ tăng ca để thấy Bảng lương bên dưới tự động tính lại tức thời. Ký hiệu:{' '}
                <span className="font-mono font-semibold text-emerald-700">X</span> Đi làm ·{' '}
                <span className="font-mono font-semibold text-blue-700">TC</span> Tăng ca/Coi thi HSK ·{' '}
                <span className="font-mono font-semibold text-amber-700">P</span> Nghỉ phép ·{' '}
                <span className="font-mono font-semibold text-orange-700">M</span> Đi muộn ·{' '}
                <span className="font-mono font-semibold text-red-700">N</span> Không lương
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-600">
                  <th className="py-3 px-4 w-28">Mã NV</th>
                  <th className="py-3 px-4">Nhân sự · Giờ vào/ra hôm nay</th>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((d) => (
                    <th key={d} className="py-3 px-1.5 text-center font-mono w-9">
                      {String(d).padStart(2, '0')}
                    </th>
                  ))}
                  <th className="py-3 px-3 text-right w-28">Ngày đi làm</th>
                  <th className="py-3 px-3 text-right w-24">Nghỉ phép</th>
                  <th className="py-3 px-3 text-right w-24">Đi muộn</th>
                  <th className="py-3 px-3 text-right w-32">Giờ TC / Coi thi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {employees.map((emp) => {
                  const att = attendance.find((a) => a.empId === emp.id) || {
                    empId: emp.id,
                    month: selectedMonth,
                    standardDays: 26,
                    presentDays: 26,
                    paidLeaveDays: 0,
                    unpaidLeaveDays: 0,
                    lateCount: 0,
                    overtimeHours: 0,
                    recentDays: {},
                    isLocked: false
                  };

                  return (
                    <tr key={emp.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4 font-mono font-semibold text-slate-900 tabular-nums">
                        {emp.empCode}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{emp.fullName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          In: {att.todayCheckIn || '08:00'} · Out: {att.todayCheckOut || '17:30'}
                        </div>
                      </td>

                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((dayNum) => {
                        const code = att.recentDays[dayNum] || 'X';
                        const colorClass =
                          code === 'X'
                            ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                            : code === 'TC'
                            ? 'text-blue-700 bg-blue-50 border-blue-200'
                            : code === 'P'
                            ? 'text-amber-700 bg-amber-50 border-amber-200'
                            : code === 'M'
                            ? 'text-orange-700 bg-orange-50 border-orange-200'
                            : 'text-red-700 bg-red-50 border-red-200';

                        return (
                          <td key={dayNum} className="py-2 px-1 text-center">
                            <button
                              type="button"
                              disabled={!canEditAttendance || att.isLocked}
                              onClick={() => handleCycleDayStatus(att, dayNum)}
                              className={`w-7 h-7 font-mono text-[11px] font-bold border rounded-sm transition-colors cursor-pointer disabled:cursor-not-allowed ${colorClass}`}
                              title="Nhấn để đổi trạng thái chấm công"
                            >
                              {code}
                            </button>
                          </td>
                        );
                      })}

                      <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                        <input
                          type="number"
                          min={0}
                          max={26}
                          disabled={!canEditAttendance || att.isLocked}
                          value={att.presentDays}
                          onChange={(e) =>
                            onUpdateAttendance({
                              ...att,
                              presentDays: Math.min(26, Math.max(0, Number(e.target.value)))
                            })
                          }
                          className="w-16 px-2 py-1 text-right font-mono border border-slate-300 rounded-sm bg-white disabled:bg-slate-100"
                        />
                        <span className="text-slate-400 ml-1">/26</span>
                      </td>

                      <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                        <input
                          type="number"
                          min={0}
                          max={12}
                          disabled={!canEditAttendance || att.isLocked}
                          value={att.paidLeaveDays}
                          onChange={(e) =>
                            onUpdateAttendance({
                              ...att,
                              paidLeaveDays: Math.max(0, Number(e.target.value))
                            })
                          }
                          className="w-14 px-2 py-1 text-right font-mono border border-slate-300 rounded-sm bg-white disabled:bg-slate-100"
                        />
                      </td>

                      <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                        <input
                          type="number"
                          min={0}
                          max={26}
                          disabled={!canEditAttendance || att.isLocked}
                          value={att.lateCount}
                          onChange={(e) =>
                            onUpdateAttendance({
                              ...att,
                              lateCount: Math.max(0, Number(e.target.value))
                            })
                          }
                          className="w-14 px-2 py-1 text-right font-mono border border-slate-300 rounded-sm bg-white disabled:bg-slate-100"
                        />
                      </td>

                      <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          disabled={!canEditAttendance || att.isLocked}
                          value={att.overtimeHours}
                          onChange={(e) =>
                            onUpdateAttendance({
                              ...att,
                              overtimeHours: Math.max(0, Number(e.target.value))
                            })
                          }
                          className="w-16 px-2 py-1 text-right font-mono border border-slate-300 rounded-sm bg-white disabled:bg-slate-100"
                        />
                        <span className="text-slate-400 ml-1">giờ</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 2: BẢNG TÍNH LƯƠNG TỰ ĐỘNG */}
      {(subTab === 'both' || subTab === 'payroll') && (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-red-700" />
                Bảng Tổng hợp & Tính lương Tự động (Tháng {selectedMonth})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Công thức tự động: Lương ngày công + Phụ cấp Chức vụ (#05) + Phụ cấp HSK (#15) + Tăng ca coi thi (150%) + KPI + Khen thưởng - BHXH (10.5%) - Kỷ luật - Thuế TNCN.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-700 font-medium">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Tự động đồng bộ thời gian thực</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-600">
                  <th className="py-3 px-3">Nhân sự · Đơn vị</th>
                  <th className="py-3 px-3 text-right">Công hưởng</th>
                  <th className="py-3 px-3 text-right">Lương ngày công</th>
                  <th className="py-3 px-3 text-right">PC Chức vụ + HSK</th>
                  <th className="py-3 px-3 text-right">Tăng ca + KPI</th>
                  <th className="py-3 px-3 text-right">Khen thưởng / Kỷ luật</th>
                  <th className="py-3 px-3 text-right">Tổng Gross</th>
                  <th className="py-3 px-3 text-right">Tổng Khấu trừ</th>
                  <th className="py-3 px-3 text-right">Thực lĩnh (Net)</th>
                  <th className="py-3 px-3 text-right">Phiếu lương</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs font-mono tabular-nums">
                {payrollRows.map((row) => (
                  <tr key={row.empId} className="hover:bg-slate-50/90 transition-colors">
                    <td className="py-3 px-3 font-sans">
                      <div className="font-semibold text-slate-900">{row.fullName}</div>
                      <div className="text-[11px] text-slate-500">
                        <span className="font-mono text-red-700 font-medium">{row.empCode}</span> ·{' '}
                        {row.positionName}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="font-semibold text-slate-900">{row.paidWorkDays}</span>
                      <span className="text-slate-400">/{row.standardDays}</span>
                      {row.overtimeHours > 0 && (
                        <div className="text-[11px] text-blue-700">+{row.overtimeHours}h TC</div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-800">
                      {formatVND(row.proratedBaseSalary)}
                    </td>
                    <td className="py-3 px-3 text-right text-emerald-700">
                      +{formatVND(row.positionAllowance + row.hskAllowance)}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-800">
                      +{formatVND(row.overtimePay + row.kpiBonus)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      {row.rewardBonus > 0 && (
                        <div className="text-emerald-700 font-semibold">
                          +{formatVND(row.rewardBonus)}
                        </div>
                      )}
                      {row.disciplinePenalty > 0 && (
                        <div className="text-red-700 font-semibold">
                          -{formatVND(row.disciplinePenalty)}
                        </div>
                      )}
                      {row.rewardBonus === 0 && row.disciplinePenalty === 0 && (
                        <span className="text-slate-400">0 ₫</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right font-semibold text-slate-900">
                      {formatVND(row.grossSalary)}
                    </td>
                    <td className="py-3 px-3 text-right text-amber-700">
                      -{formatVND(row.totalDeductions)}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-red-700 text-sm">
                      {formatVND(row.netSalary)}
                    </td>
                    <td className="py-3 px-3 text-right font-sans">
                      <button
                        onClick={() => setSelectedPayslip(row)}
                        className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md inline-flex items-center gap-1 cursor-pointer"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                        Phiếu lương
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Phiếu Lương Chi Tiết */}
      {selectedPayslip && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-lg max-w-xl w-full p-6 shadow-xl">
            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
              <div>
                <div className="text-xs text-slate-500 font-mono">
                  HỆ THỐNG TRUNG TÂM ĐÀO TẠO & KHẢO THÍ CTI HSK VIỆT NAM
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  Phiếu Lương Điện Tử Kỳ {selectedMonth}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPayslip(null)}
                className="text-xs font-medium text-slate-500 hover:text-slate-900"
              >
                Đóng
              </button>
            </div>

            <div className="py-3 border-b border-slate-200 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Họ và tên nhân sự:</span>
                <span className="font-semibold text-slate-900">
                  {selectedPayslip.fullName} ({selectedPayslip.empCode})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Đơn vị quản lý (Danh mục #01):</span>
                <span className="text-slate-800">{selectedPayslip.unitName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Chức danh, chức vụ (Danh mục #05):</span>
                <span className="text-slate-800">{selectedPayslip.positionName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Trình độ ngoại ngữ (Danh mục #15):</span>
                <span className="text-red-700 font-medium">{selectedPayslip.hskLevelName}</span>
              </div>
            </div>

            <div className="py-4 space-y-2 text-xs font-mono tabular-nums">
              <div className="flex justify-between">
                <span className="font-sans text-slate-600">
                  1. Lương cơ bản theo công ({selectedPayslip.paidWorkDays}/{selectedPayslip.standardDays} ngày):
                </span>
                <span className="font-semibold text-slate-900">
                  {formatVND(selectedPayslip.proratedBaseSalary)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-sans text-slate-600">
                  2. Phụ cấp Chức danh, chức vụ (Tự động từ DM #05):
                </span>
                <span className="text-emerald-700">
                  +{formatVND(selectedPayslip.positionAllowance)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-sans text-slate-600">
                  3. Phụ cấp Trình độ HSK/Ngoại ngữ (Tự động từ DM #15):
                </span>
                <span className="text-emerald-700">
                  +{formatVND(selectedPayslip.hskAllowance)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-sans text-slate-600">
                  4. Lương Tăng ca & Giám thị coi thi HSK ({selectedPayslip.overtimeHours} giờ x 150%):
                </span>
                <span className="text-emerald-700">
                  +{formatVND(selectedPayslip.overtimePay)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-sans text-slate-600">
                  5. Thưởng KPI Giảng dạy & Tuyển sinh:
                </span>
                <span className="text-emerald-700">
                  +{formatVND(selectedPayslip.kpiBonus)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-sans text-slate-600">
                  6. Quyết định Khen thưởng & Phúc lợi Sinh nhật:
                </span>
                <span className="text-emerald-700 font-semibold">
                  +{formatVND(selectedPayslip.rewardBonus)}
                </span>
              </div>

              <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-slate-900">
                <span className="font-sans">TỔNG THU NHẬP (GROSS):</span>
                <span>{formatVND(selectedPayslip.grossSalary)}</span>
              </div>

              <div className="flex justify-between text-amber-800 pt-1">
                <span className="font-sans">
                  7. Khấu trừ BHXH (8%) + BHYT (1.5%) + BHTN (1%):
                </span>
                <span>-{formatVND(selectedPayslip.insuranceDeduction)}</span>
              </div>
              <div className="flex justify-between text-amber-800">
                <span className="font-sans">8. Thuế Thu nhập Cá nhân (TNCN lũy tiến):</span>
                <span>-{formatVND(selectedPayslip.personalIncomeTax)}</span>
              </div>
              <div className="flex justify-between text-amber-800">
                <span className="font-sans">9. Khấu trừ đi muộn & Quyết định Kỷ luật:</span>
                <span>
                  -{formatVND(selectedPayslip.latePenalty + selectedPayslip.disciplinePenalty)}
                </span>
              </div>

              <div className="flex justify-between pt-3 border-t border-slate-300 text-base font-bold text-red-700">
                <span className="font-sans">THỰC LĨNH CHUYỂN KHOẢN (NET):</span>
                <span>{formatVND(selectedPayslip.netSalary)}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                In Phiếu Lương
              </button>
              <button
                onClick={() => setSelectedPayslip(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-700 rounded-md hover:bg-red-800 cursor-pointer"
              >
                Hoàn tất
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
