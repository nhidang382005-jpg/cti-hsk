import React, { useState } from 'react';
import {
  CatalogItem,
  CatalogKey,
  EmployeeRecord,
  RewardDisciplineRecord,
  TransferRequestRecord,
  formatVND
} from '../data/hrData';
import {
  ArrowLeftRight,
  Award,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  Clock
} from 'lucide-react';

interface TransferAndRewardViewProps {
  employees: EmployeeRecord[];
  catalogs: Record<CatalogKey, CatalogItem[]>;
  transfers: TransferRequestRecord[];
  rewardsDisciplines: RewardDisciplineRecord[];
  canCreate: boolean;
  canApprove: boolean;
  onCreateTransfer: (trf: TransferRequestRecord) => void;
  onApproveTransfer: (transferId: string) => void;
  onRejectTransfer: (transferId: string) => void;
  onSaveRewardDiscipline: (rd: RewardDisciplineRecord) => void;
  onDeleteRewardDiscipline: (rdId: string) => void;
}

export const TransferAndRewardView: React.FC<TransferAndRewardViewProps> = ({
  employees,
  catalogs,
  transfers,
  rewardsDisciplines,
  canCreate,
  canApprove,
  onCreateTransfer,
  onApproveTransfer,
  onRejectTransfer,
  onSaveRewardDiscipline,
  onDeleteRewardDiscipline
}) => {
  const [subTab, setSubTab] = useState<'both' | 'transfers' | 'rewards'>('both');
  const [bannerMsg, setBannerMsg] = useState<string>('');

  // Modal state for Transfer Request
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [selectedEmpId, setSelectedEmpId] = useState<string>(employees[0]?.id || '');
  const [toUnitCode, setToUnitCode] = useState<string>('DV_CS_HN');
  const [toPositionCode, setToPositionCode] = useState<string>('CV_TBM_HSK');
  const [effectiveDate, setEffectiveDate] = useState<string>('2026-10-01');
  const [transferReason, setTransferReason] = useState<string>('');

  // Modal state for Reward / Discipline
  const [isRDModalOpen, setIsRDModalOpen] = useState(false);
  const [rdEmpId, setRdEmpId] = useState<string>(employees[0]?.id || '');
  const [rdType, setRdType] = useState<'REWARD' | 'DISCIPLINE'>('REWARD');
  const [rdTitle, setRdTitle] = useState<string>('');
  const [rdReason, setRdReason] = useState<string>('');
  const [rdAmount, setRdAmount] = useState<number>(2000000);
  const [rdMonth, setRdMonth] = useState<string>('2026-09');

  const resolveCatalogName = (key: CatalogKey, code: string): string => {
    const found = catalogs[key]?.find((i) => i.code === code);
    return found ? found.name : code;
  };

  const handleOpenTransferModal = () => {
    const emp = employees[0];
    if (emp) {
      setSelectedEmpId(emp.id);
    }
    setTransferReason('');
    setIsTransferModalOpen(true);
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find((x) => x.id === selectedEmpId);
    if (!emp || !transferReason.trim()) return;

    const newTrf: TransferRequestRecord = {
      id: `trf-${Date.now()}`,
      requestCode: `DC-CTI-2026-0${transfers.length + 1}`,
      empId: emp.id,
      empCode: emp.empCode,
      empName: emp.fullName,
      fromUnitCode: emp.catalogs.don_vi_quan_ly,
      toUnitCode,
      fromPositionCode: emp.catalogs.chuc_danh_chuc_vu,
      toPositionCode,
      requestDate: new Date().toISOString().slice(0, 10),
      effectiveDate,
      reason: transferReason.trim(),
      status: 'Chờ phê duyệt'
    };

    onCreateTransfer(newTrf);
    setIsTransferModalOpen(false);
    setBannerMsg(
      `Đã tạo đơn xin chuyển công tác ${newTrf.requestCode} cho ${emp.fullName}. Chờ Ban Giám đốc / Trưởng phòng NS phê duyệt.`
    );
  };

  const handleRDSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find((x) => x.id === rdEmpId);
    if (!emp || !rdTitle.trim()) return;

    const prefix = rdType === 'REWARD' ? 'QĐKT' : 'QĐKL';
    const newRD: RewardDisciplineRecord = {
      id: `rd-${Date.now()}`,
      decisionCode: `${prefix}-09/2026-0${rewardsDisciplines.length + 1}`,
      empId: emp.id,
      empCode: emp.empCode,
      empName: emp.fullName,
      type: rdType,
      categoryTitle: rdTitle.trim(),
      reason: rdReason.trim() || rdTitle.trim(),
      amount: Math.abs(Number(rdAmount) || 0),
      appliedMonth: rdMonth,
      decisionDate: new Date().toISOString().slice(0, 10),
      signedBy: 'TS. Nguyễn Minh Hoàng',
      status: 'Đã duyệt áp dụng Lương'
    };

    onSaveRewardDiscipline(newRD);
    setIsRDModalOpen(false);
    setBannerMsg(
      `Đã ban hành quyết định ${newRD.decisionCode} cho ${emp.fullName}. Số tiền ${formatVND(
        newRD.amount
      )} đã được tự động đồng bộ vào Bảng lương kỳ ${rdMonth}!`
    );
  };

  const totalRewards = rewardsDisciplines
    .filter((r) => r.type === 'REWARD')
    .reduce((sum, r) => sum + r.amount, 0);

  const totalDisciplines = rewardsDisciplines
    .filter((r) => r.type === 'DISCIPLINE')
    .reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Luân chuyển Nội bộ & Chế độ Đãi ngộ</span>
            <span aria-hidden="true">·</span>
            <span>Bảng MySQL: hr_dieu_chuyen_cong_tac & hr_khen_thuong_ky_luat</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Xin Chuyển Công tác (Phòng ban / Cơ sở) & Khen thưởng - Kỷ luật
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
            {[
              { id: 'both', label: 'Tất cả Nghiệp vụ' },
              { id: 'transfers', label: `Chuyển công tác (${transfers.length})` },
              { id: 'rewards', label: `Khen thưởng & Kỷ luật (${rewardsDisciplines.length})` }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setSubTab(t.id as 'both' | 'transfers' | 'rewards')}
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

          {canCreate && (
            <>
              <button
                onClick={handleOpenTransferModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                Tạo Đơn Xin Chuyển Công tác
              </button>

              <button
                onClick={() => {
                  setRdTitle('');
                  setRdReason('');
                  setIsRDModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-red-700 rounded-md hover:bg-red-800 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Ra Quyết định Khen thưởng / Kỷ luật
              </button>
            </>
          )}
        </div>
      </div>

      {bannerMsg && (
        <div className="px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-900">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{bannerMsg}</span>
          </div>
          <button
            onClick={() => setBannerMsg('')}
            className="font-semibold underline hover:text-emerald-950"
          >
            Đóng
          </button>
        </div>
      )}

      {/* SECTION 1: XIN CHUYỂN CÔNG TÁC / ĐIỀU CHUYỂN PHÒNG BAN */}
      {(subTab === 'both' || subTab === 'transfers') && (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ArrowLeftRight className="w-4 h-4 text-red-700" />
                01. Danh sách Đơn Xin Chuyển Công tác / Điều chuyển Phòng ban (hr_dieu_chuyen_cong_tac)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Khi phê duyệt, hệ thống tự động cập nhật Đơn vị quản lý (#01) và Chức danh (#05) mới vào Hồ sơ Nhân sự và điều chỉnh Phụ cấp chức vụ tương ứng.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-600">
                  <th className="py-3 px-4 w-32">Mã Phiếu</th>
                  <th className="py-3 px-4">Nhân sự Đề xuất</th>
                  <th className="py-3 px-4">Đơn vị & Chức vụ Hiện tại</th>
                  <th className="py-3 px-4">Đơn vị & Chức vụ Chuyển đến</th>
                  <th className="py-3 px-4">Lý do & Ngày hiệu lực</th>
                  <th className="py-3 px-4 w-52 text-right">Trạng thái / Phê duyệt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {transfers.map((trf) => (
                  <tr key={trf.id} className="hover:bg-slate-50/90">
                    <td className="py-3.5 px-4 align-top font-mono font-semibold text-red-700">
                      <div>{trf.requestCode}</div>
                      <div className="text-[11px] font-normal text-slate-400 mt-0.5">
                        Ngày đơn: {trf.requestDate}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 align-top">
                      <div className="font-semibold text-slate-900 text-sm">{trf.empName}</div>
                      <div className="font-mono text-slate-500 mt-0.5">{trf.empCode}</div>
                    </td>

                    <td className="py-3.5 px-4 align-top">
                      <div className="font-medium text-slate-800">
                        {resolveCatalogName('don_vi_quan_ly', trf.fromUnitCode)}
                      </div>
                      <div className="text-slate-500 mt-0.5">
                        {resolveCatalogName('chuc_danh_chuc_vu', trf.fromPositionCode)}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 align-top">
                      <div className="font-semibold text-emerald-800">
                        → {resolveCatalogName('don_vi_quan_ly', trf.toUnitCode)}
                      </div>
                      <div className="text-slate-700 font-medium mt-0.5">
                        {resolveCatalogName('chuc_danh_chuc_vu', trf.toPositionCode)}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 align-top">
                      <div className="text-slate-700">{trf.reason}</div>
                      <div className="font-mono text-[11px] text-slate-500 mt-1">
                        Hiệu lực từ: {trf.effectiveDate}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 align-top text-right">
                      {trf.status === 'Chờ phê duyệt' ? (
                        <div className="flex flex-col items-end gap-1.5">
                          <span className="inline-flex items-center gap-1 text-amber-700 font-medium">
                            <Clock className="w-3.5 h-3.5" />
                            Chờ phê duyệt
                          </span>
                          {canApprove && (
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                onClick={() => {
                                  onApproveTransfer(trf.id);
                                  setBannerMsg(
                                    `Đã phê duyệt phiếu ${trf.requestCode}! Hồ sơ nhân sự của ${trf.empName} đã được chuyển sang đơn vị mới.`
                                  );
                                }}
                                className="px-2.5 py-1 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-md cursor-pointer"
                              >
                                Duyệt & Chuyển Phòng
                              </button>
                              <button
                                onClick={() => onRejectTransfer(trf.id)}
                                className="px-2 py-1 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-md cursor-pointer"
                              >
                                Từ chối
                              </button>
                            </div>
                          )}
                        </div>
                      ) : trf.status === 'Đã phê duyệt & Cập nhật Hồ sơ' ? (
                        <div>
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Đã duyệt & Cập nhật
                          </span>
                          {trf.approvedBy && (
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              Người duyệt: {trf.approvedBy}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-700 font-medium">
                          <XCircle className="w-3.5 h-3.5" />
                          Đã từ chối
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 2: KHEN THƯỞNG & KỶ LUẬT (LIÊN THÔNG BẢNG LƯƠNG) */}
      {(subTab === 'both' || subTab === 'rewards') && (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-red-700" />
                02. Sổ Quyết định Khen thưởng & Kỷ luật Nhân sự (hr_khen_thuong_ky_luat)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Tự động cộng tiền thưởng vào Thu nhập Gross và khấu trừ tiền phạt kỷ luật vào Bảng lương tháng tương ứng.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono tabular-nums">
              <span className="text-emerald-700 font-semibold">
                Tổng Thưởng: +{formatVND(totalRewards)}
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-red-700 font-semibold">
                Tổng Phạt Kỷ luật: -{formatVND(totalDisciplines)}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-600">
                  <th className="py-3 px-4 w-36">Số Quyết định</th>
                  <th className="py-3 px-4 w-32">Phân loại</th>
                  <th className="py-3 px-4">Nhân sự thụ hưởng / Chịu kỷ luật</th>
                  <th className="py-3 px-4">Danh hiệu / Hình thức & Lý do</th>
                  <th className="py-3 px-4 text-right w-36">Mức Thưởng / Phạt</th>
                  <th className="py-3 px-4 w-28">Kỳ lương</th>
                  <th className="py-3 px-4 text-right w-20">Xóa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {rewardsDisciplines.map((rd) => (
                  <tr key={rd.id} className="hover:bg-slate-50/90">
                    <td className="py-3.5 px-4 align-top font-mono font-semibold text-slate-900">
                      <div>{rd.decisionCode}</div>
                      <div className="text-[11px] font-normal text-slate-400 mt-0.5">
                        Ngày ký: {rd.decisionDate}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 align-top">
                      {rd.type === 'REWARD' ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                          <Award className="w-3.5 h-3.5" />
                          Khen thưởng
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-semibold text-red-700">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Kỷ luật
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 align-top">
                      <div className="font-semibold text-slate-900 text-sm">{rd.empName}</div>
                      <div className="font-mono text-slate-500 mt-0.5">{rd.empCode}</div>
                    </td>

                    <td className="py-3.5 px-4 align-top">
                      <div className="font-semibold text-slate-900">{rd.categoryTitle}</div>
                      <div className="text-slate-600 mt-0.5">{rd.reason}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Người ký: {rd.signedBy}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 align-top text-right font-mono font-bold text-sm tabular-nums">
                      {rd.type === 'REWARD' ? (
                        <span className="text-emerald-700">+{formatVND(rd.amount)}</span>
                      ) : (
                        <span className="text-red-700">-{formatVND(rd.amount)}</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 align-top font-mono text-slate-700">
                      {rd.appliedMonth}
                    </td>

                    <td className="py-3.5 px-4 align-top text-right">
                      {canApprove && (
                        <button
                          onClick={() => onDeleteRewardDiscipline(rd.id)}
                          className="p-1.5 text-slate-400 hover:text-red-700 rounded-md cursor-pointer"
                          title="Hủy quyết định"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Tạo Đơn Xin Chuyển Công tác */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-lg max-w-lg w-full p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <div className="text-xs font-mono text-slate-500">
                  Bảng MySQL: hr_dieu_chuyen_cong_tac
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Tạo Đơn Xin Chuyển Công tác (Luân chuyển Phòng ban / Cơ sở)
                </h3>
              </div>
              <button
                onClick={() => setIsTransferModalOpen(false)}
                className="text-xs text-slate-500 hover:text-slate-900"
              >
                Đóng
              </button>
            </div>

            <form onSubmit={handleTransferSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Chọn Nhân sự xin chuyển công tác *
                </label>
                <select
                  value={selectedEmpId}
                  onChange={(e) => setSelectedEmpId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.empCode} — {emp.fullName} (Hiện tại:{' '}
                      {resolveCatalogName('don_vi_quan_ly', emp.catalogs.don_vi_quan_ly)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Đơn vị quản lý / Cơ sở chuyển đến (Danh mục #01) *
                </label>
                <select
                  value={toUnitCode}
                  onChange={(e) => setToUnitCode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white"
                >
                  {catalogs.don_vi_quan_ly.map((u) => (
                    <option key={u.code} value={u.code}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Chức danh / Chức vụ đảm nhiệm mới (Danh mục #05) *
                </label>
                <select
                  value={toPositionCode}
                  onChange={(e) => setToPositionCode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white"
                >
                  {catalogs.chuc_danh_chuc_vu.map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.name} (+{formatVND(p.allowance || 0)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Ngày bắt đầu hiệu lực *
                </label>
                <input
                  type="date"
                  required
                  value={effectiveDate}
                  onChange={(e) => setEffectiveDate(e.target.value)}
                  className="w-full px-3 py-2 font-mono border border-slate-300 rounded-md"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Lý do xin chuyển công tác / Điều động *
                </label>
                <textarea
                  rows={3}
                  required
                  value={transferReason}
                  onChange={(e) => setTransferReason(e.target.value)}
                  placeholder="Nêu rõ nguyện vọng cá nhân hoặc yêu cầu tăng cường nhân sự đào tạo HSK..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-md"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsTransferModalOpen(false)}
                  className="px-4 py-2 font-medium text-slate-700 bg-slate-100 rounded-md"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-red-700 rounded-md hover:bg-red-800 cursor-pointer"
                >
                  Gửi Đơn Xin Chuyển Công tác
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Ra Quyết định Khen thưởng / Kỷ luật */}
      {isRDModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-lg max-w-lg w-full p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <div className="text-xs font-mono text-slate-500">
                  Bảng MySQL: hr_khen_thuong_ky_luat
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Ban hành Quyết định Khen thưởng / Kỷ luật (Liên thông Lương)
                </h3>
              </div>
              <button
                onClick={() => setIsRDModalOpen(false)}
                className="text-xs text-slate-500 hover:text-slate-900"
              >
                Đóng
              </button>
            </div>

            <form onSubmit={handleRDSubmit} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setRdType('REWARD');
                    setRdAmount(2500000);
                  }}
                  className={`py-2.5 px-3 font-semibold rounded-md border flex items-center justify-center gap-1.5 cursor-pointer ${
                    rdType === 'REWARD'
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  Quyết định Khen thưởng (+)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRdType('DISCIPLINE');
                    setRdAmount(500000);
                  }}
                  className={`py-2.5 px-3 font-semibold rounded-md border flex items-center justify-center gap-1.5 cursor-pointer ${
                    rdType === 'DISCIPLINE'
                      ? 'bg-red-50 border-red-600 text-red-800'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4" />
                  Quyết định Kỷ luật (-)
                </button>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Chọn Nhân sự *</label>
                <select
                  value={rdEmpId}
                  onChange={(e) => setRdEmpId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.empCode} — {emp.fullName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tên Danh hiệu Khen thưởng hoặc Hình thức Kỷ luật *
                </label>
                <input
                  type="text"
                  required
                  value={rdTitle}
                  onChange={(e) => setRdTitle(e.target.value)}
                  placeholder={
                    rdType === 'REWARD'
                      ? 'VD: Thưởng Giảng viên có tỷ lệ đỗ HSK 6 đạt 100%'
                      : 'VD: Phạt vi phạm quy chế coi thi HSK / Nộp báo cáo muộn'
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Số tiền {rdType === 'REWARD' ? 'Thưởng cộng lương' : 'Phạt trừ lương'} (VNĐ) *
                  </label>
                  <input
                    type="number"
                    step={100000}
                    required
                    value={rdAmount}
                    onChange={(e) => setRdAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 font-mono border border-slate-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Kỳ lương áp dụng *
                  </label>
                  <input
                    type="month"
                    required
                    value={rdMonth}
                    onChange={(e) => setRdMonth(e.target.value)}
                    className="w-full px-3 py-2 font-mono border border-slate-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nội dung lý do chi tiết
                </label>
                <textarea
                  rows={2}
                  value={rdReason}
                  onChange={(e) => setRdReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsRDModalOpen(false)}
                  className="px-4 py-2 font-medium text-slate-700 bg-slate-100 rounded-md"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-red-700 rounded-md hover:bg-red-800 cursor-pointer"
                >
                  Ban hành & Đồng bộ Bảng lương
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
