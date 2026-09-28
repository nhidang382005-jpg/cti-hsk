import React, { useState, useMemo } from 'react';
import {
  CandidateRecord,
  CandidateStage,
  CatalogItem,
  CatalogKey,
  EmployeeRecord,
  InterviewScheduleRecord,
  formatVND
} from '../data/hrData';
import {
  UserPlus,
  Calendar,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  UserCheck,
  Plus,
  Trash2
} from 'lucide-react';

interface RecruitmentManagerViewProps {
  candidates: CandidateRecord[];
  interviews: InterviewScheduleRecord[];
  employees: EmployeeRecord[];
  catalogs: Record<CatalogKey, CatalogItem[]>;
  canCreate: boolean;
  canEdit: boolean;
  canApprove: boolean;
  onSaveCandidate: (cand: CandidateRecord, isNew: boolean) => void;
  onDeleteCandidate: (candId: string) => void;
  onOnboardCandidate: (cand: CandidateRecord) => void;
  onSaveInterview: (iv: InterviewScheduleRecord, isNew: boolean) => void;
  onDeleteInterview: (ivId: string) => void;
}

const CANDIDATE_STAGES: CandidateStage[] = [
  'Hồ sơ mới',
  'Đạt sơ loại CV',
  'Chờ phỏng vấn & Giảng thử',
  'Đạt - Chờ nhận việc',
  'Đã tiếp nhận Nhân sự',
  'Không đạt'
];

export const RecruitmentManagerView: React.FC<RecruitmentManagerViewProps> = ({
  candidates,
  interviews,
  employees,
  catalogs,
  canCreate,
  canEdit,
  canApprove,
  onSaveCandidate,
  onDeleteCandidate,
  onOnboardCandidate,
  onSaveInterview,
  onDeleteInterview
}) => {
  const [subView, setSubView] = useState<'both' | 'candidates' | 'interviews'>('both');
  const [stageFilter, setStageFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [bannerMessage, setBannerMessage] = useState<string>('');

  // Modal state for adding candidate
  const [isAddCandOpen, setIsAddCandOpen] = useState(false);
  const [candForm, setCandForm] = useState<CandidateRecord | null>(null);

  // Modal state for scheduling interview
  const [isAddIntOpen, setIsAddIntOpen] = useState(false);
  const [intForm, setIntForm] = useState<InterviewScheduleRecord | null>(null);

  const resolveCatalogName = (key: CatalogKey, code: string): string => {
    const found = catalogs[key]?.find((i) => i.code === code);
    return found ? found.name : code;
  };

  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      const matchStage = stageFilter === 'ALL' || c.stage === stageFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        c.candidateCode.toLowerCase().includes(q) ||
        c.fullName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.notes.toLowerCase().includes(q);
      return matchStage && matchSearch;
    });
  }, [candidates, stageFilter, searchQuery]);

  const openAddCandidateModal = () => {
    const nextNum = candidates.length + 1;
    setCandForm({
      id: `cand-${Date.now()}`,
      candidateCode: `UV-CTI-260${nextNum}`,
      fullName: '',
      gender: 'Nữ',
      birthDate: '1997-08-15',
      email: '',
      phone: '',
      appliedUnitCode: catalogs.don_vi_quan_ly[2]?.code || 'DV_CS_HN',
      appliedPositionCode: catalogs.chuc_danh_chuc_vu[6]?.code || 'CV_GVCH',
      hskQualificationCode: catalogs.trinh_do_ngoai_ngu[1]?.code || 'HSK6_HSKK_CC',
      educationLevelCode: catalogs.trinh_do_chuyen_mon[1]?.code || 'TD_THACSI',
      universityCode: catalogs.truong_dao_tao[0]?.code || 'TR_BLCU',
      expectedSalary: 18000000,
      experienceYears: 2,
      stage: 'Hồ sơ mới',
      appliedDate: new Date().toISOString().slice(0, 10),
      notes: ''
    });
    setIsAddCandOpen(true);
  };

  const openAddInterviewModal = (preselectedCand?: CandidateRecord) => {
    const targetCand = preselectedCand || candidates[0];
    if (!targetCand) return;
    const posName = resolveCatalogName('chuc_danh_chuc_vu', targetCand.appliedPositionCode);
    const defaultInterviewer = employees[0];

    setIntForm({
      id: `int-${Date.now()}`,
      interviewCode: `PV-HSK-0${interviews.length + 1}`,
      candidateId: targetCand.id,
      candidateName: targetCand.fullName,
      positionName: posName,
      interviewDate: '2026-09-30',
      interviewTime: '09:30',
      roundName: 'Vòng 2: Giảng thử Demo HSK (45 phút)',
      interviewerEmpId: defaultInterviewer?.id || 'emp-1',
      interviewerName: defaultInterviewer?.fullName || 'TS. Nguyễn Minh Hoàng',
      locationOrLink: 'Phòng Hội thảo A1 - CTI HSK Cơ sở Hà Nội',
      demoTopic: 'Giảng thử ngữ pháp trọng điểm HSK 5 - HSK 6',
      evaluationScore: undefined,
      status: 'Sắp diễn ra',
      feedback: ''
    });
    setIsAddIntOpen(true);
  };

  const handleCandidateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candForm || !candForm.fullName.trim()) return;
    onSaveCandidate(candForm, true);
    setIsAddCandOpen(false);
    setBannerMessage(`Đã thêm hồ sơ ứng viên ${candForm.fullName} (${candForm.candidateCode}) vào bảng hr_ung_vien.`);
  };

  const handleInterviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!intForm) return;
    onSaveInterview(intForm, true);
    setIsAddIntOpen(false);
    setBannerMessage(`Đã xếp lịch phỏng vấn / giảng thử ${intForm.interviewCode} cho ứng viên ${intForm.candidateName}.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Tuyển dụng Giảng viên & Chuyên viên HSK</span>
            <span aria-hidden="true">·</span>
            <span>Bảng MySQL: hr_ung_vien & hr_lich_phong_van</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">
              {candidates.length} ứng viên · {interviews.length} lịch phỏng vấn
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Quản lý Tuyển dụng, Danh sách Ứng viên & Lịch Phỏng vấn Giảng thử HSK
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
            {[
              { id: 'both', label: 'Tất cả Tuyển dụng' },
              { id: 'candidates', label: `Danh sách Ứng viên (${candidates.length})` },
              { id: 'interviews', label: `Lịch Phỏng vấn (${interviews.length})` }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setSubView(t.id as 'both' | 'candidates' | 'interviews')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  subView === t.id
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
                onClick={openAddCandidateModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-red-700 rounded-md hover:bg-red-800 transition-colors cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Thêm Ứng viên
              </button>
              <button
                onClick={() => openAddInterviewModal()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                Tạo Lịch Phỏng vấn / Demo
              </button>
            </>
          )}
        </div>
      </div>

      {bannerMessage && (
        <div className="px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-900">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{bannerMessage}</span>
          </div>
          <button
            onClick={() => setBannerMessage('')}
            className="font-semibold underline hover:text-emerald-950"
          >
            Đóng
          </button>
        </div>
      )}

      {/* SECTION 1: DANH SÁCH ỨNG VIÊN (CANDIDATE PIPELINE) */}
      {(subView === 'both' || subView === 'candidates') && (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                01. Danh sách Ứng viên Ứng tuyển Hệ thống CTI HSK (hr_ung_vien)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Theo dõi tiến trình tuyển dụng từ sơ loại CV, giảng thử Demo HSK đến tiếp nhận chính thức vào Hồ sơ Nhân sự 18 Danh mục.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm tên, mã UV, ghi chú HSK..."
                  className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:border-red-700"
                />
              </div>

              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md text-slate-700"
              >
                <option value="ALL">Tất cả Trạng thái ({candidates.length})</option>
                {CANDIDATE_STAGES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-600">
                  <th className="py-3 px-4 w-28">Mã Ứng viên</th>
                  <th className="py-3 px-4">Họ và tên · Liên hệ</th>
                  <th className="py-3 px-4">Vị trí · Cơ sở ứng tuyển</th>
                  <th className="py-3 px-4">Bằng cấp · Chứng chỉ HSK</th>
                  <th className="py-3 px-4 text-right w-32">Lương kỳ vọng</th>
                  <th className="py-3 px-4 w-44">Trạng thái Tuyển dụng</th>
                  <th className="py-3 px-4 text-right w-44">Thao tác Nghiệp vụ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {filteredCandidates.map((cand) => (
                  <tr key={cand.id} className="hover:bg-slate-50/90 transition-colors">
                    <td className="py-3.5 px-4 align-top font-mono font-semibold text-red-700 tabular-nums">
                      <div>{cand.candidateCode}</div>
                      <div className="text-[11px] font-normal text-slate-400 mt-0.5">
                        Nộp: {cand.appliedDate}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 align-top">
                      <div className="text-sm font-semibold text-slate-900">{cand.fullName}</div>
                      <div className="text-slate-500 mt-0.5">
                        {cand.gender} · Sinh: <span className="font-mono">{cand.birthDate}</span> ·{' '}
                        {cand.experienceYears} năm KN
                      </div>
                      <div className="font-mono text-slate-500 mt-0.5">
                        {cand.phone} · {cand.email}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 align-top">
                      <div className="font-semibold text-slate-900">
                        {resolveCatalogName('chuc_danh_chuc_vu', cand.appliedPositionCode)}
                      </div>
                      <div className="text-slate-600 mt-0.5">
                        {resolveCatalogName('don_vi_quan_ly', cand.appliedUnitCode)}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                        {cand.notes}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 align-top">
                      <div className="font-medium text-red-700">
                        {resolveCatalogName('trinh_do_ngoai_ngu', cand.hskQualificationCode)}
                      </div>
                      <div className="text-slate-700 mt-0.5">
                        {resolveCatalogName('trinh_do_chuyen_mon', cand.educationLevelCode)}
                      </div>
                      <div className="text-slate-500 mt-0.5">
                        {resolveCatalogName('truong_dao_tao', cand.universityCode)}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 align-top text-right font-mono font-semibold text-slate-900 tabular-nums">
                      {formatVND(cand.expectedSalary)}
                    </td>

                    <td className="py-3.5 px-4 align-top">
                      <select
                        disabled={!canEdit}
                        value={cand.stage}
                        onChange={(e) =>
                          onSaveCandidate(
                            { ...cand, stage: e.target.value as CandidateStage },
                            false
                          )
                        }
                        className="w-full px-2.5 py-1.5 text-xs font-medium border border-slate-300 rounded-md bg-white text-slate-800"
                      >
                        {CANDIDATE_STAGES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="py-3.5 px-4 align-top text-right">
                      <div className="flex flex-col items-end gap-1.5">
                        {cand.stage !== 'Đã tiếp nhận Nhân sự' && canApprove && (
                          <button
                            onClick={() => {
                              onOnboardCandidate(cand);
                              setBannerMessage(
                                `Đã tiếp nhận chính thức ${cand.fullName} vào bảng Hồ sơ Nhân sự (hr_nhan_vien) kèm 18 Danh mục chuẩn!`
                              );
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-md transition-colors cursor-pointer whitespace-nowrap"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            Tiếp nhận Nhân sự
                          </button>
                        )}

                        <div className="inline-flex items-center gap-1">
                          {canCreate && (
                            <button
                              onClick={() => openAddInterviewModal(cand)}
                              className="px-2 py-1 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md cursor-pointer"
                            >
                              + Lịch PV
                            </button>
                          )}
                          {canEdit && (
                            <button
                              onClick={() => onDeleteCandidate(cand.id)}
                              className="p-1 text-slate-400 hover:text-red-700 rounded-md cursor-pointer"
                              title="Xóa hồ sơ ứng viên"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 2: LỊCH PHỎNG VẤN & GIẢNG THỬ DEMO HSK */}
      {(subView === 'both' || subView === 'interviews') && (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                02. Lịch Phỏng vấn & Giảng thử Chuyên môn HSK (hr_lich_phong_van)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Quản lý hội đồng chấm giảng thử (Demo Class HSK), điểm đánh giá sư phạm và kết quả phỏng vấn.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-600">
                  <th className="py-3 px-4 w-28">Mã Lịch PV</th>
                  <th className="py-3 px-4 w-36">Thời gian</th>
                  <th className="py-3 px-4">Ứng viên · Vị trí</th>
                  <th className="py-3 px-4">Vòng thi · Chủ đề Giảng thử HSK</th>
                  <th className="py-3 px-4">Hội đồng Chấm · Địa điểm</th>
                  <th className="py-3 px-4 text-right w-24">Điểm số</th>
                  <th className="py-3 px-4 w-44">Trạng thái Kết quả</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {interviews.map((iv) => (
                  <tr key={iv.id} className="hover:bg-slate-50/90">
                    <td className="py-3.5 px-4 align-top font-mono font-semibold text-slate-900">
                      {iv.interviewCode}
                    </td>
                    <td className="py-3.5 px-4 align-top font-mono tabular-nums">
                      <div className="font-semibold text-slate-900">{iv.interviewDate}</div>
                      <div className="text-red-700 font-medium">{iv.interviewTime}</div>
                    </td>
                    <td className="py-3.5 px-4 align-top">
                      <div className="font-semibold text-slate-900 text-sm">{iv.candidateName}</div>
                      <div className="text-slate-500 mt-0.5">{iv.positionName}</div>
                    </td>
                    <td className="py-3.5 px-4 align-top">
                      <div className="font-semibold text-slate-800">{iv.roundName}</div>
                      <div className="text-slate-600 mt-0.5">Chủ đề: {iv.demoTopic}</div>
                      {iv.feedback && (
                        <div className="text-[11px] text-slate-500 mt-0.5 italic">
                          "{iv.feedback}"
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 align-top">
                      <div className="font-medium text-slate-900">{iv.interviewerName}</div>
                      <div className="text-slate-500 mt-0.5">{iv.locationOrLink}</div>
                    </td>
                    <td className="py-3.5 px-4 align-top text-right font-mono tabular-nums">
                      {iv.evaluationScore !== undefined ? (
                        <span className="font-bold text-emerald-700 text-sm">
                          {iv.evaluationScore}/100
                        </span>
                      ) : (
                        <span className="text-slate-400">Chưa chấm</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 align-top">
                      <div className="flex items-center justify-between gap-2">
                        {iv.status === 'Đã hoàn thành - Đạt' ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Đạt phỏng vấn
                          </span>
                        ) : iv.status === 'Sắp diễn ra' ? (
                          <div className="flex items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 text-amber-700 font-medium">
                              <Clock className="w-3.5 h-3.5" />
                              Sắp diễn ra
                            </span>
                            {canEdit && (
                              <button
                                onClick={() =>
                                  onSaveInterview(
                                    {
                                      ...iv,
                                      evaluationScore: 92,
                                      status: 'Đã hoàn thành - Đạt',
                                      feedback: 'Đạt yêu cầu giảng thử chuẩn CTI HSK.'
                                    },
                                    false
                                  )
                                }
                                className="px-2 py-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-sm cursor-pointer"
                              >
                                Chấm Đạt (92đ)
                              </button>
                            )}
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-red-700 font-medium">
                            <XCircle className="w-3.5 h-3.5" />
                            {iv.status}
                          </span>
                        )}

                        {canEdit && (
                          <button
                            onClick={() => onDeleteInterview(iv.id)}
                            className="p-1 text-slate-400 hover:text-red-700 cursor-pointer"
                            title="Xóa lịch phỏng vấn"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Thêm Ứng viên */}
      {isAddCandOpen && candForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-lg max-w-2xl w-full p-6 shadow-xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <div className="text-xs font-mono text-slate-500">Bảng MySQL: hr_ung_vien</div>
                <h3 className="text-base font-bold text-slate-900">
                  Thêm Hồ sơ Ứng viên Ứng tuyển Mới
                </h3>
              </div>
              <button
                onClick={() => setIsAddCandOpen(false)}
                className="text-xs text-slate-500 hover:text-slate-900"
              >
                Đóng
              </button>
            </div>

            <form onSubmit={handleCandidateSubmit} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mã Ứng viên *</label>
                  <input
                    type="text"
                    required
                    value={candForm.candidateCode}
                    onChange={(e) =>
                      setCandForm({ ...candForm, candidateCode: e.target.value.toUpperCase() })
                    }
                    className="w-full px-3 py-2 font-mono border border-slate-300 rounded-md"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Họ và tên Ứng viên *</label>
                  <input
                    type="text"
                    required
                    value={candForm.fullName}
                    onChange={(e) => setCandForm({ ...candForm, fullName: e.target.value })}
                    placeholder="VD: ThS. Trần Minh Ánh"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ngày sinh</label>
                  <input
                    type="date"
                    value={candForm.birthDate}
                    onChange={(e) => setCandForm({ ...candForm, birthDate: e.target.value })}
                    className="w-full px-3 py-2 font-mono border border-slate-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Số điện thoại</label>
                  <input
                    type="text"
                    required
                    value={candForm.phone}
                    onChange={(e) => setCandForm({ ...candForm, phone: e.target.value })}
                    className="w-full px-3 py-2 font-mono border border-slate-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={candForm.email}
                    onChange={(e) => setCandForm({ ...candForm, email: e.target.value })}
                    className="w-full px-3 py-2 font-mono border border-slate-300 rounded-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Đơn vị / Cơ sở Ứng tuyển (Danh mục #01)
                  </label>
                  <select
                    value={candForm.appliedUnitCode}
                    onChange={(e) =>
                      setCandForm({ ...candForm, appliedUnitCode: e.target.value })
                    }
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
                    Vị trí Chức danh Ứng tuyển (Danh mục #05)
                  </label>
                  <select
                    value={candForm.appliedPositionCode}
                    onChange={(e) =>
                      setCandForm({ ...candForm, appliedPositionCode: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white"
                  >
                    {catalogs.chuc_danh_chuc_vu.map((p) => (
                      <option key={p.code} value={p.code}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Chứng chỉ Ngoại ngữ HSK (Danh mục #15)
                  </label>
                  <select
                    value={candForm.hskQualificationCode}
                    onChange={(e) =>
                      setCandForm({ ...candForm, hskQualificationCode: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white"
                  >
                    {catalogs.trinh_do_ngoai_ngu.map((h) => (
                      <option key={h.code} value={h.code}>
                        {h.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Trường Đào tạo Tốt nghiệp (Danh mục #11)
                  </label>
                  <select
                    value={candForm.universityCode}
                    onChange={(e) =>
                      setCandForm({ ...candForm, universityCode: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white"
                  >
                    {catalogs.truong_dao_tao.map((tr) => (
                      <option key={tr.code} value={tr.code}>
                        {tr.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Mức lương kỳ vọng (VNĐ)
                  </label>
                  <input
                    type="number"
                    step={500000}
                    value={candForm.expectedSalary}
                    onChange={(e) =>
                      setCandForm({ ...candForm, expectedSalary: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 font-mono border border-slate-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Số năm kinh nghiệm giảng dạy / khảo thí
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={candForm.experienceYears}
                    onChange={(e) =>
                      setCandForm({ ...candForm, experienceYears: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 font-mono border border-slate-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Đánh giá hồ sơ / Điểm HSK & HSKK chi tiết
                </label>
                <textarea
                  rows={2}
                  value={candForm.notes}
                  onChange={(e) => setCandForm({ ...candForm, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  placeholder="Ghi chú điểm số HSK, kinh nghiệm đứng lớp..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddCandOpen(false)}
                  className="px-4 py-2 font-medium text-slate-700 bg-slate-100 rounded-md"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-red-700 rounded-md hover:bg-red-800 cursor-pointer"
                >
                  Lưu Hồ sơ Ứng viên
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tạo Lịch Phỏng vấn / Giảng thử */}
      {isAddIntOpen && intForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-lg max-w-lg w-full p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <div className="text-xs font-mono text-slate-500">Bảng MySQL: hr_lich_phong_van</div>
                <h3 className="text-base font-bold text-slate-900">
                  Xếp Lịch Phỏng vấn & Giảng thử Demo HSK
                </h3>
              </div>
              <button
                onClick={() => setIsAddIntOpen(false)}
                className="text-xs text-slate-500 hover:text-slate-900"
              >
                Đóng
              </button>
            </div>

            <form onSubmit={handleInterviewSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Chọn Ứng viên *</label>
                <select
                  value={intForm.candidateId}
                  onChange={(e) => {
                    const c = candidates.find((x) => x.id === e.target.value);
                    if (c) {
                      setIntForm({
                        ...intForm,
                        candidateId: c.id,
                        candidateName: c.fullName,
                        positionName: resolveCatalogName('chuc_danh_chuc_vu', c.appliedPositionCode)
                      });
                    }
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white"
                >
                  {candidates.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.candidateCode} — {c.fullName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ngày phỏng vấn *</label>
                  <input
                    type="date"
                    required
                    value={intForm.interviewDate}
                    onChange={(e) => setIntForm({ ...intForm, interviewDate: e.target.value })}
                    className="w-full px-3 py-2 font-mono border border-slate-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Giờ bắt đầu *</label>
                  <input
                    type="time"
                    required
                    value={intForm.interviewTime}
                    onChange={(e) => setIntForm({ ...intForm, interviewTime: e.target.value })}
                    className="w-full px-3 py-2 font-mono border border-slate-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Vòng đánh giá</label>
                <select
                  value={intForm.roundName}
                  onChange={(e) =>
                    setIntForm({
                      ...intForm,
                      roundName: e.target.value as InterviewScheduleRecord['roundName']
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white"
                >
                  <option value="Vòng 1: Phỏng vấn Năng lực Hán ngữ">
                    Vòng 1: Phỏng vấn Năng lực Hán ngữ
                  </option>
                  <option value="Vòng 2: Giảng thử Demo HSK (45 phút)">
                    Vòng 2: Giảng thử Demo HSK (45 phút)
                  </option>
                  <option value="Vòng 3: Phỏng vấn Hội đồng & Chốt Offer">
                    Vòng 3: Phỏng vấn Hội đồng & Chốt Offer
                  </option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Chủ đề Giảng thử / Nội dung sát hạch HSK *
                </label>
                <input
                  type="text"
                  required
                  value={intForm.demoTopic}
                  onChange={(e) => setIntForm({ ...intForm, demoTopic: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Địa điểm phòng Demo hoặc Link họp trực tuyến *
                </label>
                <input
                  type="text"
                  required
                  value={intForm.locationOrLink}
                  onChange={(e) => setIntForm({ ...intForm, locationOrLink: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddIntOpen(false)}
                  className="px-4 py-2 font-medium text-slate-700 bg-slate-100 rounded-md"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-red-700 rounded-md hover:bg-red-800 cursor-pointer"
                >
                  Xác nhận Lịch Phỏng vấn
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
