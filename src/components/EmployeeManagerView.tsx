import React, { useState, useMemo } from 'react';
import {
  CATALOG_DEFINITIONS,
  CatalogItem,
  CatalogKey,
  EmployeeRecord,
  RoleDefinition,
  RoleId,
  formatVND
} from '../data/hrData';
import {
  Search,
  UserPlus,
  Eye,
  Edit3,
  Trash2,
  FileText,
  CheckCircle2,
  Clock,
  Cake,
  Gift
} from 'lucide-react';

interface EmployeeManagerViewProps {
  employees: EmployeeRecord[];
  catalogs: Record<CatalogKey, CatalogItem[]>;
  roles: RoleDefinition[];
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  onSaveEmployee: (emp: EmployeeRecord, isNew: boolean) => void;
  onDeleteEmployee: (empId: string) => void;
  onApproveBirthdayGift?: (emp: EmployeeRecord) => void;
}

export const EmployeeManagerView: React.FC<EmployeeManagerViewProps> = ({
  employees,
  catalogs,
  roles,
  canCreate,
  canEdit,
  canDelete,
  onSaveEmployee,
  onDeleteEmployee,
  onApproveBirthdayGift
}) => {
  const [subMode, setSubMode] = useState<'dossiers' | 'birthdays'>('dossiers');
  const [birthdayMonthFilter, setBirthdayMonthFilter] = useState<number>(9); // Tháng 9 hiện tại (0 = Tất cả)
  const [birthdayBanner, setBirthdayBanner] = useState<string>('');

  const [searchQuery, setSearchQuery] = useState('');
  const [unitFilter, setUnitFilter] = useState('ALL');
  const [hskFilter, setHskFilter] = useState('ALL');
  const [selectedDossier, setSelectedDossier] = useState<EmployeeRecord | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isNewRecord, setIsNewRecord] = useState(true);
  const [formData, setFormData] = useState<EmployeeRecord | null>(null);

  const resolveCatalogName = (key: CatalogKey, code: string): string => {
    const found = catalogs[key]?.find((i) => i.code === code);
    return found ? found.name : code;
  };

  const resolveCatalogAllowance = (key: CatalogKey, code: string): number => {
    const found = catalogs[key]?.find((i) => i.code === code);
    return found?.allowance || 0;
  };

  const septemberBirthdaysCount = useMemo(() => {
    return employees.filter((e) => {
      const m = Number(e.birthDate.split('-')[1]);
      return m === 9;
    }).length;
  }, [employees]);

  const birthdayEmployees = useMemo(() => {
    return employees
      .filter((e) => {
        const m = Number(e.birthDate.split('-')[1]);
        return birthdayMonthFilter === 0 || m === birthdayMonthFilter;
      })
      .sort((a, b) => {
        const dayA = Number(a.birthDate.split('-')[2] || 1);
        const dayB = Number(b.birthDate.split('-')[2] || 1);
        return dayA - dayB;
      });
  }, [employees, birthdayMonthFilter]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchUnit = unitFilter === 'ALL' || emp.catalogs.don_vi_quan_ly === unitFilter;
      const matchHsk = hskFilter === 'ALL' || emp.catalogs.trinh_do_ngoai_ngu === hskFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        emp.empCode.toLowerCase().includes(q) ||
        emp.fullName.toLowerCase().includes(q) ||
        emp.email.toLowerCase().includes(q) ||
        resolveCatalogName('chuc_danh_chuc_vu', emp.catalogs.chuc_danh_chuc_vu)
          .toLowerCase()
          .includes(q);
      return matchUnit && matchHsk && matchSearch;
    });
  }, [employees, unitFilter, hskFilter, searchQuery, catalogs]);

  const handleOpenAdd = () => {
    const nextIdx = employees.length + 1;
    const defaultCatalogs = {} as Record<CatalogKey, string>;
    for (const def of CATALOG_DEFINITIONS) {
      defaultCatalogs[def.key] = catalogs[def.key]?.[0]?.code || '';
    }

    setFormData({
      id: `emp-${Date.now()}`,
      empCode: `CTI-HSK-00${nextIdx}`,
      fullName: '',
      gender: 'Nữ',
      birthDate: '1996-09-20',
      email: `nhansu${nextIdx}@ctihsk.edu.vn`,
      phone: '0912000111',
      joinDate: new Date().toISOString().slice(0, 10),
      contractType: 'Hợp đồng 36 tháng',
      roleId: 'STAFF',
      baseSalary: 16000000,
      salaryCoefficient: 1.3,
      kpiBonus: 2500000,
      dependentsCount: 0,
      status: 'Đang công tác',
      catalogs: defaultCatalogs
    });
    setIsNewRecord(true);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (emp: EmployeeRecord) => {
    setFormData({
      ...emp,
      catalogs: { ...emp.catalogs }
    });
    setIsNewRecord(false);
    setIsFormOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !formData.fullName.trim() || !formData.empCode.trim()) return;
    onSaveEmployee(formData, isNewRecord);
    setIsFormOpen(false);
    setFormData(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Quản trị Hồ sơ Cán bộ & Giảng viên</span>
            <span aria-hidden="true">·</span>
            <span>Đồng bộ 18 Danh mục Chuẩn</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">
              {employees.length} nhân sự · {septemberBirthdaysCount} sinh nhật tháng 09
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Hồ sơ Nhân sự 360° & Theo dõi Sinh nhật Cán bộ CTI HSK
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Sub-mode switcher: Dossiers vs Birthdays */}
          <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
            <button
              onClick={() => setSubMode('dossiers')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                subMode === 'dossiers'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Danh sách Hồ sơ 360° ({employees.length})
            </button>
            <button
              onClick={() => setSubMode('birthdays')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap inline-flex items-center gap-1.5 cursor-pointer ${
                subMode === 'birthdays'
                  ? 'bg-white text-red-700 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Cake className="w-3.5 h-3.5 text-red-700" />
              Sinh nhật Nhân sự ({septemberBirthdaysCount} trong tháng 09)
            </button>
          </div>

          {canCreate && (
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-red-700 rounded-md hover:bg-red-800 transition-colors whitespace-nowrap cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              Thêm Hồ sơ Nhân sự Mới
            </button>
          )}
        </div>
      </div>

      {birthdayBanner && (
        <div className="px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-900">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{birthdayBanner}</span>
          </div>
          <button
            onClick={() => setBirthdayBanner('')}
            className="font-semibold underline hover:text-emerald-950"
          >
            Đóng
          </button>
        </div>
      )}

      {/* VIEW MODE 2: QUẢN LÝ SINH NHẬT NHÂN SỰ */}
      {subMode === 'birthdays' && (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Cake className="w-4 h-4 text-red-700" />
                Danh sách Sinh nhật Cán bộ & Giảng viên CTI HSK (Chế độ Phúc lợi Công đoàn)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Tự động trích xuất từ trường <code className="font-mono">MONTH(ngay_sinh)</code> trong bảng <code className="font-mono">hr_nhan_vien</code>. Định mức quà chúc mừng sinh nhật: 500.000 ₫/nhân sự.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600">Lọc theo tháng sinh:</span>
              <select
                value={birthdayMonthFilter}
                onChange={(e) => setBirthdayMonthFilter(Number(e.target.value))}
                className="px-3 py-1.5 text-xs font-medium bg-white border border-slate-300 rounded-md"
              >
                <option value={0}>Tất cả 12 tháng trong năm</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
                  <option key={m} value={m}>
                    Tháng {String(m).padStart(2, '0')} {m === 9 ? '(Tháng hiện tại)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-600">
                  <th className="py-3 px-4 w-32">Ngày Sinh nhật</th>
                  <th className="py-3 px-4 w-32">Mã NV</th>
                  <th className="py-3 px-4">Họ và tên Nhân sự · Tuổi mới</th>
                  <th className="py-3 px-4">Đơn vị Quản lý · Chức vụ</th>
                  <th className="py-3 px-4">Chức vụ Đoàn / Công đoàn</th>
                  <th className="py-3 px-4 text-right w-40">Định mức Quà Sinh nhật</th>
                  <th className="py-3 px-4 text-right w-48">Thao tác Phúc lợi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {birthdayEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-slate-500">
                      Không có nhân sự nào có ngày sinh nhật trong tháng đã chọn.
                    </td>
                  </tr>
                ) : (
                  birthdayEmployees.map((emp) => {
                    const parts = emp.birthDate.split('-');
                    const birthYear = Number(parts[0]);
                    const birthMonth = parts[1];
                    const birthDay = parts[2];
                    const age = 2026 - birthYear;

                    return (
                      <tr key={emp.id} className="hover:bg-slate-50/90">
                        <td className="py-3.5 px-4 font-mono font-bold text-red-700 tabular-nums">
                          Ngày {birthDay}/{birthMonth}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">
                          {emp.empCode}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-900 text-sm">{emp.fullName}</div>
                          <div className="text-slate-500 mt-0.5 font-mono">
                            Sinh ngày: {emp.birthDate} · Kỷ niệm {age} tuổi
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-slate-900">
                            {resolveCatalogName('don_vi_quan_ly', emp.catalogs.don_vi_quan_ly)}
                          </div>
                          <div className="text-slate-500 mt-0.5">
                            {resolveCatalogName(
                              'chuc_danh_chuc_vu',
                              emp.catalogs.chuc_danh_chuc_vu
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700">
                          {resolveCatalogName('chuc_vu_doan', emp.catalogs.chuc_vu_doan)}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-semibold text-emerald-700 tabular-nums">
                          +500.000 ₫
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => {
                              if (onApproveBirthdayGift) {
                                onApproveBirthdayGift(emp);
                              }
                              setBirthdayBanner(
                                `Đã gửi thiệp chúc mừng sinh nhật và cộng 500.000 ₫ tiền thưởng Phúc lợi Sinh nhật vào Bảng lương của ${emp.fullName}!`
                              );
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-red-700 hover:bg-red-800 rounded-md cursor-pointer"
                          >
                            <Gift className="w-3.5 h-3.5" />
                            Tặng quà & Cộng lương (+500k)
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW MODE 1: DANH SÁCH HỒ SƠ NHÂN SỰ 360° */}
      {subMode === 'dossiers' && (
        <>
          {/* Filter Bar */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm theo mã nhân viên (CTI-HSK-...), họ tên, email, chức danh..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:border-red-700"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={unitFilter}
                onChange={(e) => setUnitFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-md text-slate-700 focus:outline-none focus:border-red-700"
              >
                <option value="ALL">Tất cả Đơn vị quản lý</option>
                {catalogs.don_vi_quan_ly.map((u) => (
                  <option key={u.code} value={u.code}>
                    {u.name}
                  </option>
                ))}
              </select>

              <select
                value={hskFilter}
                onChange={(e) => setHskFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-md text-slate-700 focus:outline-none focus:border-red-700"
              >
                <option value="ALL">Tất cả Trình độ Ngoại ngữ (HSK)</option>
                {catalogs.trinh_do_ngoai_ngu.map((h) => (
                  <option key={h.code} value={h.code}>
                    {h.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* High-Density Employee Table */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-600">
                    <th className="py-3 px-4 w-32">Mã NV</th>
                    <th className="py-3 px-4">Họ và tên · Ngày sinh · Liên hệ</th>
                    <th className="py-3 px-4">Đơn vị quản lý · Chức vụ</th>
                    <th className="py-3 px-4">Trình độ · Trường ĐT · Ngoại ngữ HSK</th>
                    <th className="py-3 px-4 text-right w-36">Lương CB & Phụ cấp</th>
                    <th className="py-3 px-4 w-32">Phân quyền</th>
                    <th className="py-3 px-4 text-right w-28">Hồ sơ 360°</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm">
                  {filteredEmployees.map((emp) => {
                    const posAllowance = resolveCatalogAllowance(
                      'chuc_danh_chuc_vu',
                      emp.catalogs.chuc_danh_chuc_vu
                    );
                    const hskAllowance = resolveCatalogAllowance(
                      'trinh_do_ngoai_ngu',
                      emp.catalogs.trinh_do_ngoai_ngu
                    );
                    const roleObj = roles.find((r) => r.id === emp.roleId);
                    const isSepBirthday = Number(emp.birthDate.split('-')[1]) === 9;

                    return (
                      <tr key={emp.id} className="hover:bg-slate-50/90 transition-colors">
                        <td className="py-3.5 px-4 align-top font-mono text-xs font-semibold text-red-700 tabular-nums">
                          <div>{emp.empCode}</div>
                          <div className="text-[11px] font-normal text-slate-500 mt-0.5">
                            Hệ số: {emp.salaryCoefficient.toFixed(2)}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 align-top">
                          <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                            <span>{emp.fullName}</span>
                            {isSepBirthday && (
                              <span
                                title="Có sinh nhật trong tháng 09"
                                className="text-red-700 inline-flex items-center"
                              >
                                <Cake className="w-3.5 h-3.5" />
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-1.5">
                            <span>{emp.gender}</span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono">{emp.birthDate}</span>
                            <span aria-hidden="true">·</span>
                            <span>{resolveCatalogName('dan_toc', emp.catalogs.dan_toc)}</span>
                          </div>
                          <div className="text-xs text-slate-500 font-mono mt-0.5">{emp.email}</div>
                        </td>

                        <td className="py-3.5 px-4 align-top">
                          <div className="font-medium text-slate-900 text-xs">
                            {resolveCatalogName('don_vi_quan_ly', emp.catalogs.don_vi_quan_ly)}
                          </div>
                          <div className="text-xs text-slate-600 mt-0.5">
                            {resolveCatalogName(
                              'chuc_danh_chuc_vu',
                              emp.catalogs.chuc_danh_chuc_vu
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {resolveCatalogName(
                              'cong_viec_chuyen_mon',
                              emp.catalogs.cong_viec_chuyen_mon
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 align-top text-xs">
                          <div className="font-medium text-slate-900">
                            {resolveCatalogName(
                              'trinh_do_chuyen_mon',
                              emp.catalogs.trinh_do_chuyen_mon
                            )}{' '}
                            · {resolveCatalogName('nganh_dao_tao', emp.catalogs.nganh_dao_tao)}
                          </div>
                          <div className="text-slate-600 mt-0.5">
                            {resolveCatalogName('truong_dao_tao', emp.catalogs.truong_dao_tao)}
                          </div>
                          <div className="text-red-700 font-medium mt-0.5">
                            {resolveCatalogName(
                              'trinh_do_ngoai_ngu',
                              emp.catalogs.trinh_do_ngoai_ngu
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 align-top text-right font-mono text-xs tabular-nums">
                          <div className="font-semibold text-slate-900">
                            {formatVND(emp.baseSalary)}
                          </div>
                          <div className="text-emerald-700 mt-0.5">
                            +PC: {formatVND(posAllowance + hskAllowance)}
                          </div>
                          <div className="text-slate-500 mt-0.5">
                            +KPI: {formatVND(emp.kpiBonus)}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 align-top text-xs">
                          <div className="font-semibold text-slate-800">{roleObj?.code}</div>
                          <div className="text-slate-500 mt-0.5 flex items-center gap-1">
                            {emp.status === 'Đang công tác' ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            ) : (
                              <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            )}
                            <span>{emp.status}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 align-top text-right">
                          <div className="inline-flex items-center justify-end gap-1">
                            <button
                              onClick={() => setSelectedDossier(emp)}
                              title="Xem chi tiết 18 Danh mục của Nhân sự"
                              className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md inline-flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              Chi tiết
                            </button>
                            {canEdit && (
                              <button
                                onClick={() => handleOpenEdit(emp)}
                                title="Cập nhật hồ sơ"
                                className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                            )}
                            {canDelete && (
                              <button
                                onClick={() => onDeleteEmployee(emp.id)}
                                title="Xóa hồ sơ"
                                className="p-1.5 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
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
        </>
      )}

      {/* Modal Xem Sơ yếu Lý lịch 360° đủ 18 Danh mục */}
      {selectedDossier && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-lg max-w-4xl w-full p-6 shadow-xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                  <span>MÃ HỒ SƠ: {selectedDossier.empCode}</span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedDossier.contractType}</span>
                  <span aria-hidden="true">·</span>
                  <span>Ngày vào: {selectedDossier.joinDate}</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  Hồ sơ Nhân sự 360°: {selectedDossier.fullName}
                </h2>
              </div>
              <button
                onClick={() => setSelectedDossier(null)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 rounded-md hover:bg-slate-200 cursor-pointer"
              >
                Đóng cửa sổ
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-b border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 block">Lương cơ bản HĐ</span>
                <span className="font-mono text-sm font-bold text-slate-900 tabular-nums">
                  {formatVND(selectedDossier.baseSalary)}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Phụ cấp Chức vụ (Danh mục #05)</span>
                <span className="font-mono text-sm font-bold text-emerald-700 tabular-nums">
                  +{formatVND(
                    resolveCatalogAllowance(
                      'chuc_danh_chuc_vu',
                      selectedDossier.catalogs.chuc_danh_chuc_vu
                    )
                  )}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Phụ cấp Ngoại ngữ HSK (Danh mục #15)</span>
                <span className="font-mono text-sm font-bold text-emerald-700 tabular-nums">
                  +{formatVND(
                    resolveCatalogAllowance(
                      'trinh_do_ngoai_ngu',
                      selectedDossier.catalogs.trinh_do_ngoai_ngu
                    )
                  )}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Thưởng KPI Định mức</span>
                <span className="font-mono text-sm font-bold text-slate-900 tabular-nums">
                  +{formatVND(selectedDossier.kpiBonus)}
                </span>
              </div>
            </div>

            <div className="mt-5">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-red-700" />
                Chi tiết 18 Danh mục Nhân sự Chuẩn đang liên kết khóa ngoại MySQL
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {CATALOG_DEFINITIONS.map((def) => {
                  const codeVal = selectedDossier.catalogs[def.key];
                  const nameVal = resolveCatalogName(def.key, codeVal);
                  return (
                    <div
                      key={def.key}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-md flex items-start justify-between gap-3"
                    >
                      <div>
                        <div className="text-xs text-slate-500">
                          <span className="font-mono font-semibold text-red-700">
                            {String(def.index).padStart(2, '0')}.
                          </span>{' '}
                          {def.title}
                        </div>
                        <div className="text-sm font-semibold text-slate-900 mt-0.5">{nameVal}</div>
                      </div>
                      <span className="font-mono text-[11px] text-slate-500 shrink-0">
                        {codeVal}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Thêm / Sửa Hồ sơ Nhân sự (Gắn 18 Danh mục) */}
      {isFormOpen && formData && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-lg max-w-5xl w-full p-6 shadow-xl my-8 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <div className="text-xs text-slate-500 font-mono">
                  Bảng MySQL: hr_nhan_vien (18 Foreign Keys)
                </div>
                <h2 className="text-lg font-bold text-slate-900">
                  {isNewRecord
                    ? 'Thêm Hồ sơ Nhân sự Mới (Đầy đủ 18 Danh mục)'
                    : `Cập nhật Hồ sơ: ${formData.fullName} (${formData.empCode})`}
                </h2>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                Đóng [ESC]
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="mt-5 space-y-6">
              <div>
                <h3 className="text-xs font-bold text-slate-800 pb-2 border-b border-slate-200 mb-3">
                  01. Thông tin Định danh, Ngày sinh, Phân quyền & Định mức Lương Cơ bản
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Mã Nhân viên *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.empCode}
                      onChange={(e) =>
                        setFormData({ ...formData, empCode: e.target.value.toUpperCase() })
                      }
                      className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Họ và tên Nhân sự *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md"
                      placeholder="VD: ThS. Nguyễn Lan Anh"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Giới tính
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value as 'Nam' | 'Nữ' })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md bg-white"
                    >
                      <option value="Nữ">Nữ</option>
                      <option value="Nam">Nam</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Ngày sinh (Theo dõi Sinh nhật)
                    </label>
                    <input
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Email công vụ
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Số điện thoại
                    </label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Vai trò Phân quyền Hệ thống
                    </label>
                    <select
                      value={formData.roleId}
                      onChange={(e) =>
                        setFormData({ ...formData, roleId: e.target.value as RoleId })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md bg-white"
                    >
                      {roles.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Lương cơ bản HĐ (VNĐ)
                    </label>
                    <input
                      type="number"
                      step={500000}
                      value={formData.baseSalary}
                      onChange={(e) =>
                        setFormData({ ...formData, baseSalary: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-md"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-800 pb-2 border-b border-slate-200 mb-3">
                  02. Thiết lập Đầy đủ 18 Danh mục Nhân sự Chuẩn (Tự động tính Phụ cấp Chức vụ & Phụ cấp HSK)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {CATALOG_DEFINITIONS.map((def) => {
                    const options = catalogs[def.key] || [];
                    return (
                      <div key={def.key}>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          <span className="font-mono font-semibold text-red-700">
                            {String(def.index).padStart(2, '0')}.
                          </span>{' '}
                          {def.title}
                        </label>
                        <select
                          value={formData.catalogs[def.key] || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              catalogs: {
                                ...formData.catalogs,
                                [def.key]: e.target.value
                              }
                            })
                          }
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md bg-white"
                        >
                          {options.map((opt) => (
                            <option key={opt.code} value={opt.code}>
                              {opt.name}
                              {opt.allowance ? ` (+${formatVND(opt.allowance)})` : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-red-700 rounded-md hover:bg-red-800 cursor-pointer"
                >
                  Lưu Hồ sơ Nhân sự
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
