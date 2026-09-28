import React, { useState, useEffect, useMemo } from 'react';
import {
  AttendanceRecord,
  CandidateRecord,
  CATALOG_DEFINITIONS,
  CatalogItem,
  CatalogKey,
  EmployeeRecord,
  INITIAL_ATTENDANCE,
  INITIAL_CANDIDATES,
  INITIAL_CATALOGS,
  INITIAL_EMPLOYEES,
  INITIAL_INTERVIEWS,
  INITIAL_REWARDS_DISCIPLINES,
  INITIAL_ROLES,
  INITIAL_TRANSFERS,
  InterviewScheduleRecord,
  RewardDisciplineRecord,
  RoleDefinition,
  RoleId,
  TransferRequestRecord
} from './data/hrData';
import { OverviewDashboardView, NavTabType } from './components/OverviewDashboardView';
import { RecruitmentManagerView } from './components/RecruitmentManagerView';
import { EmployeeManagerView } from './components/EmployeeManagerView';
import { TransferAndRewardView } from './components/TransferAndRewardView';
import { CatalogManagerView } from './components/CatalogManagerView';
import { AttendancePayrollView } from './components/AttendancePayrollView';
import { RbacAndPhpMysqlView } from './components/RbacAndPhpMysqlView';
import { generateMySQLSchemaAndSeed } from './utils/phpMysqlGenerator';
import { Download, RotateCcw } from 'lucide-react';

const STORAGE_KEYS = {
  CATALOGS: 'cti_hsk_catalogs_v2',
  EMPLOYEES: 'cti_hsk_employees_v2',
  ATTENDANCE: 'cti_hsk_attendance_v2',
  ROLES: 'cti_hsk_roles_v2',
  CANDIDATES: 'cti_hsk_candidates_v2',
  INTERVIEWS: 'cti_hsk_interviews_v2',
  TRANSFERS: 'cti_hsk_transfers_v2',
  REWARDS: 'cti_hsk_rewards_v2'
};

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTabType>('overview');
  const [activeRoleId, setActiveRoleId] = useState<RoleId>('SUPER_ADMIN');

  const [catalogs, setCatalogs] = useState<Record<CatalogKey, CatalogItem[]>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATALOGS);
      return saved ? JSON.parse(saved) : INITIAL_CATALOGS;
    } catch {
      return INITIAL_CATALOGS;
    }
  });

  const [employees, setEmployees] = useState<EmployeeRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
      return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
    } catch {
      return INITIAL_EMPLOYEES;
    }
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
      return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
    } catch {
      return INITIAL_ATTENDANCE;
    }
  });

  const [roles, setRoles] = useState<RoleDefinition[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ROLES);
      return saved ? JSON.parse(saved) : INITIAL_ROLES;
    } catch {
      return INITIAL_ROLES;
    }
  });

  const [candidates, setCandidates] = useState<CandidateRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CANDIDATES);
      return saved ? JSON.parse(saved) : INITIAL_CANDIDATES;
    } catch {
      return INITIAL_CANDIDATES;
    }
  });

  const [interviews, setInterviews] = useState<InterviewScheduleRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INTERVIEWS);
      return saved ? JSON.parse(saved) : INITIAL_INTERVIEWS;
    } catch {
      return INITIAL_INTERVIEWS;
    }
  });

  const [transfers, setTransfers] = useState<TransferRequestRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRANSFERS);
      return saved ? JSON.parse(saved) : INITIAL_TRANSFERS;
    } catch {
      return INITIAL_TRANSFERS;
    }
  });

  const [rewardsDisciplines, setRewardsDisciplines] = useState<RewardDisciplineRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REWARDS);
      return saved ? JSON.parse(saved) : INITIAL_REWARDS_DISCIPLINES;
    } catch {
      return INITIAL_REWARDS_DISCIPLINES;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CATALOGS, JSON.stringify(catalogs));
      localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
      localStorage.setItem(STORAGE_KEYS.ROLES, JSON.stringify(roles));
      localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(candidates));
      localStorage.setItem(STORAGE_KEYS.INTERVIEWS, JSON.stringify(interviews));
      localStorage.setItem(STORAGE_KEYS.TRANSFERS, JSON.stringify(transfers));
      localStorage.setItem(STORAGE_KEYS.REWARDS, JSON.stringify(rewardsDisciplines));
    } catch {
      // ignore storage errors
    }
  }, [
    catalogs,
    employees,
    attendance,
    roles,
    candidates,
    interviews,
    transfers,
    rewardsDisciplines
  ]);

  const activeRole = useMemo(
    () => roles.find((r) => r.id === activeRoleId) || roles[0],
    [roles, activeRoleId]
  );

  const checkPerm = (
    moduleKey: string,
    action: 'view' | 'create' | 'edit' | 'delete' | 'approve'
  ): boolean => {
    const p = activeRole.permissions.find((m) => m.module === moduleKey);
    return p ? Boolean(p[action]) : false;
  };

  // Catalog CRUD handlers
  const handleSaveCatalogItem = (key: CatalogKey, item: CatalogItem, isNew: boolean) => {
    setCatalogs((prev) => {
      const list = prev[key] || [];
      const updated = isNew
        ? [...list, item]
        : list.map((existing) => (existing.id === item.id ? item : existing));
      return { ...prev, [key]: updated };
    });
  };

  const handleDeleteCatalogItem = (key: CatalogKey, itemId: string) => {
    setCatalogs((prev) => ({
      ...prev,
      [key]: (prev[key] || []).filter((i) => i.id !== itemId)
    }));
  };

  // Employee CRUD handlers
  const handleSaveEmployee = (emp: EmployeeRecord, isNew: boolean) => {
    if (isNew) {
      setEmployees((prev) => [...prev, emp]);
      setAttendance((prev) => [
        ...prev,
        {
          empId: emp.id,
          month: '2026-09',
          standardDays: 26,
          presentDays: 26,
          paidLeaveDays: 0,
          unpaidLeaveDays: 0,
          lateCount: 0,
          overtimeHours: 0,
          todayCheckIn: '08:00',
          todayCheckOut: '17:30',
          recentDays: {
            1: 'X',
            2: 'X',
            3: 'X',
            4: 'X',
            5: 'X',
            6: 'X',
            7: 'X',
            8: 'X',
            9: 'X',
            10: 'X'
          },
          isLocked: false
        }
      ]);
    } else {
      setEmployees((prev) => prev.map((existing) => (existing.id === emp.id ? emp : existing)));
    }
  };

  const handleDeleteEmployee = (empId: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== empId));
    setAttendance((prev) => prev.filter((a) => a.empId !== empId));
  };

  const handleApproveBirthdayGift = (emp: EmployeeRecord) => {
    const newRD: RewardDisciplineRecord = {
      id: `rd-bday-${Date.now()}`,
      decisionCode: `QĐPL-SN-${emp.empCode}`,
      empId: emp.id,
      empCode: emp.empCode,
      empName: emp.fullName,
      type: 'REWARD',
      categoryTitle: 'Phúc lợi Quà Chúc mừng Sinh nhật Cán bộ Công đoàn CTI HSK',
      reason: `Chúc mừng sinh nhật cán bộ ${emp.fullName} (${emp.birthDate}) theo quy chế Công đoàn.`,
      amount: 500000,
      appliedMonth: '2026-09',
      decisionDate: new Date().toISOString().slice(0, 10),
      signedBy: 'BCH Công đoàn CTI HSK',
      status: 'Đã duyệt áp dụng Lương'
    };
    setRewardsDisciplines((prev) => [newRD, ...prev]);
  };

  // Recruitment & Interview handlers
  const handleSaveCandidate = (cand: CandidateRecord, isNew: boolean) => {
    if (isNew) {
      setCandidates((prev) => [cand, ...prev]);
    } else {
      setCandidates((prev) => prev.map((c) => (c.id === cand.id ? cand : c)));
    }
  };

  const handleDeleteCandidate = (candId: string) => {
    setCandidates((prev) => prev.filter((c) => c.id !== candId));
    setInterviews((prev) => prev.filter((iv) => iv.candidateId !== candId));
  };

  const handleOnboardCandidate = (cand: CandidateRecord) => {
    // 1. Mark candidate as onboarded
    setCandidates((prev) =>
      prev.map((c) => (c.id === cand.id ? { ...c, stage: 'Đã tiếp nhận Nhân sự' } : c))
    );

    // 2. Build 18-catalog mapping from candidate attributes
    const defaultCatalogs = {} as Record<CatalogKey, string>;
    for (const def of CATALOG_DEFINITIONS) {
      defaultCatalogs[def.key] = catalogs[def.key]?.[0]?.code || '';
    }
    defaultCatalogs.don_vi_quan_ly = cand.appliedUnitCode;
    defaultCatalogs.chuc_danh_chuc_vu = cand.appliedPositionCode;
    defaultCatalogs.trinh_do_ngoai_ngu = cand.hskQualificationCode;
    defaultCatalogs.trinh_do_chuyen_mon = cand.educationLevelCode;
    defaultCatalogs.truong_dao_tao = cand.universityCode;

    const newEmp: EmployeeRecord = {
      id: `emp-onboard-${Date.now()}`,
      empCode: `CTI-HSK-00${employees.length + 1}`,
      fullName: cand.fullName,
      gender: cand.gender,
      birthDate: cand.birthDate,
      email: cand.email,
      phone: cand.phone,
      joinDate: new Date().toISOString().slice(0, 10),
      contractType: 'Hợp đồng 12 tháng',
      roleId: 'STAFF',
      baseSalary: cand.expectedSalary,
      salaryCoefficient: 1.3,
      kpiBonus: 2000000,
      dependentsCount: 0,
      status: 'Đang công tác',
      catalogs: defaultCatalogs
    };

    handleSaveEmployee(newEmp, true);
  };

  const handleSaveInterview = (iv: InterviewScheduleRecord, isNew: boolean) => {
    if (isNew) {
      setInterviews((prev) => [iv, ...prev]);
    } else {
      setInterviews((prev) => prev.map((x) => (x.id === iv.id ? iv : x)));
    }
  };

  const handleDeleteInterview = (ivId: string) => {
    setInterviews((prev) => prev.filter((x) => x.id !== ivId));
  };

  // Department Transfer & Reward/Discipline handlers
  const handleCreateTransfer = (trf: TransferRequestRecord) => {
    setTransfers((prev) => [trf, ...prev]);
  };

  const handleApproveTransfer = (transferId: string) => {
    const target = transfers.find((t) => t.id === transferId);
    if (!target) return;

    setTransfers((prev) =>
      prev.map((t) =>
        t.id === transferId
          ? {
              ...t,
              status: 'Đã phê duyệt & Cập nhật Hồ sơ',
              approvedBy: 'TS. Nguyễn Minh Hoàng'
            }
          : t
      )
    );

    // Tự động cập nhật Đơn vị quản lý và Chức danh mới vào Hồ sơ Nhân sự
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id !== target.empId) return emp;
        return {
          ...emp,
          catalogs: {
            ...emp.catalogs,
            don_vi_quan_ly: target.toUnitCode,
            chuc_danh_chuc_vu: target.toPositionCode
          }
        };
      })
    );
  };

  const handleRejectTransfer = (transferId: string) => {
    setTransfers((prev) =>
      prev.map((t) => (t.id === transferId ? { ...t, status: 'Từ chối' } : t))
    );
  };

  const handleSaveRewardDiscipline = (rd: RewardDisciplineRecord) => {
    setRewardsDisciplines((prev) => [rd, ...prev]);
  };

  const handleDeleteRewardDiscipline = (rdId: string) => {
    setRewardsDisciplines((prev) => prev.filter((r) => r.id !== rdId));
  };

  // Attendance handlers
  const handleUpdateAttendance = (updated: AttendanceRecord) => {
    setAttendance((prev) => {
      const exists = prev.some((a) => a.empId === updated.empId);
      if (!exists) return [...prev, updated];
      return prev.map((a) => (a.empId === updated.empId ? updated : a));
    });
  };

  const handleToggleLockAllAttendance = (locked: boolean) => {
    setAttendance((prev) => prev.map((a) => ({ ...a, isLocked: locked })));
  };

  // RBAC handlers
  const handleTogglePermission = (
    roleId: RoleId,
    moduleKey: string,
    field: 'view' | 'create' | 'edit' | 'delete' | 'approve'
  ) => {
    setRoles((prev) =>
      prev.map((r) => {
        if (r.id !== roleId) return r;
        return {
          ...r,
          permissions: r.permissions.map((p) =>
            p.module === moduleKey ? { ...p, [field]: !p[field] } : p
          )
        };
      })
    );
  };

  const handleUpdateEmployeeRole = (empId: string, newRoleId: RoleId) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === empId ? { ...e, roleId: newRoleId } : e))
    );
  };

  const handleQuickDownloadSQL = () => {
    const sql = generateMySQLSchemaAndSeed(
      catalogs,
      employees,
      roles,
      attendance,
      candidates,
      interviews,
      transfers,
      rewardsDisciplines
    );
    const blob = new Blob([sql], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'cti_hsk_hrms_mysql_full.sql');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResetDemoData = () => {
    setCatalogs(INITIAL_CATALOGS);
    setEmployees(INITIAL_EMPLOYEES);
    setAttendance(INITIAL_ATTENDANCE);
    setRoles(INITIAL_ROLES);
    setCandidates(INITIAL_CANDIDATES);
    setInterviews(INITIAL_INTERVIEWS);
    setTransfers(INITIAL_TRANSFERS);
    setRewardsDisciplines(INITIAL_REWARDS_DISCIPLINES);
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Bar Contract: Strictly 1 row, 3 zones */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#overview"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('overview');
          }}
          className="text-lg font-bold tracking-tight text-red-700 whitespace-nowrap shrink-0"
        >
          CTI HSK HRMS
        </a>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-slate-600">
          {[
            { id: 'overview', label: 'Tổng quan', alwaysShow: true },
            { id: 'recruitment', label: 'Tuyển dụng & PV', alwaysShow: true },
            { id: 'employees', label: 'Nhân sự & Sinh nhật', alwaysShow: true },
            { id: 'transfer_reward', label: 'Chuyển công tác & KTKL', alwaysShow: true },
            { id: 'attendance_payroll', label: 'Chấm công & Lương', alwaysShow: true },
            { id: 'catalogs', label: '18 Danh mục', alwaysShow: false },
            { id: 'rbac_mysql', label: 'PHP & MySQL', alwaysShow: false }
          ].map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as NavTabType)}
                className={`${
                  item.alwaysShow ? 'inline-flex' : 'hidden xl:inline-flex'
                } py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
                  isActive
                    ? 'text-slate-900 font-semibold border-red-700'
                    : 'border-transparent hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <select
            aria-label="Chọn quyền truy cập"
            value={activeRoleId}
            onChange={(e) => setActiveRoleId(e.target.value as RoleId)}
            className="px-3 py-1.5 text-xs font-medium bg-slate-100 border border-slate-200 rounded-md text-slate-800 focus:outline-none focus:border-red-700"
          >
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                Quyền: {r.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleQuickDownloadSQL}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors whitespace-nowrap cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Tải MySQL (.sql)
          </button>
        </div>
      </header>

      {/* Sub-navigation bar for smaller viewports (< xl) */}
      <div className="xl:hidden bg-white border-b border-slate-200 px-4 py-2 flex items-center gap-2 overflow-x-auto">
        {[
          { id: 'overview', label: 'Tổng quan' },
          { id: 'recruitment', label: 'Tuyển dụng & PV' },
          { id: 'employees', label: 'Nhân sự & Sinh nhật' },
          { id: 'transfer_reward', label: 'Chuyển công tác & KTKL' },
          { id: 'attendance_payroll', label: 'Chấm công & Lương' },
          { id: 'catalogs', label: '18 Danh mục' },
          { id: 'rbac_mysql', label: 'PHP & MySQL' }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as NavTabType)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === item.id
                ? 'bg-red-700 text-white'
                : 'text-slate-600 bg-slate-100'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Main Content Container */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'overview' && (
          <OverviewDashboardView
            employees={employees}
            catalogs={catalogs}
            attendance={attendance}
            candidates={candidates}
            interviews={interviews}
            transfers={transfers}
            rewardsDisciplines={rewardsDisciplines}
            activeRole={activeRole}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'recruitment' && (
          <RecruitmentManagerView
            candidates={candidates}
            interviews={interviews}
            employees={employees}
            catalogs={catalogs}
            canCreate={checkPerm('recruitment', 'create')}
            canEdit={checkPerm('recruitment', 'edit')}
            canApprove={checkPerm('recruitment', 'approve')}
            onSaveCandidate={handleSaveCandidate}
            onDeleteCandidate={handleDeleteCandidate}
            onOnboardCandidate={handleOnboardCandidate}
            onSaveInterview={handleSaveInterview}
            onDeleteInterview={handleDeleteInterview}
          />
        )}

        {activeTab === 'employees' && (
          <EmployeeManagerView
            employees={employees}
            catalogs={catalogs}
            roles={roles}
            canCreate={checkPerm('employees', 'create')}
            canEdit={checkPerm('employees', 'edit')}
            canDelete={checkPerm('employees', 'delete')}
            onSaveEmployee={handleSaveEmployee}
            onDeleteEmployee={handleDeleteEmployee}
            onApproveBirthdayGift={handleApproveBirthdayGift}
          />
        )}

        {activeTab === 'transfer_reward' && (
          <TransferAndRewardView
            employees={employees}
            catalogs={catalogs}
            transfers={transfers}
            rewardsDisciplines={rewardsDisciplines}
            canCreate={checkPerm('transfer_reward', 'create')}
            canApprove={checkPerm('transfer_reward', 'approve')}
            onCreateTransfer={handleCreateTransfer}
            onApproveTransfer={handleApproveTransfer}
            onRejectTransfer={handleRejectTransfer}
            onSaveRewardDiscipline={handleSaveRewardDiscipline}
            onDeleteRewardDiscipline={handleDeleteRewardDiscipline}
          />
        )}

        {activeTab === 'catalogs' && (
          <CatalogManagerView
            catalogs={catalogs}
            employees={employees}
            canCreate={checkPerm('catalogs', 'create')}
            canEdit={checkPerm('catalogs', 'edit')}
            canDelete={checkPerm('catalogs', 'delete')}
            onSaveCatalogItem={handleSaveCatalogItem}
            onDeleteCatalogItem={handleDeleteCatalogItem}
          />
        )}

        {activeTab === 'attendance_payroll' && (
          <AttendancePayrollView
            employees={employees}
            attendance={attendance}
            catalogs={catalogs}
            rewardsDisciplines={rewardsDisciplines}
            canEditAttendance={checkPerm('attendance', 'edit')}
            canApprovePayroll={checkPerm('payroll', 'approve')}
            onUpdateAttendance={handleUpdateAttendance}
            onToggleLockAllAttendance={handleToggleLockAllAttendance}
          />
        )}

        {activeTab === 'rbac_mysql' && (
          <RbacAndPhpMysqlView
            roles={roles}
            activeRoleId={activeRoleId}
            employees={employees}
            catalogs={catalogs}
            attendance={attendance}
            candidates={candidates}
            interviews={interviews}
            transfers={transfers}
            rewardsDisciplines={rewardsDisciplines}
            canEditRbac={checkPerm('rbac', 'edit')}
            onChangeActiveRole={setActiveRoleId}
            onTogglePermission={handleTogglePermission}
            onUpdateEmployeeRole={handleUpdateEmployeeRole}
          />
        )}
      </main>

      {/* Quiet Footer */}
      <footer className="bg-white border-t border-slate-200 px-6 py-4 mt-12">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Hệ thống Quản lý Nhân sự, Tuyển dụng, Điều chuyển, Khen thưởng & Tính lương Tự động CTI HSK Việt Nam · PHP 8 PDO & MySQL 8.0
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('catalogs')}
              className="hover:text-slate-900 underline cursor-pointer"
            >
              18 Danh mục Chuẩn
            </button>
            <button
              onClick={() => setActiveTab('rbac_mysql')}
              className="hover:text-slate-900 underline cursor-pointer"
            >
              Mã nguồn PHP 8 PDO & MySQL 8.0
            </button>
            <button
              onClick={handleResetDemoData}
              className="inline-flex items-center gap-1 text-slate-500 hover:text-red-700 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Khôi phục dữ liệu mẫu gốc
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
