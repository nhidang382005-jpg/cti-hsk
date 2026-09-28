import React, { useMemo } from 'react';
import {
  AttendanceRecord,
  CandidateRecord,
  CATALOG_DEFINITIONS,
  CatalogItem,
  CatalogKey,
  EmployeeRecord,
  InterviewScheduleRecord,
  RewardDisciplineRecord,
  RoleDefinition,
  TransferRequestRecord,
  computeEmployeePayroll,
  formatVND
} from '../data/hrData';
import {
  Users,
  CalendarCheck,
  Calculator,
  ArrowRight,
  Code2,
  UserPlus,
  Cake,
  ArrowLeftRight,
  Award
} from 'lucide-react';

export type NavTabType =
  | 'overview'
  | 'recruitment'
  | 'employees'
  | 'transfer_reward'
  | 'catalogs'
  | 'attendance_payroll'
  | 'rbac_mysql';

interface OverviewDashboardViewProps {
  employees: EmployeeRecord[];
  catalogs: Record<CatalogKey, CatalogItem[]>;
  attendance: AttendanceRecord[];
  candidates: CandidateRecord[];
  interviews: InterviewScheduleRecord[];
  transfers: TransferRequestRecord[];
  rewardsDisciplines: RewardDisciplineRecord[];
  activeRole: RoleDefinition;
  onNavigateTab: (tab: NavTabType) => void;
}

export const OverviewDashboardView: React.FC<OverviewDashboardViewProps> = ({
  employees,
  catalogs,
  attendance,
  candidates,
  interviews,
  transfers,
  rewardsDisciplines,
  activeRole,
  onNavigateTab
}) => {
  const payrollSummary = useMemo(() => {
    const rows = employees.map((emp) => {
      const att = attendance.find((a) => a.empId === emp.id);
      return computeEmployeePayroll(emp, att, catalogs, rewardsDisciplines);
    });
    return rows.reduce(
      (acc, r) => {
        acc.gross += r.grossSalary;
        acc.net += r.netSalary;
        acc.overtimeHours += r.overtimeHours;
        acc.paidDays += r.paidWorkDays;
        acc.standardDays += r.standardDays;
        return acc;
      },
      { gross: 0, net: 0, overtimeHours: 0, paidDays: 0, standardDays: 0 }
    );
  }, [employees, attendance, catalogs, rewardsDisciplines]);

  const septemberBirthdays = useMemo(() => {
    return employees.filter((e) => Number(e.birthDate.split('-')[1]) === 9);
  }, [employees]);

  const pendingTransfersCount = useMemo(() => {
    return transfers.filter((t) => t.status === 'Chờ phê duyệt').length;
  }, [transfers]);

  return (
    <div className="space-y-8">
      {/* Hero Banner / Institutional Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-2">
            <span className="font-semibold text-red-700">
              HỆ THỐNG TIẾNG TRUNG & KHẢO THÍ CTI HSK VIỆT NAM
            </span>
            <span aria-hidden="true">·</span>
            <span>Quản trị Nhân sự, Tuyển dụng, Điều chuyển, Thưởng/Phạt & Lương</span>
            <span aria-hidden="true">·</span>
            <span>Quyền: {activeRole.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Hệ thống Quản trị Nhân lực Toàn diện CTI HSK (PHP 8 & MySQL)
          </h1>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Quản lý khép kín vòng đời nhân sự tại Hệ thống Tiếng Trung CTI HSK:{' '}
            <strong className="font-semibold text-slate-900">
              Danh sách ứng viên & Lịch phỏng vấn giảng thử HSK
            </strong>
            ,{' '}
            <strong className="font-semibold text-slate-900">
              Hồ sơ nhân sự 18 Danh mục & Sinh nhật tháng
            </strong>
            ,{' '}
            <strong className="font-semibold text-slate-900">
              Xin chuyển công tác (phòng ban)
            </strong>
            ,{' '}
            <strong className="font-semibold text-slate-900">
              Khen thưởng & Kỷ luật
            </strong>{' '}
            liên thông trực tiếp với{' '}
            <strong className="font-semibold text-slate-900">
              Bảng Chấm công & Tính lương Tự động
            </strong>
            .
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigateTab('recruitment')}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-red-700 rounded-md hover:bg-red-800 transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            Tuyển dụng & Phỏng vấn
          </button>
          <button
            onClick={() => onNavigateTab('rbac_mysql')}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-800 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <Code2 className="w-4 h-4 text-red-700" />
            Xuất CSDL MySQL & Code PHP
          </button>
        </div>
      </div>

      {/* 4 Core KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Nhân sự & Sinh nhật Tháng 09</span>
            <Users className="w-4 h-4 text-red-700" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums mt-2">
            {employees.length} nhân sự
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-red-700 font-medium">
              <Cake className="w-3.5 h-3.5" />
              {septemberBirthdays.length} sinh nhật tháng 09
            </span>
            <button
              onClick={() => onNavigateTab('employees')}
              className="text-red-700 font-semibold hover:underline cursor-pointer"
            >
              Hồ sơ & Sinh nhật →
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Tuyển dụng & Lịch Phỏng vấn HSK</span>
            <UserPlus className="w-4 h-4 text-red-700" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums mt-2">
            {candidates.length} ứng viên
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
            <span className="font-mono">{interviews.length} ca phỏng vấn / giảng thử</span>
            <button
              onClick={() => onNavigateTab('recruitment')}
              className="text-red-700 font-semibold hover:underline cursor-pointer"
            >
              Xem lịch PV →
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Chuyển công tác & Thưởng/Kỷ luật</span>
            <ArrowLeftRight className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums mt-2">
            {transfers.length} đơn · {rewardsDisciplines.length} QĐ
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
            <span>{pendingTransfersCount} đơn chờ phê duyệt</span>
            <button
              onClick={() => onNavigateTab('transfer_reward')}
              className="text-red-700 font-semibold hover:underline cursor-pointer"
            >
              Duyệt ngay →
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Quỹ Lương Thực lĩnh Tự động (Tháng 09)</span>
            <Calculator className="w-4 h-4 text-red-700" />
          </div>
          <div className="text-2xl font-bold font-mono text-red-700 tabular-nums mt-2">
            {formatVND(payrollSummary.net)}
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
            <span className="font-mono">Gross: {formatVND(payrollSummary.gross)}</span>
            <button
              onClick={() => onNavigateTab('attendance_payroll')}
              className="text-red-700 font-semibold hover:underline cursor-pointer"
            >
              Chấm công & Lương →
            </button>
          </div>
        </div>
      </div>

      {/* 3-Column Operational Highlights: Upcoming Interviews, September Birthdays, Transfers & Rewards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Lịch phỏng vấn & Giảng thử sắp tới */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <CalendarCheck className="w-4 h-4 text-red-700" />
                Lịch Phỏng vấn & Giảng thử Demo HSK
              </h3>
              <span className="text-xs font-mono text-slate-500">{interviews.length} lịch</span>
            </div>

            <div className="mt-3 divide-y divide-slate-100">
              {interviews.slice(0, 3).map((iv) => (
                <div key={iv.id} className="py-2.5 text-xs">
                  <div className="flex items-center justify-between font-semibold text-slate-900">
                    <span>{iv.candidateName}</span>
                    <span className="font-mono text-red-700">
                      {iv.interviewDate} · {iv.interviewTime}
                    </span>
                  </div>
                  <div className="text-slate-600 mt-0.5">{iv.roundName}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                    Chủ đề: {iv.demoTopic}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => onNavigateTab('recruitment')}
              className="text-xs font-semibold text-red-700 hover:underline cursor-pointer"
            >
              Quản lý ứng viên & lịch phỏng vấn →
            </button>
          </div>
        </div>

        {/* Card 2: Sinh nhật Nhân sự trong Tháng 09 */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Cake className="w-4 h-4 text-red-700" />
                Sinh nhật Nhân sự Tháng 09
              </h3>
              <span className="text-xs font-mono text-slate-500">
                {septemberBirthdays.length} cán bộ
              </span>
            </div>

            <div className="mt-3 divide-y divide-slate-100">
              {septemberBirthdays.map((emp) => {
                const day = emp.birthDate.split('-')[2];
                return (
                  <div key={emp.id} className="py-2.5 text-xs flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-900">{emp.fullName}</div>
                      <div className="text-slate-500 font-mono text-[11px]">{emp.empCode}</div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-red-700">Ngày {day}/09</span>
                      <div className="text-[11px] text-emerald-700">+500.000 ₫ Quà CĐ</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => onNavigateTab('employees')}
              className="text-xs font-semibold text-red-700 hover:underline cursor-pointer"
            >
              Mở bảng theo dõi sinh nhật →
            </button>
          </div>
        </div>

        {/* Card 3: Điều chuyển Phòng ban & Quyết định Khen thưởng/Kỷ luật */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-red-700" />
                Chuyển Công tác & Khen thưởng - Kỷ luật
              </h3>
              <span className="text-xs font-mono text-slate-500">Liên thông Lương</span>
            </div>

            <div className="mt-3 divide-y divide-slate-100 text-xs">
              {transfers.slice(0, 1).map((trf) => (
                <div key={trf.id} className="py-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">
                      [Chuyển công tác] {trf.empName}
                    </span>
                    <span className="text-amber-700 font-medium">{trf.status}</span>
                  </div>
                  <div className="text-slate-500 mt-0.5 font-mono text-[11px]">
                    {trf.fromUnitCode} → {trf.toUnitCode} (Hiệu lực: {trf.effectiveDate})
                  </div>
                </div>
              ))}

              {rewardsDisciplines.slice(0, 2).map((rd) => (
                <div key={rd.id} className="py-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">{rd.empName}</span>
                    <span
                      className={`font-mono font-bold ${
                        rd.type === 'REWARD' ? 'text-emerald-700' : 'text-red-700'
                      }`}
                    >
                      {rd.type === 'REWARD' ? '+' : '-'}
                      {formatVND(rd.amount)}
                    </span>
                  </div>
                  <div className="text-slate-500 mt-0.5 truncate">{rd.categoryTitle}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => onNavigateTab('transfer_reward')}
              className="text-xs font-semibold text-red-700 hover:underline cursor-pointer"
            >
              Xử lý điều chuyển & khen thưởng →
            </button>
          </div>
        </div>
      </div>

      {/* Directory of all 18 Catalogs on Overview */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Cấu trúc 18 Danh mục Nhân sự Chuẩn của Hệ thống CTI HSK
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Đầy đủ 18 danh mục con theo đúng yêu cầu nghiệp vụ, được ánh xạ thành 18 bảng cơ sở dữ liệu quan hệ trong MySQL.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('catalogs')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-700 hover:text-red-800 cursor-pointer"
          >
            Chỉnh sửa dữ liệu 18 Danh mục
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 sm:gap-px bg-slate-200">
          {CATALOG_DEFINITIONS.map((def) => {
            const items = catalogs[def.key] || [];
            return (
              <div
                key={def.key}
                onClick={() => onNavigateTab('catalogs')}
                className="bg-white p-4 hover:bg-slate-50/90 transition-colors cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-red-700 tabular-nums">
                      #{String(def.index).padStart(2, '0')} · {def.mysqlTable}
                    </span>
                    <span className="font-mono text-xs text-slate-500 tabular-nums">
                      {items.length} mục
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">{def.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{def.description}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-600 truncate">
                  <span className="text-slate-400">Tiêu biểu: </span>
                  {items
                    .slice(0, 2)
                    .map((i) => i.name)
                    .join(' · ')}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
