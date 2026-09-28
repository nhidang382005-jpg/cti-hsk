import React, { useState, useMemo } from 'react';
import {
  AttendanceRecord,
  CandidateRecord,
  CatalogItem,
  CatalogKey,
  EmployeeRecord,
  InterviewScheduleRecord,
  RewardDisciplineRecord,
  RoleDefinition,
  RoleId,
  TransferRequestRecord
} from '../data/hrData';
import {
  generateMySQLSchemaAndSeed,
  PHP_SOURCE_FILES
} from '../utils/phpMysqlGenerator';
import {
  ShieldCheck,
  Database,
  Code2,
  Copy,
  Download,
  Check,
  Lock
} from 'lucide-react';

interface RbacAndPhpMysqlViewProps {
  roles: RoleDefinition[];
  activeRoleId: RoleId;
  employees: EmployeeRecord[];
  catalogs: Record<CatalogKey, CatalogItem[]>;
  attendance: AttendanceRecord[];
  candidates: CandidateRecord[];
  interviews: InterviewScheduleRecord[];
  transfers: TransferRequestRecord[];
  rewardsDisciplines: RewardDisciplineRecord[];
  canEditRbac: boolean;
  onChangeActiveRole: (roleId: RoleId) => void;
  onTogglePermission: (
    roleId: RoleId,
    moduleKey: string,
    field: 'view' | 'create' | 'edit' | 'delete' | 'approve'
  ) => void;
  onUpdateEmployeeRole: (empId: string, newRoleId: RoleId) => void;
}

export const RbacAndPhpMysqlView: React.FC<RbacAndPhpMysqlViewProps> = ({
  roles,
  activeRoleId,
  employees,
  catalogs,
  attendance,
  candidates,
  interviews,
  transfers,
  rewardsDisciplines,
  canEditRbac,
  onChangeActiveRole,
  onTogglePermission,
  onUpdateEmployeeRole
}) => {
  const [selectedRoleTab, setSelectedRoleTab] = useState<RoleId>('HR_MANAGER');
  const [codeTab, setCodeTab] = useState<string>('mysql_sql');
  const [copied, setCopied] = useState(false);

  const selectedRoleObj = useMemo(
    () => roles.find((r) => r.id === selectedRoleTab) || roles[0],
    [roles, selectedRoleTab]
  );

  const liveSqlScript = useMemo(
    () =>
      generateMySQLSchemaAndSeed(
        catalogs,
        employees,
        roles,
        attendance,
        candidates,
        interviews,
        transfers,
        rewardsDisciplines
      ),
    [
      catalogs,
      employees,
      roles,
      attendance,
      candidates,
      interviews,
      transfers,
      rewardsDisciplines
    ]
  );

  const displayedCode = useMemo(() => {
    if (codeTab === 'mysql_sql') return liveSqlScript;
    return PHP_SOURCE_FILES[codeTab]?.code || '';
  }, [codeTab, liveSqlScript]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(displayedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const isSql = codeTab === 'mysql_sql';
    const filename = isSql
      ? 'cti_hsk_hrms_mysql_full.sql'
      : PHP_SOURCE_FILES[codeTab]?.filename.split('/').pop() || 'code.php';

    const blob = new Blob([displayedCode], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-5 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Bảo mật Phân quyền RBAC</span>
            <span aria-hidden="true">·</span>
            <span>Kiến trúc PHP 8.2 PDO & MySQL 8.0 InnoDB</span>
            <span aria-hidden="true">·</span>
            <span>Đầy đủ Tuyển dụng, Điều chuyển, Khen thưởng, 18 Danh mục & Lương</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Phân quyền Nhân sự (RBAC) & Mã nguồn PHP / MySQL Thực tế
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-600">Giả lập phiên đăng nhập:</span>
          <select
            value={activeRoleId}
            onChange={(e) => onChangeActiveRole(e.target.value as RoleId)}
            className="px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-md text-slate-900"
          >
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                Đang dùng quyền: {r.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* SECTION 1: MA TRẬN PHÂN QUYỀN VAI TRÒ & GÁN QUYỀN NHÂN VIÊN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-red-700" />
                Ma trận Phân quyền theo Vai trò (sys_vai_tro_phan_quyen)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Cấu hình quyền hạn Xem, Thêm, Sửa, Xóa, Duyệt trên từng phân hệ nghiệp vụ.
              </p>
            </div>
          </div>

          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap gap-1.5">
            {roles.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedRoleTab(r.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  selectedRoleTab === r.id
                    ? 'bg-red-700 text-white'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {r.name}
              </button>
            ))}
          </div>

          <div className="p-4 bg-slate-50/50 border-b border-slate-200 text-xs text-slate-600">
            <span className="font-semibold text-slate-900">{selectedRoleObj.name}</span> (
            <span className="font-mono text-red-700">{selectedRoleObj.code}</span>):{' '}
            {selectedRoleObj.description}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-600">
                  <th className="py-3 px-4">Phân hệ Nghiệp vụ CTI HSK</th>
                  <th className="py-3 px-3 text-center">Xem</th>
                  <th className="py-3 px-3 text-center">Thêm mới</th>
                  <th className="py-3 px-3 text-center">Chỉnh sửa</th>
                  <th className="py-3 px-3 text-center">Xóa</th>
                  <th className="py-3 px-3 text-center">Phê duyệt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {selectedRoleObj.permissions.map((perm) => (
                  <tr key={perm.module} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      <div>{perm.moduleName}</div>
                      <div className="text-[11px] font-mono font-normal text-slate-400">
                        module: {perm.module}
                      </div>
                    </td>
                    {(['view', 'create', 'edit', 'delete', 'approve'] as const).map((field) => (
                      <td key={field} className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          disabled={!canEditRbac || selectedRoleObj.id === 'SUPER_ADMIN'}
                          checked={perm[field]}
                          onChange={() =>
                            onTogglePermission(selectedRoleObj.id, perm.module, field)
                          }
                          className="w-4 h-4 rounded border-slate-300 text-red-700 focus:ring-red-700 cursor-pointer disabled:cursor-not-allowed"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!canEditRbac && (
            <div className="p-3 bg-amber-50 border-t border-amber-200 text-xs text-amber-800 flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 shrink-0" />
              <span>
                Chỉ vai trò Giám đốc Hệ thống (Super Admin) mới có quyền thay đổi ma trận phân quyền gốc.
              </span>
            </div>
          )}
        </div>

        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <h2 className="text-base font-bold text-slate-900">
              Cấp phát Quyền Truy cập cho Nhân sự
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Gán trực tiếp vai trò phân quyền cho từng cán bộ, giảng viên trong bảng hr_nhan_vien.
            </p>
          </div>

          <div className="divide-y divide-slate-200 max-h-[380px] overflow-y-auto">
            {employees.map((emp) => (
              <div
                key={emp.id}
                className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50"
              >
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-slate-900 truncate">
                    {emp.fullName}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    {emp.empCode} · {emp.email}
                  </div>
                </div>

                <select
                  disabled={!canEditRbac}
                  value={emp.roleId}
                  onChange={(e) => onUpdateEmployeeRole(emp.id, e.target.value as RoleId)}
                  className="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md text-slate-800 disabled:bg-slate-100"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.code} ({r.id})
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 2: TRÌNH XUẤT CƠ SỞ DỮ LIỆU MYSQL & MÃ NGUỒN PHP 8 PDO */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-red-700 font-mono font-semibold mb-1">
              <Database className="w-4 h-4" />
              <span>MYSQL 8.0 + PHP 8.2 PDO PRODUCTION CODE GENERATOR</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Cơ sở dữ liệu MySQL (Tuyển dụng, Chuyển công tác, Khen thưởng, 18 Danh mục) & PHP PDO
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Toàn bộ dữ liệu ứng viên, lịch phỏng vấn, đơn xin chuyển công tác, khen thưởng kỷ luật, sinh nhật, 18 danh mục và bảng lương được biên dịch tự động sang kịch bản SQL và mã nguồn PHP PDO.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyCode}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                  Đã sao chép
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Sao chép mã
                </>
              )}
            </button>

            <button
              onClick={handleDownloadFile}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-red-700 hover:bg-red-800 rounded-md transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Tải File {codeTab === 'mysql_sql' ? '.SQL' : '.PHP'}
            </button>
          </div>
        </div>

        <div className="px-5 py-3 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setCodeTab('mysql_sql')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-md transition-colors cursor-pointer ${
              codeTab === 'mysql_sql'
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-red-500" />
            database_cti_hsk.sql (Full Schema + Seed)
          </button>

          {Object.entries(PHP_SOURCE_FILES).map(([key, fileObj]) => (
            <button
              key={key}
              onClick={() => setCodeTab(key)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-md transition-colors cursor-pointer ${
                codeTab === key
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-blue-500" />
              {fileObj.filename}
            </button>
          ))}
        </div>

        <div className="bg-slate-950 text-slate-100 p-5 overflow-x-auto max-h-[540px] overflow-y-auto">
          <pre className="text-xs font-mono leading-relaxed">{displayedCode}</pre>
        </div>
      </div>
    </div>
  );
};
