export type CatalogKey =
  | 'don_vi_quan_ly'
  | 'tinh_trang_hon_nhan'
  | 'dan_toc'
  | 'ton_giao'
  | 'chuc_danh_chuc_vu'
  | 'chuc_vu_dang'
  | 'chuc_vu_doan'
  | 'cong_viec_chuyen_mon'
  | 'trinh_do_chuyen_mon'
  | 'nganh_dao_tao'
  | 'truong_dao_tao'
  | 'hinh_thuc_dao_tao'
  | 'trinh_do_tin_hoc'
  | 'ngoai_ngu'
  | 'trinh_do_ngoai_ngu'
  | 'trinh_do_hoc_van'
  | 'linh_vuc_cong_tac'
  | 'noi_dao_tao';

export interface CatalogItem {
  id: string;
  code: string;
  name: string;
  description: string;
  allowance?: number; // Phụ cấp đi kèm (VNĐ) nếu có (VD: chức vụ, trình độ HSK)
  coefficient?: number; // Hệ số phụ cấp nếu có
  isActive: boolean;
  updatedAt: string;
}

export interface CatalogDefinition {
  key: CatalogKey;
  index: number;
  title: string;
  shortTitle: string;
  mysqlTable: string;
  group: 'to_chuc' | 'ca_nhan_chinh_tri' | 'dao_tao_bang_cap' | 'chuyen_mon_nn';
  groupLabel: string;
  hasAllowance?: boolean;
  description: string;
}

export const CATALOG_DEFINITIONS: CatalogDefinition[] = [
  {
    key: 'don_vi_quan_ly',
    index: 1,
    title: 'Danh mục đơn vị quản lý',
    shortTitle: 'Đơn vị quản lý',
    mysqlTable: 'dm_don_vi_quan_ly',
    group: 'to_chuc',
    groupLabel: 'Tổ chức & Công tác',
    description: 'Các cơ sở đào tạo, điểm khảo thí HSK và phòng ban thuộc hệ thống CTI HSK Việt Nam.'
  },
  {
    key: 'tinh_trang_hon_nhan',
    index: 2,
    title: 'Danh mục tình trạng hôn nhân',
    shortTitle: 'Tình trạng hôn nhân',
    mysqlTable: 'dm_tinh_trang_hon_nhan',
    group: 'ca_nhan_chinh_tri',
    groupLabel: 'Nhân thân & Chính trị',
    description: 'Phân loại tình trạng hôn nhân phục vụ kê khai hồ sơ nhân sự và giảm trừ gia cảnh thuế TNCN.'
  },
  {
    key: 'dan_toc',
    index: 3,
    title: 'Danh mục dân tộc',
    shortTitle: 'Dân tộc',
    mysqlTable: 'dm_dan_toc',
    group: 'ca_nhan_chinh_tri',
    groupLabel: 'Nhân thân & Chính trị',
    description: 'Danh mục 54 dân tộc Việt Nam và chuyên gia bản ngữ Trung Quốc công tác tại CTI HSK.'
  },
  {
    key: 'ton_giao',
    index: 4,
    title: 'Danh mục tôn giáo',
    shortTitle: 'Tôn giáo',
    mysqlTable: 'dm_ton_giao',
    group: 'ca_nhan_chinh_tri',
    groupLabel: 'Nhân thân & Chính trị',
    description: 'Danh mục tôn giáo theo quy định quản lý hồ sơ cán bộ, nhân viên và giảng viên.'
  },
  {
    key: 'chuc_danh_chuc_vu',
    index: 5,
    title: 'Danh mục chức danh, chức vụ',
    shortTitle: 'Chức danh, chức vụ',
    mysqlTable: 'dm_chuc_danh_chuc_vu',
    group: 'to_chuc',
    groupLabel: 'Tổ chức & Công tác',
    hasAllowance: true,
    description: 'Chức danh quản lý và vị trí chức vụ kèm định mức phụ cấp trách nhiệm hàng tháng.'
  },
  {
    key: 'chuc_vu_dang',
    index: 6,
    title: 'Danh mục chức vụ Đảng',
    shortTitle: 'Chức vụ Đảng',
    mysqlTable: 'dm_chuc_vu_dang',
    group: 'ca_nhan_chinh_tri',
    groupLabel: 'Nhân thân & Chính trị',
    description: 'Chức vụ trong Chi bộ Đảng tại đơn vị hoặc Đảng ủy khối doanh nghiệp/giáo dục.'
  },
  {
    key: 'chuc_vu_doan',
    index: 7,
    title: 'Danh mục chức vụ Đoàn',
    shortTitle: 'Chức vụ Đoàn',
    mysqlTable: 'dm_chuc_vu_doan',
    group: 'ca_nhan_chinh_tri',
    groupLabel: 'Nhân thân & Chính trị',
    description: 'Chức vụ trong Đoàn Thanh niên Cộng sản Hồ Chí Minh và Công đoàn cơ sở CTI HSK.'
  },
  {
    key: 'cong_viec_chuyen_mon',
    index: 8,
    title: 'Danh mục công việc chuyên môn đảm nhiệm',
    shortTitle: 'Công việc chuyên môn',
    mysqlTable: 'dm_cong_viec_chuyen_mon',
    group: 'to_chuc',
    groupLabel: 'Tổ chức & Công tác',
    description: 'Nhiệm vụ chuyên môn chính đang đảm nhận tại trung tâm (Giảng dạy HSK, Coi thi, R&D...).'
  },
  {
    key: 'trinh_do_chuyen_mon',
    index: 9,
    title: 'Danh mục trình độ chuyên môn',
    shortTitle: 'Trình độ chuyên môn',
    mysqlTable: 'dm_trinh_do_chuyen_mon',
    group: 'dao_tao_bang_cap',
    groupLabel: 'Đào tạo & Học vấn',
    description: 'Cấp bậc học vị chuyên môn cao nhất (Tiến sĩ, Thạc sĩ, Cử nhân Đại học, Cao đẳng).'
  },
  {
    key: 'nganh_dao_tao',
    index: 10,
    title: 'Danh mục ngành đào tạo',
    shortTitle: 'Ngành đào tạo',
    mysqlTable: 'dm_nganh_dao_tao',
    group: 'dao_tao_bang_cap',
    groupLabel: 'Đào tạo & Học vấn',
    description: 'Chuyên ngành được đào tạo chính quy (Sư phạm Tiếng Trung, Hán ngữ Quốc tế, Quản trị...).'
  },
  {
    key: 'truong_dao_tao',
    index: 11,
    title: 'Danh mục trường đào tạo',
    shortTitle: 'Trường đào tạo',
    mysqlTable: 'dm_truong_dao_tao',
    group: 'dao_tao_bang_cap',
    groupLabel: 'Đào tạo & Học vấn',
    description: 'Các trường Đại học, Học viện trong nước và quốc tế nơi nhân sự tốt nghiệp.'
  },
  {
    key: 'hinh_thuc_dao_tao',
    index: 12,
    title: 'Danh mục hình thức đào tạo',
    shortTitle: 'Hình thức đào tạo',
    mysqlTable: 'dm_hinh_thuc_dao_tao',
    group: 'dao_tao_bang_cap',
    groupLabel: 'Đào tạo & Học vấn',
    description: 'Hình thức theo học văn bằng (Chính quy, Liên thông, Du học học bổng Khổng Tử/CSC, Từ xa).'
  },
  {
    key: 'trinh_do_tin_hoc',
    index: 13,
    title: 'Danh mục trình độ tin học',
    shortTitle: 'Trình độ tin học',
    mysqlTable: 'dm_trinh_do_tin_hoc',
    group: 'chuyen_mon_nn',
    groupLabel: 'Ngoại ngữ & Tin học',
    description: 'Chứng chỉ công nghệ thông tin và kỹ năng vận hành phần mềm khảo thí HSK trực tuyến (iBT).'
  },
  {
    key: 'ngoai_ngu',
    index: 14,
    title: 'Danh mục ngoại ngữ',
    shortTitle: 'Ngoại ngữ',
    mysqlTable: 'dm_ngoai_ngu',
    group: 'chuyen_mon_nn',
    groupLabel: 'Ngoại ngữ & Tin học',
    description: 'Ngôn ngữ sử dụng trong giảng dạy, khảo thí và giao tiếp quốc tế tại hệ thống CTI HSK.'
  },
  {
    key: 'trinh_do_ngoai_ngu',
    index: 15,
    title: 'Danh mục trình độ ngoại ngữ',
    shortTitle: 'Trình độ ngoại ngữ',
    mysqlTable: 'dm_trinh_do_ngoai_ngu',
    group: 'chuyen_mon_nn',
    groupLabel: 'Ngoại ngữ & Tin học',
    hasAllowance: true,
    description: 'Cấp độ chứng chỉ HSK/HSKK, CTCSOL, IELTS... kèm mức phụ cấp năng lực ngoại ngữ hàng tháng.'
  },
  {
    key: 'trinh_do_hoc_van',
    index: 16,
    title: 'Danh mục trình độ học vấn phổ thông',
    shortTitle: 'Học vấn phổ thông',
    mysqlTable: 'dm_trinh_do_hoc_van',
    group: 'dao_tao_bang_cap',
    groupLabel: 'Đào tạo & Học vấn',
    description: 'Trình độ giáo dục phổ thông theo hệ 12/12 hoặc tương đương.'
  },
  {
    key: 'linh_vuc_cong_tac',
    index: 17,
    title: 'Danh mục lĩnh vực công tác',
    shortTitle: 'Lĩnh vực công tác',
    mysqlTable: 'dm_linh_vuc_cong_tac',
    group: 'to_chuc',
    groupLabel: 'Tổ chức & Công tác',
    description: 'Mảng nghiệp vụ chuyên sâu trong hệ sinh thái đào tạo và khảo thí CTI HSK.'
  },
  {
    key: 'noi_dao_tao',
    index: 18,
    title: 'Danh mục nơi đào tạo',
    shortTitle: 'Nơi đào tạo',
    mysqlTable: 'dm_noi_dao_tao',
    group: 'dao_tao_bang_cap',
    groupLabel: 'Đào tạo & Học vấn',
    description: 'Quốc gia hoặc khu vực địa lý nơi nhân sự hoàn thành chương trình đào tạo chuyên môn.'
  }
];

export const INITIAL_CATALOGS: Record<CatalogKey, CatalogItem[]> = {
  don_vi_quan_ly: [
    { id: 'dv-1', code: 'DV_BGD', name: 'Ban Giám đốc Hệ thống CTI HSK Việt Nam', description: 'Cơ quan điều hành cấp cao toàn hệ thống CTI HSK', isActive: true, updatedAt: '2026-09-01' },
    { id: 'dv-2', code: 'DV_DTKT', name: 'Hội đồng Đào tạo & Khảo thí HSK Quốc tế', description: 'Quản lý chất lượng giảng dạy HSK 1-9 và tổ chức kỳ thi HSK/HSKK chuẩn Hanban', isActive: true, updatedAt: '2026-09-01' },
    { id: 'dv-3', code: 'DV_CS_HN', name: 'Trung tâm CTI HSK Cơ sở Hà Nội', description: 'Đơn vị đào tạo và điểm thi chuẩn HSK tại khu vực phía Bắc', isActive: true, updatedAt: '2026-09-01' },
    { id: 'dv-4', code: 'DV_CS_HCM', name: 'Trung tâm CTI HSK Cơ sở TP. Hồ Chí Minh', description: 'Đơn vị đào tạo và điểm thi chuẩn HSK tại khu vực phía Nam', isActive: true, updatedAt: '2026-09-01' },
    { id: 'dv-5', code: 'DV_CS_DN', name: 'Trung tâm CTI HSK Cơ sở Đà Nẵng', description: 'Đơn vị đào tạo và phát triển học viên khu vực miền Trung', isActive: true, updatedAt: '2026-09-01' },
    { id: 'dv-6', code: 'DV_HCNS', name: 'Phòng Hành chính - Nhân sự & Pháp chế', description: 'Quản lý hồ sơ cán bộ, tuyển dụng, chấm công và chế độ đãi ngộ', isActive: true, updatedAt: '2026-09-01' },
    { id: 'dv-7', code: 'DV_TCKT', name: 'Phòng Tài chính - Kế toán', description: 'Quản lý ngân sách, hạch toán lương thưởng, BHXH và thuế', isActive: true, updatedAt: '2026-09-01' },
    { id: 'dv-8', code: 'DV_TSTT', name: 'Phòng Tuyển sinh & Hợp tác Du học Trung Quốc', description: 'Tư vấn khóa học HSK và hồ sơ học bổng CSC/CIS', isActive: true, updatedAt: '2026-09-01' }
  ],
  tinh_trang_hon_nhan: [
    { id: 'hn-1', code: 'HN_DOCTHAN', name: 'Độc thân', description: 'Chưa đăng ký kết hôn', isActive: true, updatedAt: '2026-09-01' },
    { id: 'hn-2', code: 'HN_DAKETHON', name: 'Đã kết hôn', description: 'Đã đăng ký kết hôn theo quy định pháp luật', isActive: true, updatedAt: '2026-09-01' },
    { id: 'hn-3', code: 'HN_LYHON', name: 'Ly hôn', description: 'Đã hoàn tất thủ tục ly hôn', isActive: true, updatedAt: '2026-09-01' },
    { id: 'hn-4', code: 'HN_KHAC', name: 'Khác / Đơn thân nuôi con', description: 'Trường hợp khác phục vụ kê khai giảm trừ gia cảnh', isActive: true, updatedAt: '2026-09-01' }
  ],
  dan_toc: [
    { id: 'dt-1', code: 'DT_KINH', name: 'Kinh', description: 'Dân tộc Kinh (Việt Nam)', isActive: true, updatedAt: '2026-09-01' },
    { id: 'dt-2', code: 'DT_HOA', name: 'Hoa (Hán)', description: 'Dân tộc Hoa hoặc chuyên gia bản ngữ Trung Quốc', isActive: true, updatedAt: '2026-09-01' },
    { id: 'dt-3', code: 'DT_TAY', name: 'Tày', description: 'Dân tộc Tày', isActive: true, updatedAt: '2026-09-01' },
    { id: 'dt-4', code: 'DT_NUNG', name: 'Nùng', description: 'Dân tộc Nùng', isActive: true, updatedAt: '2026-09-01' },
    { id: 'dt-5', code: 'DT_MUONG', name: 'Mường', description: 'Dân tộc Mường', isActive: true, updatedAt: '2026-09-01' },
    { id: 'dt-6', code: 'DT_THAI', name: 'Thái', description: 'Dân tộc Thái', isActive: true, updatedAt: '2026-09-01' }
  ],
  ton_giao: [
    { id: 'tg-1', code: 'TG_KHONG', name: 'Không tôn giáo', description: 'Không theo tôn giáo nào', isActive: true, updatedAt: '2026-09-01' },
    { id: 'tg-2', code: 'TG_PHATGIAO', name: 'Phật giáo', description: 'Tín đồ Phật giáo', isActive: true, updatedAt: '2026-09-01' },
    { id: 'tg-3', code: 'TG_CONGGIAO', name: 'Công giáo', description: 'Tín đồ Công giáo', isActive: true, updatedAt: '2026-09-01' },
    { id: 'tg-4', code: 'TG_TINLANH', name: 'Tin Lành', description: 'Tín đồ Tin Lành', isActive: true, updatedAt: '2026-09-01' }
  ],
  chuc_danh_chuc_vu: [
    { id: 'cv-1', code: 'CV_GDHT', name: 'Giám đốc Hệ thống CTI HSK', description: 'Điều hành toàn diện hoạt động đào tạo và khảo thí', allowance: 6000000, coefficient: 2.0, isActive: true, updatedAt: '2026-09-01' },
    { id: 'cv-2', code: 'CV_PGDCM', name: 'Phó Giám đốc Chuyên môn & Khảo thí', description: 'Phụ trách học thuật HSK và hội đồng thi', allowance: 4500000, coefficient: 1.6, isActive: true, updatedAt: '2026-09-01' },
    { id: 'cv-3', code: 'CV_GDCS', name: 'Giám đốc Cơ sở Đào tạo', description: 'Quản lý vận hành cơ sở Hà Nội / TP.HCM / Đà Nẵng', allowance: 3500000, coefficient: 1.4, isActive: true, updatedAt: '2026-09-01' },
    { id: 'cv-4', code: 'CV_TPNS', name: 'Trưởng phòng Hành chính - Nhân sự', description: 'Quản trị nguồn nhân lực, danh mục và tiền lương', allowance: 3000000, coefficient: 1.3, isActive: true, updatedAt: '2026-09-01' },
    { id: 'cv-5', code: 'CV_KTT', name: 'Kế toán trưởng / Phụ trách Tài chính', description: 'Kiểm soát bảng lương, bảo hiểm và quyết toán thuế', allowance: 3000000, coefficient: 1.3, isActive: true, updatedAt: '2026-09-01' },
    { id: 'cv-6', code: 'CV_TBM_HSK', name: 'Trưởng bộ môn HSK Cao cấp (HSK 5-6-7-9)', description: 'Chủ nhiệm bộ môn luyện thi HSK cao cấp và HSKK', allowance: 2500000, coefficient: 1.2, isActive: true, updatedAt: '2026-09-01' },
    { id: 'cv-7', code: 'CV_GVCH', name: 'Giảng viên Cơ hữu HSK', description: 'Giảng viên biên chế giảng dạy các lớp HSK tiêu chuẩn', allowance: 1500000, coefficient: 1.1, isActive: true, updatedAt: '2026-09-01' },
    { id: 'cv-8', code: 'CV_CVKT', name: 'Chuyên viên Khảo thí & Giám thị HSK', description: 'Tổ chức thi HSK trên máy (iBT) và trên giấy', allowance: 1200000, coefficient: 1.0, isActive: true, updatedAt: '2026-09-01' },
    { id: 'cv-9', code: 'CV_CVTS', name: 'Chuyên viên Tư vấn Tuyển sinh & Du học', description: 'Tư vấn lộ trình học HSK và hồ sơ học bổng Trung Quốc', allowance: 1000000, coefficient: 1.0, isActive: true, updatedAt: '2026-09-01' }
  ],
  chuc_vu_dang: [
    { id: 'cvd-1', code: 'CVD_BT', name: 'Bí thư Chi bộ', description: 'Lãnh đạo Chi bộ cơ sở tại hệ thống giáo dục CTI HSK', isActive: true, updatedAt: '2026-09-01' },
    { id: 'cvd-2', code: 'CVD_PBT', name: 'Phó Bí thư Chi bộ', description: 'Phụ trách công tác kiểm tra và phát triển Đảng viên', isActive: true, updatedAt: '2026-09-01' },
    { id: 'cvd-3', code: 'CVD_CUV', name: 'Chi ủy viên', description: 'Ủy viên Ban chấp hành Chi bộ', isActive: true, updatedAt: '2026-09-01' },
    { id: 'cvd-4', code: 'CVD_DV', name: 'Đảng viên chính thức', description: 'Đảng viên sinh hoạt tại Chi bộ', isActive: true, updatedAt: '2026-09-01' },
    { id: 'cvd-5', code: 'CVD_QC', name: 'Quần chúng ưu tú', description: 'Chưa kết nạp Đảng', isActive: true, updatedAt: '2026-09-01' }
  ],
  chuc_vu_doan: [
    { id: 'doan-1', code: 'DOAN_BT', name: 'Bí thư Chi đoàn / Chủ tịch Công đoàn', description: 'Trưởng ban chấp hành Đoàn thanh niên / Công đoàn cơ sở', isActive: true, updatedAt: '2026-09-01' },
    { id: 'doan-2', code: 'DOAN_PBT', name: 'Phó Bí thư Chi đoàn / Phó Chủ tịch Công đoàn', description: 'Phụ trách phong trào văn hóa Hán ngữ và đời sống cán bộ', isActive: true, updatedAt: '2026-09-01' },
    { id: 'doan-3', code: 'DOAN_UV', name: 'Ủy viên Ban chấp hành', description: 'Ủy viên phụ trách công tác thanh niên, công đoàn', isActive: true, updatedAt: '2026-09-01' },
    { id: 'doan-4', code: 'DOAN_DV', name: 'Đoàn viên / Công đoàn viên', description: 'Thành viên sinh hoạt định kỳ', isActive: true, updatedAt: '2026-09-01' }
  ],
  cong_viec_chuyen_mon: [
    { id: 'cvcm-1', code: 'CM_GD_HSK_CC', name: 'Giảng dạy HSK 5 - HSK 6 & HSKK Cao cấp', description: 'Đào tạo học viên trình độ cao cấp và luyện thi học bổng Thạc sĩ/Tiến sĩ', isActive: true, updatedAt: '2026-09-01' },
    { id: 'cvcm-2', code: 'CM_GD_HSK_SC', name: 'Giảng dạy HSK 1 - HSK 4 & Giao tiếp chuẩn', description: 'Đào tạo nền tảng ngữ âm, chữ Hán và HSK sơ - trung cấp', isActive: true, updatedAt: '2026-09-01' },
    { id: 'cvcm-3', code: 'CM_KHAOTHI_IBT', name: 'Quản trị Hội đồng thi & Kỹ thuật HSK iBT', description: 'Vận hành hệ thống máy chủ phòng thi HSK trực tuyến và bảo mật đề thi', isActive: true, updatedAt: '2026-09-01' },
    { id: 'cvcm-4', code: 'CM_BIENSOAN_GT', name: 'Nghiên cứu & Biên soạn Giáo trình Chuẩn HSK', description: 'Phát triển ngân hàng đề thi thử HSK và học liệu số CTI', isActive: true, updatedAt: '2026-09-01' },
    { id: 'cvcm-5', code: 'CM_QTNS_LUONG', name: 'Quản trị Nhân sự, Chấm công & Chính sách C&B', description: 'Quản lý danh mục hồ sơ, tính lương tự động và đánh giá KPI', isActive: true, updatedAt: '2026-09-01' },
    { id: 'cvcm-6', code: 'CM_KETOAN_THUE', name: 'Kế toán Tổng hợp, Tiền lương & Quyết toán Thuế', description: 'Hạch toán chi phí lương, BHXH và tài chính trung tâm', isActive: true, updatedAt: '2026-09-01' },
    { id: 'cvcm-7', code: 'CM_TUVAN_DUHOC', name: 'Tư vấn Tuyển sinh HSK & Hồ sơ Du học CSC/CIS', description: 'Tư vấn khóa học và xử lý hồ sơ xin học bổng Chính phủ Trung Quốc', isActive: true, updatedAt: '2026-09-01' }
  ],
  trinh_do_chuyen_mon: [
    { id: 'tdcm-1', code: 'TD_TIENSI', name: 'Tiến sĩ (Ph.D)', description: 'Tiến sĩ Ngôn ngữ học / Giáo dục Hán ngữ Quốc tế', isActive: true, updatedAt: '2026-09-01' },
    { id: 'tdcm-2', code: 'TD_THACSI', name: 'Thạc sĩ (M.A / MTCSOL)', description: 'Thạc sĩ Giảng dạy Hán ngữ Quốc tế / Quản trị giáo dục', isActive: true, updatedAt: '2026-09-01' },
    { id: 'tdcm-3', code: 'TD_CUNHAN', name: 'Đại học / Cử nhân (B.A)', description: 'Cử nhân Ngôn ngữ Trung Quốc, Sư phạm, Kinh tế, Tài chính', isActive: true, updatedAt: '2026-09-01' },
    { id: 'tdcm-4', code: 'TD_CAODANG', name: 'Cao đẳng', description: 'Tốt nghiệp hệ Cao đẳng chuyên nghiệp', isActive: true, updatedAt: '2026-09-01' }
  ],
  nganh_dao_tao: [
    { id: 'ndt-1', code: 'NG_GD_HANNGU', name: 'Giáo dục Hán ngữ Quốc tế (MTCSOL / BTCSOL)', description: 'Chuyên ngành chuẩn đào tạo giảng viên HSK quốc tế', isActive: true, updatedAt: '2026-09-01' },
    { id: 'ndt-2', code: 'NG_SP_TRUNG', name: 'Sư phạm Tiếng Trung Quốc', description: 'Chuyên ngành phương pháp giảng dạy tiếng Trung', isActive: true, updatedAt: '2026-09-01' },
    { id: 'ndt-3', code: 'NG_NN_TRUNG', name: 'Ngôn ngữ Trung Quốc & Biên phiên dịch', description: 'Chuyên ngành ngôn ngữ, văn hóa và dịch thuật Hán ngữ', isActive: true, updatedAt: '2026-09-01' },
    { id: 'ndt-4', code: 'NG_QTNL', name: 'Quản trị Nhân lực & Tổ chức Giáo dục', description: 'Chuyên ngành quản lý nhân sự, lao động tiền lương', isActive: true, updatedAt: '2026-09-01' },
    { id: 'ndt-5', code: 'NG_TCKT', name: 'Tài chính - Kế toán & Kiểm toán', description: 'Chuyên ngành kế toán doanh nghiệp và quản trị tài chính', isActive: true, updatedAt: '2026-09-01' },
    { id: 'ndt-6', code: 'NG_CNTT', name: 'Công nghệ Thông tin & Hệ thống Khảo thí', description: 'Chuyên ngành mạng máy tính, phần mềm khảo thí', isActive: true, updatedAt: '2026-09-01' }
  ],
  truong_dao_tao: [
    { id: 'tr-1', code: 'TR_BLCU', name: 'Đại học Ngôn ngữ Bắc Kinh (BLCU - 北京语言大学)', description: 'Đơn vị sáng lập kỳ thi HSK và đào tạo Hán ngữ hàng đầu thế giới', isActive: true, updatedAt: '2026-09-01' },
    { id: 'tr-2', code: 'TR_PKU', name: 'Đại học Bắc Kinh / Đại học Thanh Hoa (PKU / THU)', description: 'Trường đại học trọng điểm quốc gia Trung Quốc', isActive: true, updatedAt: '2026-09-01' },
    { id: 'tr-3', code: 'TR_ULIS', name: 'Trường Đại học Ngoại ngữ - ĐHQG Hà Nội (ULIS)', description: 'Cơ sở đào tạo sư phạm và ngôn ngữ Trung Quốc hàng đầu Việt Nam', isActive: true, updatedAt: '2026-09-01' },
    { id: 'tr-4', code: 'TR_HANU', name: 'Trường Đại học Hà Nội (HANU)', description: 'Trường đào tạo chuyên sâu biên phiên dịch và Hán ngữ', isActive: true, updatedAt: '2026-09-01' },
    { id: 'tr-5', code: 'TR_HCMUE', name: 'Trường Đại học Sư phạm TP. Hồ Chí Minh (HCMUE)', description: 'Trường trọng điểm đào tạo Sư phạm Tiếng Trung khu vực phía Nam', isActive: true, updatedAt: '2026-09-01' },
    { id: 'tr-6', code: 'TR_NEU_FTU', name: 'ĐH Kinh tế Quốc dân (NEU) / ĐH Ngoại thương (FTU)', description: 'Trường đào tạo khối ngành Quản trị nhân lực, Tài chính, Kinh tế đối ngoại', isActive: true, updatedAt: '2026-09-01' }
  ],
  hinh_thuc_dao_tao: [
    { id: 'ht-1', code: 'HT_CHINHQUY', name: 'Đại học / Sau đại học Chính quy tập trung', description: 'Đào tạo toàn thời gian tập trung tại trường', isActive: true, updatedAt: '2026-09-01' },
    { id: 'ht-2', code: 'HT_HOCBONG_QT', name: 'Du học Học bổng Chính phủ (CSC) / Giáo viên Hán ngữ (CIS)', description: 'Chương trình đào tạo học bổng toàn phần tại Trung Quốc', isActive: true, updatedAt: '2026-09-01' },
    { id: 'ht-3', code: 'HT_LIENKET', name: 'Liên kết Quốc tế 2+2 / 3+1', description: 'Chương trình đồng cấp bằng giữa ĐH Việt Nam và ĐH Trung Quốc', isActive: true, updatedAt: '2026-09-01' },
    { id: 'ht-4', code: 'HT_VLVH', name: 'Vừa làm vừa học / Văn bằng 2', description: 'Đào tạo nâng cao hoặc văn bằng chuyên môn thứ hai', isActive: true, updatedAt: '2026-09-01' }
  ],
  trinh_do_tin_hoc: [
    { id: 'th-1', code: 'TH_KHAOTHI_IBT', name: 'Chứng nhận Quản trị Hệ thống Thi HSK iBT Quốc tế', description: 'Đủ điều kiện vận hành kỹ thuật phòng máy điểm thi HSK trực tuyến', isActive: true, updatedAt: '2026-09-01' },
    { id: 'th-2', code: 'TH_MOS_ICDL', name: 'Chứng chỉ Tin học Quốc tế MOS / IC3 / ICDL', description: 'Thành thạo xử lý dữ liệu Excel nâng cao, trình chiếu và LMS', isActive: true, updatedAt: '2026-09-01' },
    { id: 'th-3', code: 'TH_UDCNTT_NC', name: 'Chuẩn Kỹ năng Sử dụng CNTT Nâng cao (Thông tư 03)', description: 'Chứng chỉ ứng dụng CNTT nâng cao của Bộ TT&TT', isActive: true, updatedAt: '2026-09-01' },
    { id: 'th-4', code: 'TH_UDCNTT_CB', name: 'Chuẩn Kỹ năng Sử dụng CNTT Cơ bản', description: 'Chứng chỉ ứng dụng CNTT cơ bản', isActive: true, updatedAt: '2026-09-01' }
  ],
  ngoai_ngu: [
    { id: 'nn-1', code: 'NN_TRUNG', name: 'Tiếng Trung Quốc (Hán ngữ Phổ thông - 普通话)', description: 'Ngôn ngữ cốt lõi trong toàn hệ thống CTI HSK', isActive: true, updatedAt: '2026-09-01' },
    { id: 'nn-2', code: 'NN_ANH', name: 'Tiếng Anh (English)', description: 'Ngôn ngữ giao tiếp học thuật và đối ngoại quốc tế', isActive: true, updatedAt: '2026-09-01' },
    { id: 'nn-3', code: 'NN_TRUNG_ANH', name: 'Song ngữ Trung - Anh (Chinese & English)', description: 'Sử dụng thành thạo cả Tiếng Trung và Tiếng Anh trong công việc', isActive: true, updatedAt: '2026-09-01' }
  ],
  trinh_do_ngoai_ngu: [
    { id: 'tdnn-1', code: 'HSK_7_9_CTCSOL', name: 'HSK Cấp 7-9 / Chứng chỉ Giáo viên Hán ngữ Quốc tế CTCSOL', description: 'Trình độ Hán ngữ chuyên gia cao cấp & Chứng chỉ nghiệp vụ chuẩn Hanban', allowance: 3500000, coefficient: 1.5, isActive: true, updatedAt: '2026-09-01' },
    { id: 'tdnn-2', code: 'HSK6_HSKK_CC', name: 'HSK 6 (≥ 240 điểm) & HSKK Cao cấp', description: 'Trình độ chuẩn giảng viên chính tại Hệ thống CTI HSK', allowance: 2500000, coefficient: 1.3, isActive: true, updatedAt: '2026-09-01' },
    { id: 'tdnn-3', code: 'HSK6_TIEUCHUAN', name: 'HSK 6 (180 - 239 điểm) & HSKK Trung/Cao cấp', description: 'Đạt chuẩn năng lực Hán ngữ cấp 6', allowance: 1800000, coefficient: 1.2, isActive: true, updatedAt: '2026-09-01' },
    { id: 'tdnn-4', code: 'HSK5_HSKK_TC', name: 'HSK 5 & HSKK Trung cấp', description: 'Trình độ Hán ngữ trung - cao cấp dành cho chuyên viên tư vấn/khảo thí', allowance: 1000000, coefficient: 1.1, isActive: true, updatedAt: '2026-09-01' },
    { id: 'tdnn-5', code: 'IELTS_65_TOEIC', name: 'IELTS ≥ 6.5 / TOEIC ≥ 750 (Khối Hành chính - Tài chính)', description: 'Chứng chỉ tiếng Anh quốc tế dành cho khối vận hành', allowance: 800000, coefficient: 1.0, isActive: true, updatedAt: '2026-09-01' }
  ],
  trinh_do_hoc_van: [
    { id: 'hv-1', code: 'HV_12_12_CHUYEN', name: '12/12 (Tốt nghiệp THPT Chuyên Ngoại ngữ / Chuyên Tỉnh)', description: 'Tốt nghiệp hệ chuyên Tiếng Trung / Ngoại ngữ bậc THPT', isActive: true, updatedAt: '2026-09-01' },
    { id: 'hv-2', code: 'HV_12_12', name: '12/12 (Tốt nghiệp Trung học Phổ thông)', description: 'Hoàn thành chương trình giáo dục phổ thông 12/12', isActive: true, updatedAt: '2026-09-01' }
  ],
  linh_vuc_cong_tac: [
    { id: 'lv-1', code: 'LV_DAOTAO_HSK', name: 'Đào tạo & Luyện thi Chuẩn HSK / HSKK', description: 'Giảng dạy trực tiếp và trực tuyến các cấp độ HSK 1 - HSK 9', isActive: true, updatedAt: '2026-09-01' },
    { id: 'lv-2', code: 'LV_KHAOTHI_QT', name: 'Tổ chức Khảo thí & Hội đồng Thi HSK Quốc tế', description: 'Quản lý kỳ thi HSK định kỳ, coi thi, giám sát quy chế thi', isActive: true, updatedAt: '2026-09-01' },
    { id: 'lv-3', code: 'LV_RD_HOCLIEU', name: 'Nghiên cứu Phát triển Học liệu & EdTech HSK', description: 'Xây dựng giáo trình CTI HSK và hệ thống luyện đề thông minh', isActive: true, updatedAt: '2026-09-01' },
    { id: 'lv-4', code: 'LV_QUANTRI_VH', name: 'Quản trị Nguồn nhân lực, Tài chính & Vận hành', description: 'Khối hậu cần, nhân sự, kế toán lương và pháp chế', isActive: true, updatedAt: '2026-09-01' },
    { id: 'lv-5', code: 'LV_TUYENSINH_DH', name: 'Tuyển sinh & Tư vấn Học bổng Du học Trung Quốc', description: 'Phát triển học viên và hỗ trợ hồ sơ du học Trung Quốc', isActive: true, updatedAt: '2026-09-01' }
  ],
  noi_dao_tao: [
    { id: 'ndt-loc-1', code: 'NOI_TQ_BK', name: 'Bắc Kinh / Thượng Hải - Trung Quốc (Du học chính quy)', description: 'Đào tạo tại các trường đại học trọng điểm khu vực Bắc Kinh, Thượng Hải', isActive: true, updatedAt: '2026-09-01' },
    { id: 'ndt-loc-2', code: 'NOI_TQ_KHAC', name: 'Các tỉnh/thành khác tại Trung Quốc (Vân Nam, Quảng Tây, Vũ Hán...)', description: 'Đào tạo tại các trường ĐH đối tác tại Trung Quốc', isActive: true, updatedAt: '2026-09-01' },
    { id: 'ndt-loc-3', code: 'NOI_VN_HN', name: 'Hà Nội - Việt Nam', description: 'Đào tạo tại các trường Đại học khu vực Hà Nội', isActive: true, updatedAt: '2026-09-01' },
    { id: 'ndt-loc-4', code: 'NOI_VN_HCM', name: 'TP. Hồ Chí Minh - Việt Nam', description: 'Đào tạo tại các trường Đại học khu vực TP. Hồ Chí Minh', isActive: true, updatedAt: '2026-09-01' }
  ]
};

export type RoleId = 'SUPER_ADMIN' | 'HR_MANAGER' | 'ACCOUNTANT' | 'STAFF';

export interface PermissionMatrix {
  module: string;
  moduleName: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  approve: boolean;
}

export interface RoleDefinition {
  id: RoleId;
  code: string;
  name: string;
  badgeText: string;
  description: string;
  permissions: PermissionMatrix[];
}

export const INITIAL_ROLES: RoleDefinition[] = [
  {
    id: 'SUPER_ADMIN',
    code: 'ROLE_ADMIN',
    name: 'Giám đốc Hệ thống (Super Admin)',
    badgeText: 'Toàn quyền Hệ thống',
    description: 'Toàn quyền quản lý tuyển dụng, hồ sơ nhân sự, phê duyệt điều chuyển phòng ban, khen thưởng kỷ luật, duyệt lương và xuất PHP/MySQL.',
    permissions: [
      { module: 'employees', moduleName: 'Hồ sơ Nhân sự & Sinh nhật', view: true, create: true, edit: true, delete: true, approve: true },
      { module: 'recruitment', moduleName: 'Tuyển dụng & Lịch Phỏng vấn HSK', view: true, create: true, edit: true, delete: true, approve: true },
      { module: 'transfer_reward', moduleName: 'Điều chuyển Công tác & Thưởng/Phạt', view: true, create: true, edit: true, delete: true, approve: true },
      { module: 'catalogs', moduleName: 'Hệ thống 18 Danh mục chuẩn', view: true, create: true, edit: true, delete: true, approve: true },
      { module: 'attendance', moduleName: 'Quản lý Chấm công & Ca thi HSK', view: true, create: true, edit: true, delete: true, approve: true },
      { module: 'payroll', moduleName: 'Báo cáo & Tính lương Tự động', view: true, create: true, edit: true, delete: true, approve: true },
      { module: 'rbac', moduleName: 'Phân quyền Vai trò & Bảo mật', view: true, create: true, edit: true, delete: true, approve: true }
    ]
  },
  {
    id: 'HR_MANAGER',
    code: 'ROLE_HR_MGR',
    name: 'Trưởng phòng Nhân sự (HR Manager)',
    badgeText: 'Quản trị Nhân sự & Tuyển dụng',
    description: 'Quản lý ứng viên, lịch phỏng vấn, tiếp nhận nhân sự mới, xử lý đơn chuyển công tác, khen thưởng kỷ luật, 18 danh mục và chấm công.',
    permissions: [
      { module: 'employees', moduleName: 'Hồ sơ Nhân sự & Sinh nhật', view: true, create: true, edit: true, delete: false, approve: true },
      { module: 'recruitment', moduleName: 'Tuyển dụng & Lịch Phỏng vấn HSK', view: true, create: true, edit: true, delete: true, approve: true },
      { module: 'transfer_reward', moduleName: 'Điều chuyển Công tác & Thưởng/Phạt', view: true, create: true, edit: true, delete: false, approve: true },
      { module: 'catalogs', moduleName: 'Hệ thống 18 Danh mục chuẩn', view: true, create: true, edit: true, delete: false, approve: true },
      { module: 'attendance', moduleName: 'Quản lý Chấm công & Ca thi HSK', view: true, create: true, edit: true, delete: false, approve: true },
      { module: 'payroll', moduleName: 'Báo cáo & Tính lương Tự động', view: true, create: false, edit: false, delete: false, approve: false },
      { module: 'rbac', moduleName: 'Phân quyền Vai trò & Bảo mật', view: true, create: false, edit: false, delete: false, approve: false }
    ]
  },
  {
    id: 'ACCOUNTANT',
    code: 'ROLE_ACC',
    name: 'Kế toán Tiền lương (C&B Accountant)',
    badgeText: 'Chuyên trách Lương & Thuế',
    description: 'Đối soát công thực tế, quyết định khen thưởng/kỷ luật tài chính, chạy động cơ tính lương tự động và xuất báo cáo thanh toán lương.',
    permissions: [
      { module: 'employees', moduleName: 'Hồ sơ Nhân sự & Sinh nhật', view: true, create: false, edit: false, delete: false, approve: false },
      { module: 'recruitment', moduleName: 'Tuyển dụng & Lịch Phỏng vấn HSK', view: true, create: false, edit: false, delete: false, approve: false },
      { module: 'transfer_reward', moduleName: 'Điều chuyển Công tác & Thưởng/Phạt', view: true, create: false, edit: false, delete: false, approve: false },
      { module: 'catalogs', moduleName: 'Hệ thống 18 Danh mục chuẩn', view: true, create: false, edit: false, delete: false, approve: false },
      { module: 'attendance', moduleName: 'Quản lý Chấm công & Ca thi HSK', view: true, create: false, edit: false, delete: false, approve: true },
      { module: 'payroll', moduleName: 'Báo cáo & Tính lương Tự động', view: true, create: true, edit: true, delete: false, approve: true },
      { module: 'rbac', moduleName: 'Phân quyền Vai trò & Bảo mật', view: false, create: false, edit: false, delete: false, approve: false }
    ]
  },
  {
    id: 'STAFF',
    code: 'ROLE_STAFF',
    name: 'Giảng viên / Chuyên viên CTI HSK',
    badgeText: 'Nhân sự Nội bộ',
    description: 'Thực hiện chấm công hàng ngày, tạo đơn xin chuyển công tác, xem quyết định khen thưởng, lịch sinh nhật và phiếu lương cá nhân.',
    permissions: [
      { module: 'employees', moduleName: 'Hồ sơ Nhân sự & Sinh nhật', view: true, create: false, edit: false, delete: false, approve: false },
      { module: 'recruitment', moduleName: 'Tuyển dụng & Lịch Phỏng vấn HSK', view: true, create: false, edit: false, delete: false, approve: false },
      { module: 'transfer_reward', moduleName: 'Điều chuyển Công tác & Thưởng/Phạt', view: true, create: true, edit: false, delete: false, approve: false },
      { module: 'catalogs', moduleName: 'Hệ thống 18 Danh mục chuẩn', view: true, create: false, edit: false, delete: false, approve: false },
      { module: 'attendance', moduleName: 'Quản lý Chấm công & Ca thi HSK', view: true, create: true, edit: false, delete: false, approve: false },
      { module: 'payroll', moduleName: 'Báo cáo & Tính lương Tự động', view: true, create: false, edit: false, delete: false, approve: false },
      { module: 'rbac', moduleName: 'Phân quyền Vai trò & Bảo mật', view: false, create: false, edit: false, delete: false, approve: false }
    ]
  }
];

export interface EmployeeRecord {
  id: string;
  empCode: string;
  fullName: string;
  gender: 'Nam' | 'Nữ';
  birthDate: string;
  email: string;
  phone: string;
  joinDate: string;
  contractType: 'Hợp đồng không xác định thời hạn' | 'Hợp đồng 36 tháng' | 'Hợp đồng 12 tháng' | 'Chuyên gia Quốc tế';
  roleId: RoleId;
  baseSalary: number; // Lương cơ bản theo hợp đồng (VNĐ)
  salaryCoefficient: number; // Hệ số bậc lương
  kpiBonus: number; // Thưởng hiệu suất giảng dạy / coi thi HSK / tuyển sinh
  dependentsCount: number; // Số người phụ thuộc giảm trừ thuế TNCN
  status: 'Đang công tác' | 'Nghỉ thai sản' | 'Tạm hoãn HĐ';
  // Liên kết trực tiếp tới 18 Danh mục chuẩn (lưu mã code của danh mục)
  catalogs: Record<CatalogKey, string>;
}

export const INITIAL_EMPLOYEES: EmployeeRecord[] = [
  {
    id: 'emp-1',
    empCode: 'CTI-HSK-001',
    fullName: 'TS. Nguyễn Minh Hoàng',
    gender: 'Nam',
    birthDate: '1984-09-12',
    email: 'hoang.nm@ctihsk.edu.vn',
    phone: '0912345888',
    joinDate: '2019-03-01',
    contractType: 'Hợp đồng không xác định thời hạn',
    roleId: 'SUPER_ADMIN',
    baseSalary: 32000000,
    salaryCoefficient: 2.34,
    kpiBonus: 5500000,
    dependentsCount: 2,
    status: 'Đang công tác',
    catalogs: {
      don_vi_quan_ly: 'DV_BGD',
      tinh_trang_hon_nhan: 'HN_DAKETHON',
      dan_toc: 'DT_KINH',
      ton_giao: 'TG_KHONG',
      chuc_danh_chuc_vu: 'CV_GDHT',
      chuc_vu_dang: 'CVD_BT',
      chuc_vu_doan: 'DOAN_DV',
      cong_viec_chuyen_mon: 'CM_BIENSOAN_GT',
      trinh_do_chuyen_mon: 'TD_TIENSI',
      nganh_dao_tao: 'NG_GD_HANNGU',
      truong_dao_tao: 'TR_BLCU',
      hinh_thuc_dao_tao: 'HT_HOCBONG_QT',
      trinh_do_tin_hoc: 'TH_KHAOTHI_IBT',
      ngoai_ngu: 'NN_TRUNG_ANH',
      trinh_do_ngoai_ngu: 'HSK_7_9_CTCSOL',
      trinh_do_hoc_van: 'HV_12_12_CHUYEN',
      linh_vuc_cong_tac: 'LV_DAOTAO_HSK',
      noi_dao_tao: 'NOI_TQ_BK'
    }
  },
  {
    id: 'emp-2',
    empCode: 'CTI-HSK-002',
    fullName: 'ThS. Trần Thu Phương',
    gender: 'Nữ',
    birthDate: '1989-09-29',
    email: 'phuong.tt@ctihsk.edu.vn',
    phone: '0988765432',
    joinDate: '2020-06-15',
    contractType: 'Hợp đồng không xác định thời hạn',
    roleId: 'SUPER_ADMIN',
    baseSalary: 25000000,
    salaryCoefficient: 1.86,
    kpiBonus: 4000000,
    dependentsCount: 1,
    status: 'Đang công tác',
    catalogs: {
      don_vi_quan_ly: 'DV_DTKT',
      tinh_trang_hon_nhan: 'HN_DAKETHON',
      dan_toc: 'DT_KINH',
      ton_giao: 'TG_PHATGIAO',
      chuc_danh_chuc_vu: 'CV_PGDCM',
      chuc_vu_dang: 'CVD_PBT',
      chuc_vu_doan: 'DOAN_BT',
      cong_viec_chuyen_mon: 'CM_GD_HSK_CC',
      trinh_do_chuyen_mon: 'TD_THACSI',
      nganh_dao_tao: 'NG_GD_HANNGU',
      truong_dao_tao: 'TR_PKU',
      hinh_thuc_dao_tao: 'HT_HOCBONG_QT',
      trinh_do_tin_hoc: 'TH_KHAOTHI_IBT',
      ngoai_ngu: 'NN_TRUNG_ANH',
      trinh_do_ngoai_ngu: 'HSK_7_9_CTCSOL',
      trinh_do_hoc_van: 'HV_12_12_CHUYEN',
      linh_vuc_cong_tac: 'LV_KHAOTHI_QT',
      noi_dao_tao: 'NOI_TQ_BK'
    }
  },
  {
    id: 'emp-3',
    empCode: 'CTI-HSK-003',
    fullName: 'Lê Hoàng Bích Ngọc',
    gender: 'Nữ',
    birthDate: '1991-10-05',
    email: 'ngoc.lhb@ctihsk.edu.vn',
    phone: '0904112233',
    joinDate: '2021-01-10',
    contractType: 'Hợp đồng 36 tháng',
    roleId: 'HR_MANAGER',
    baseSalary: 19500000,
    salaryCoefficient: 1.55,
    kpiBonus: 2500000,
    dependentsCount: 2,
    status: 'Đang công tác',
    catalogs: {
      don_vi_quan_ly: 'DV_HCNS',
      tinh_trang_hon_nhan: 'HN_DAKETHON',
      dan_toc: 'DT_KINH',
      ton_giao: 'TG_KHONG',
      chuc_danh_chuc_vu: 'CV_TPNS',
      chuc_vu_dang: 'CVD_CUV',
      chuc_vu_doan: 'DOAN_PBT',
      cong_viec_chuyen_mon: 'CM_QTNS_LUONG',
      trinh_do_chuyen_mon: 'TD_THACSI',
      nganh_dao_tao: 'NG_QTNL',
      truong_dao_tao: 'TR_NEU_FTU',
      hinh_thuc_dao_tao: 'HT_CHINHQUY',
      trinh_do_tin_hoc: 'TH_MOS_ICDL',
      ngoai_ngu: 'NN_TRUNG_ANH',
      trinh_do_ngoai_ngu: 'HSK5_HSKK_TC',
      trinh_do_hoc_van: 'HV_12_12',
      linh_vuc_cong_tac: 'LV_QUANTRI_VH',
      noi_dao_tao: 'NOI_VN_HN'
    }
  },
  {
    id: 'emp-4',
    empCode: 'CTI-HSK-004',
    fullName: 'Phạm Đức Anh',
    gender: 'Nam',
    birthDate: '1990-02-19',
    email: 'anh.pd@ctihsk.edu.vn',
    phone: '0936998877',
    joinDate: '2021-04-01',
    contractType: 'Hợp đồng 36 tháng',
    roleId: 'ACCOUNTANT',
    baseSalary: 19000000,
    salaryCoefficient: 1.5,
    kpiBonus: 2200000,
    dependentsCount: 1,
    status: 'Đang công tác',
    catalogs: {
      don_vi_quan_ly: 'DV_TCKT',
      tinh_trang_hon_nhan: 'HN_DAKETHON',
      dan_toc: 'DT_KINH',
      ton_giao: 'TG_KHONG',
      chuc_danh_chuc_vu: 'CV_KTT',
      chuc_vu_dang: 'CVD_DV',
      chuc_vu_doan: 'DOAN_UV',
      cong_viec_chuyen_mon: 'CM_KETOAN_THUE',
      trinh_do_chuyen_mon: 'TD_CUNHAN',
      nganh_dao_tao: 'NG_TCKT',
      truong_dao_tao: 'TR_NEU_FTU',
      hinh_thuc_dao_tao: 'HT_CHINHQUY',
      trinh_do_tin_hoc: 'TH_MOS_ICDL',
      ngoai_ngu: 'NN_ANH',
      trinh_do_ngoai_ngu: 'IELTS_65_TOEIC',
      trinh_do_hoc_van: 'HV_12_12',
      linh_vuc_cong_tac: 'LV_QUANTRI_VH',
      noi_dao_tao: 'NOI_VN_HN'
    }
  },
  {
    id: 'emp-5',
    empCode: 'CTI-HSK-005',
    fullName: 'ThS. Vũ Quỳnh Trang',
    gender: 'Nữ',
    birthDate: '1994-09-28',
    email: 'trang.vq@ctihsk.edu.vn',
    phone: '0977554411',
    joinDate: '2022-02-15',
    contractType: 'Hợp đồng 36 tháng',
    roleId: 'STAFF',
    baseSalary: 18500000,
    salaryCoefficient: 1.45,
    kpiBonus: 3800000,
    dependentsCount: 0,
    status: 'Đang công tác',
    catalogs: {
      don_vi_quan_ly: 'DV_CS_HN',
      tinh_trang_hon_nhan: 'HN_DOCTHAN',
      dan_toc: 'DT_KINH',
      ton_giao: 'TG_KHONG',
      chuc_danh_chuc_vu: 'CV_TBM_HSK',
      chuc_vu_dang: 'CVD_DV',
      chuc_vu_doan: 'DOAN_UV',
      cong_viec_chuyen_mon: 'CM_GD_HSK_CC',
      trinh_do_chuyen_mon: 'TD_THACSI',
      nganh_dao_tao: 'NG_GD_HANNGU',
      truong_dao_tao: 'TR_BLCU',
      hinh_thuc_dao_tao: 'HT_HOCBONG_QT',
      trinh_do_tin_hoc: 'TH_KHAOTHI_IBT',
      ngoai_ngu: 'NN_TRUNG',
      trinh_do_ngoai_ngu: 'HSK6_HSKK_CC',
      trinh_do_hoc_van: 'HV_12_12_CHUYEN',
      linh_vuc_cong_tac: 'LV_DAOTAO_HSK',
      noi_dao_tao: 'NOI_TQ_BK'
    }
  },
  {
    id: 'emp-6',
    empCode: 'CTI-HSK-006',
    fullName: 'Trương Vỹ Hoa (Zhang Weihua)',
    gender: 'Nam',
    birthDate: '1992-10-01',
    email: 'zhangweihua@ctihsk.edu.vn',
    phone: '0965123789',
    joinDate: '2022-09-01',
    contractType: 'Chuyên gia Quốc tế',
    roleId: 'STAFF',
    baseSalary: 22000000,
    salaryCoefficient: 1.65,
    kpiBonus: 3200000,
    dependentsCount: 0,
    status: 'Đang công tác',
    catalogs: {
      don_vi_quan_ly: 'DV_CS_HCM',
      tinh_trang_hon_nhan: 'HN_DAKETHON',
      dan_toc: 'DT_HOA',
      ton_giao: 'TG_KHONG',
      chuc_danh_chuc_vu: 'CV_GVCH',
      chuc_vu_dang: 'CVD_QC',
      chuc_vu_doan: 'DOAN_DV',
      cong_viec_chuyen_mon: 'CM_GD_HSK_CC',
      trinh_do_chuyen_mon: 'TD_THACSI',
      nganh_dao_tao: 'NG_GD_HANNGU',
      truong_dao_tao: 'TR_HCMUE',
      hinh_thuc_dao_tao: 'HT_CHINHQUY',
      trinh_do_tin_hoc: 'TH_UDCNTT_NC',
      ngoai_ngu: 'NN_TRUNG_ANH',
      trinh_do_ngoai_ngu: 'HSK_7_9_CTCSOL',
      trinh_do_hoc_van: 'HV_12_12',
      linh_vuc_cong_tac: 'LV_DAOTAO_HSK',
      noi_dao_tao: 'NOI_TQ_KHAC'
    }
  },
  {
    id: 'emp-7',
    empCode: 'CTI-HSK-007',
    fullName: 'Hoàng Minh Tuấn',
    gender: 'Nam',
    birthDate: '1996-05-22',
    email: 'tuan.hm@ctihsk.edu.vn',
    phone: '0943221100',
    joinDate: '2023-03-10',
    contractType: 'Hợp đồng 36 tháng',
    roleId: 'STAFF',
    baseSalary: 14500000,
    salaryCoefficient: 1.2,
    kpiBonus: 2100000,
    dependentsCount: 0,
    status: 'Đang công tác',
    catalogs: {
      don_vi_quan_ly: 'DV_DTKT',
      tinh_trang_hon_nhan: 'HN_DOCTHAN',
      dan_toc: 'DT_TAY',
      ton_giao: 'TG_KHONG',
      chuc_danh_chuc_vu: 'CV_CVKT',
      chuc_vu_dang: 'CVD_QC',
      chuc_vu_doan: 'DOAN_DV',
      cong_viec_chuyen_mon: 'CM_KHAOTHI_IBT',
      trinh_do_chuyen_mon: 'TD_CUNHAN',
      nganh_dao_tao: 'NG_CNTT',
      truong_dao_tao: 'TR_HANU',
      hinh_thuc_dao_tao: 'HT_CHINHQUY',
      trinh_do_tin_hoc: 'TH_KHAOTHI_IBT',
      ngoai_ngu: 'NN_TRUNG',
      trinh_do_ngoai_ngu: 'HSK5_HSKK_TC',
      trinh_do_hoc_van: 'HV_12_12',
      linh_vuc_cong_tac: 'LV_KHAOTHI_QT',
      noi_dao_tao: 'NOI_VN_HN'
    }
  },
  {
    id: 'emp-8',
    empCode: 'CTI-HSK-008',
    fullName: 'Đặng Ngọc Mai Nhi',
    gender: 'Nữ',
    birthDate: '1998-09-14',
    email: 'nhi.dnm@ctihsk.edu.vn',
    phone: '0919887766',
    joinDate: '2024-01-15',
    contractType: 'Hợp đồng 12 tháng',
    roleId: 'STAFF',
    baseSalary: 15000000,
    salaryCoefficient: 1.25,
    kpiBonus: 2900000,
    dependentsCount: 0,
    status: 'Đang công tác',
    catalogs: {
      don_vi_quan_ly: 'DV_CS_DN',
      tinh_trang_hon_nhan: 'HN_DOCTHAN',
      dan_toc: 'DT_KINH',
      ton_giao: 'TG_KHONG',
      chuc_danh_chuc_vu: 'CV_GVCH',
      chuc_vu_dang: 'CVD_QC',
      chuc_vu_doan: 'DOAN_DV',
      cong_viec_chuyen_mon: 'CM_GD_HSK_SC',
      trinh_do_chuyen_mon: 'TD_CUNHAN',
      nganh_dao_tao: 'NG_SP_TRUNG',
      truong_dao_tao: 'TR_ULIS',
      hinh_thuc_dao_tao: 'HT_LIENKET',
      trinh_do_tin_hoc: 'TH_UDCNTT_NC',
      ngoai_ngu: 'NN_TRUNG',
      trinh_do_ngoai_ngu: 'HSK6_TIEUCHUAN',
      trinh_do_hoc_van: 'HV_12_12_CHUYEN',
      linh_vuc_cong_tac: 'LV_DAOTAO_HSK',
      noi_dao_tao: 'NOI_VN_HN'
    }
  }
];

// ============================================================================
// PHÂN HỆ TUYỂN DỤNG: DANH SÁCH ỨNG VIÊN & LỊCH PHỎNG VẤN / GIẢNG THỬ HSK
// ============================================================================

export type CandidateStage =
  | 'Hồ sơ mới'
  | 'Đạt sơ loại CV'
  | 'Chờ phỏng vấn & Giảng thử'
  | 'Đạt - Chờ nhận việc'
  | 'Đã tiếp nhận Nhân sự'
  | 'Không đạt';

export interface CandidateRecord {
  id: string;
  candidateCode: string;
  fullName: string;
  gender: 'Nam' | 'Nữ';
  birthDate: string;
  email: string;
  phone: string;
  appliedUnitCode: string; // Mã đơn vị ứng tuyển (don_vi_quan_ly)
  appliedPositionCode: string; // Mã chức danh ứng tuyển (chuc_danh_chuc_vu)
  hskQualificationCode: string; // Mã trình độ HSK (trinh_do_ngoai_ngu)
  educationLevelCode: string; // Mã trình độ chuyên môn (trinh_do_chuyen_mon)
  universityCode: string; // Mã trường đào tạo (truong_dao_tao)
  expectedSalary: number;
  experienceYears: number;
  stage: CandidateStage;
  appliedDate: string;
  notes: string;
}

export const INITIAL_CANDIDATES: CandidateRecord[] = [
  {
    id: 'cand-1',
    candidateCode: 'UV-CTI-2601',
    fullName: 'ThS. Bùi Phương Linh',
    gender: 'Nữ',
    birthDate: '1996-09-25',
    email: 'linh.bp.hsk@gmail.com',
    phone: '0982114455',
    appliedUnitCode: 'DV_CS_HN',
    appliedPositionCode: 'CV_GVCH',
    hskQualificationCode: 'HSK_7_9_CTCSOL',
    educationLevelCode: 'TD_THACSI',
    universityCode: 'TR_BLCU',
    expectedSalary: 19000000,
    experienceYears: 4,
    stage: 'Đạt - Chờ nhận việc',
    appliedDate: '2026-09-10',
    notes: 'Tốt nghiệp Thạc sĩ MTCSOL ĐH Ngôn ngữ Bắc Kinh, đạt HSK 8 & HSKK Cao cấp 85 điểm.'
  },
  {
    id: 'cand-2',
    candidateCode: 'UV-CTI-2602',
    fullName: 'Lý Gia Hân (Li Jiaxin)',
    gender: 'Nữ',
    birthDate: '1997-11-18',
    email: 'lijiaxin.cn@ctihsk.org',
    phone: '0915667788',
    appliedUnitCode: 'DV_CS_HCM',
    appliedPositionCode: 'CV_GVCH',
    hskQualificationCode: 'HSK_7_9_CTCSOL',
    educationLevelCode: 'TD_THACSI',
    universityCode: 'TR_HCMUE',
    expectedSalary: 21000000,
    experienceYears: 3,
    stage: 'Chờ phỏng vấn & Giảng thử',
    appliedDate: '2026-09-18',
    notes: 'Giảng viên bản ngữ có chứng chỉ CTCSOL quốc tế, đăng ký dạy thử chuyên đề HSKK Cao cấp.'
  },
  {
    id: 'cand-3',
    candidateCode: 'UV-CTI-2603',
    fullName: 'Ngô Quang Huy',
    gender: 'Nam',
    birthDate: '1999-03-14',
    email: 'huy.nq.ibt@gmail.com',
    phone: '0934556611',
    appliedUnitCode: 'DV_DTKT',
    appliedPositionCode: 'CV_CVKT',
    hskQualificationCode: 'HSK6_TIEUCHUAN',
    educationLevelCode: 'TD_CUNHAN',
    universityCode: 'TR_HANU',
    expectedSalary: 15000000,
    experienceYears: 2,
    stage: 'Chờ phỏng vấn & Giảng thử',
    appliedDate: '2026-09-20',
    notes: 'Có kinh nghiệm 2 năm giám thị kỹ thuật phòng thi máy tính HSK iBT.'
  },
  {
    id: 'cand-4',
    candidateCode: 'UV-CTI-2604',
    fullName: 'Đỗ Ngọc Hà',
    gender: 'Nữ',
    birthDate: '2000-09-30',
    email: 'ha.dn.tuyensinh@gmail.com',
    phone: '0971223344',
    appliedUnitCode: 'DV_TSTT',
    appliedPositionCode: 'CV_CVTS',
    hskQualificationCode: 'HSK5_HSKK_TC',
    educationLevelCode: 'TD_CUNHAN',
    universityCode: 'TR_ULIS',
    expectedSalary: 13500000,
    experienceYears: 1,
    stage: 'Đạt sơ loại CV',
    appliedDate: '2026-09-24',
    notes: 'Kỹ năng tư vấn học bổng CSC/CIS tốt, phát âm chuẩn Bắc Kinh.'
  }
];

export interface InterviewScheduleRecord {
  id: string;
  interviewCode: string;
  candidateId: string;
  candidateName: string;
  positionName: string;
  interviewDate: string; // YYYY-MM-DD
  interviewTime: string; // HH:mm
  roundName: 'Vòng 1: Phỏng vấn Năng lực Hán ngữ' | 'Vòng 2: Giảng thử Demo HSK (45 phút)' | 'Vòng 3: Phỏng vấn Hội đồng & Chốt Offer';
  interviewerEmpId: string;
  interviewerName: string;
  locationOrLink: string;
  demoTopic: string;
  evaluationScore?: number; // Thang điểm 100
  status: 'Sắp diễn ra' | 'Đã hoàn thành - Đạt' | 'Đã hoàn thành - Không đạt' | 'Hoãn lịch';
  feedback: string;
}

export const INITIAL_INTERVIEWS: InterviewScheduleRecord[] = [
  {
    id: 'int-1',
    interviewCode: 'PV-HSK-01',
    candidateId: 'cand-1',
    candidateName: 'ThS. Bùi Phương Linh',
    positionName: 'Giảng viên Cơ hữu HSK',
    interviewDate: '2026-09-16',
    interviewTime: '09:30',
    roundName: 'Vòng 2: Giảng thử Demo HSK (45 phút)',
    interviewerEmpId: 'emp-2',
    interviewerName: 'ThS. Trần Thu Phương',
    locationOrLink: 'Phòng Hội thảo A2 - CTI HSK Cơ sở Hà Nội',
    demoTopic: 'Kỹ năng viết luận HSK 6 (缩写 - Tóm tắt văn bản 400 chữ)',
    evaluationScore: 94,
    status: 'Đã hoàn thành - Đạt',
    feedback: 'Phát âm chuẩn xác, phương pháp phân tích cấu trúc ngữ pháp HSK 6 rất logic, tương tác học viên xuất sắc.'
  },
  {
    id: 'int-2',
    interviewCode: 'PV-HSK-02',
    candidateId: 'cand-2',
    candidateName: 'Lý Gia Hân (Li Jiaxin)',
    positionName: 'Giảng viên Cơ hữu HSK',
    interviewDate: '2026-09-29',
    interviewTime: '14:00',
    roundName: 'Vòng 2: Giảng thử Demo HSK (45 phút)',
    interviewerEmpId: 'emp-1',
    interviewerName: 'TS. Nguyễn Minh Hoàng',
    locationOrLink: 'Phòng Demo VIP 1 - CTI HSK Cơ sở TP.HCM & Zoom',
    demoTopic: 'Phương pháp phản xạ khẩu ngữ HSKK Cao cấp',
    evaluationScore: undefined,
    status: 'Sắp diễn ra',
    feedback: 'Hội đồng chuyên môn chuẩn bị phiếu chấm điểm giảng thử tiêu chuẩn CTI.'
  },
  {
    id: 'int-3',
    interviewCode: 'PV-HSK-03',
    candidateId: 'cand-3',
    candidateName: 'Ngô Quang Huy',
    positionName: 'Chuyên viên Khảo thí & Giám thị HSK',
    interviewDate: '2026-09-30',
    interviewTime: '10:00',
    roundName: 'Vòng 1: Phỏng vấn Năng lực Hán ngữ',
    interviewerEmpId: 'emp-2',
    interviewerName: 'ThS. Trần Thu Phương',
    locationOrLink: 'Văn phòng Hội đồng Khảo thí HSK Quốc tế',
    demoTopic: 'Xử lý sự cố kỹ thuật phòng máy thi HSK iBT & Quy chế bảo mật đề thi',
    evaluationScore: undefined,
    status: 'Sắp diễn ra',
    feedback: 'Kiểm tra kỹ năng vận hành máy chủ khảo thí và giao tiếp tiếng Trung.'
  }
];

// ============================================================================
// PHÂN HỆ XIN CHUYỂN CÔNG TÁC (ĐIỀU CHUYỂN PHÒNG BAN / CƠ SỞ)
// ============================================================================

export interface TransferRequestRecord {
  id: string;
  requestCode: string;
  empId: string;
  empCode: string;
  empName: string;
  fromUnitCode: string;
  toUnitCode: string;
  fromPositionCode: string;
  toPositionCode: string;
  requestDate: string;
  effectiveDate: string;
  reason: string;
  status: 'Chờ phê duyệt' | 'Đã phê duyệt & Cập nhật Hồ sơ' | 'Từ chối';
  approvedBy?: string;
}

export const INITIAL_TRANSFERS: TransferRequestRecord[] = [
  {
    id: 'trf-1',
    requestCode: 'DC-CTI-2026-01',
    empId: 'emp-8',
    empCode: 'CTI-HSK-008',
    empName: 'Đặng Ngọc Mai Nhi',
    fromUnitCode: 'DV_CS_DN',
    toUnitCode: 'DV_CS_HN',
    fromPositionCode: 'CV_GVCH',
    toPositionCode: 'CV_TBM_HSK',
    requestDate: '2026-09-20',
    effectiveDate: '2026-10-01',
    reason: 'Tăng cường giảng viên nòng cốt và đảm nhận vị trí Trưởng bộ môn HSK tại Cơ sở Hà Nội phục vụ đợt thi HSK mùa Thu.',
    status: 'Chờ phê duyệt'
  },
  {
    id: 'trf-2',
    requestCode: 'DC-CTI-2026-02',
    empId: 'emp-7',
    empCode: 'CTI-HSK-007',
    empName: 'Hoàng Minh Tuấn',
    fromUnitCode: 'DV_CS_HN',
    toUnitCode: 'DV_DTKT',
    fromPositionCode: 'CV_CVKT',
    toPositionCode: 'CV_CVKT',
    requestDate: '2026-09-02',
    effectiveDate: '2026-09-10',
    reason: 'Điều động chuyên trách quản trị hạ tầng phòng thi máy tính HSK iBT tại Hội đồng Đào tạo & Khảo thí Quốc tế.',
    status: 'Đã phê duyệt & Cập nhật Hồ sơ',
    approvedBy: 'TS. Nguyễn Minh Hoàng'
  }
];

// ============================================================================
// PHÂN HỆ KHEN THƯỞNG VÀ KỶ LUẬT (LIÊN THÔNG TÍNH LƯƠNG TỰ ĐỘNG)
// ============================================================================

export interface RewardDisciplineRecord {
  id: string;
  decisionCode: string;
  empId: string;
  empCode: string;
  empName: string;
  type: 'REWARD' | 'DISCIPLINE';
  categoryTitle: string;
  reason: string;
  amount: number; // Số tiền thưởng (+) hoặc phạt khấu trừ lương (-)
  appliedMonth: string; // YYYY-MM (liên thông trực tiếp vào kỳ lương)
  decisionDate: string;
  signedBy: string;
  status: 'Đã duyệt áp dụng Lương' | 'Chờ duyệt';
}

export const INITIAL_REWARDS_DISCIPLINES: RewardDisciplineRecord[] = [
  {
    id: 'rd-1',
    decisionCode: 'QĐKT-09/2026-01',
    empId: 'emp-5',
    empCode: 'CTI-HSK-005',
    empName: 'ThS. Vũ Quỳnh Trang',
    type: 'REWARD',
    categoryTitle: 'Danh hiệu Giảng viên Xuất sắc Kỳ thi HSK Tháng 09',
    reason: '100% học viên lớp luyện thi HSK 6 đạt từ 220 điểm trở lên và 5 học viên đỗ học bổng CSC.',
    amount: 3000000,
    appliedMonth: '2026-09',
    decisionDate: '2026-09-22',
    signedBy: 'TS. Nguyễn Minh Hoàng',
    status: 'Đã duyệt áp dụng Lương'
  },
  {
    id: 'rd-2',
    decisionCode: 'QĐKT-09/2026-02',
    empId: 'emp-6',
    empCode: 'CTI-HSK-006',
    empName: 'Trương Vỹ Hoa (Zhang Weihua)',
    type: 'REWARD',
    categoryTitle: 'Thưởng Sáng kiến Biên soạn Ngân hàng Đề thi HSK 7-9',
    reason: 'Hoàn thành bộ 15 đề thi thử HSK 7-9 chuẩn khung năng lực Hán ngữ mới sớm hơn tiến độ 2 tuần.',
    amount: 2500000,
    appliedMonth: '2026-09',
    decisionDate: '2026-09-24',
    signedBy: 'TS. Nguyễn Minh Hoàng',
    status: 'Đã duyệt áp dụng Lương'
  },
  {
    id: 'rd-3',
    decisionCode: 'QĐKL-09/2026-01',
    empId: 'emp-7',
    empCode: 'CTI-HSK-007',
    empName: 'Hoàng Minh Tuấn',
    type: 'DISCIPLINE',
    categoryTitle: 'Nhắc nhở & Chế tài Chậm bàn giao Biên bản Phòng máy iBT',
    reason: 'Nộp biên bản đối soát thiết bị tai nghe phòng thi HSKK chậm 18 giờ so với quy định khảo thí.',
    amount: 500000,
    appliedMonth: '2026-09',
    decisionDate: '2026-09-19',
    signedBy: 'ThS. Trần Thu Phương',
    status: 'Đã duyệt áp dụng Lương'
  }
];

export type AttendanceStatusCode = 'X' | 'P' | 'M' | 'N' | 'TC';

export interface AttendanceRecord {
  empId: string;
  month: string; // e.g. '2026-09'
  standardDays: number; // Công chuẩn trong tháng (26 công)
  presentDays: number; // Số ngày đi làm đủ công
  paidLeaveDays: number; // Số ngày nghỉ phép hưởng lương (P)
  unpaidLeaveDays: number; // Số ngày nghỉ không lương (N)
  lateCount: number; // Số lần đi muộn (M) -> phạt 100.000đ/lần
  overtimeHours: number; // Giờ tăng ca / coi thi HSK cuối tuần (TC)
  todayCheckIn?: string;
  todayCheckOut?: string;
  recentDays: Record<number, AttendanceStatusCode>;
  isLocked: boolean;
}

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    empId: 'emp-1',
    month: '2026-09',
    standardDays: 26,
    presentDays: 26,
    paidLeaveDays: 0,
    unpaidLeaveDays: 0,
    lateCount: 0,
    overtimeHours: 12,
    todayCheckIn: '07:52',
    todayCheckOut: '17:45',
    recentDays: { 1: 'X', 2: 'X', 3: 'X', 4: 'X', 5: 'X', 6: 'TC', 7: 'X', 8: 'X', 9: 'X', 10: 'X', 11: 'X', 12: 'TC', 13: 'X', 14: 'X' },
    isLocked: false
  },
  {
    empId: 'emp-2',
    month: '2026-09',
    standardDays: 26,
    presentDays: 25,
    paidLeaveDays: 1,
    unpaidLeaveDays: 0,
    lateCount: 0,
    overtimeHours: 16,
    todayCheckIn: '07:55',
    todayCheckOut: '18:10',
    recentDays: { 1: 'X', 2: 'X', 3: 'P', 4: 'X', 5: 'X', 6: 'TC', 7: 'X', 8: 'X', 9: 'X', 10: 'X', 11: 'X', 12: 'TC', 13: 'X', 14: 'X' },
    isLocked: false
  },
  {
    empId: 'emp-3',
    month: '2026-09',
    standardDays: 26,
    presentDays: 25,
    paidLeaveDays: 1,
    unpaidLeaveDays: 0,
    lateCount: 1,
    overtimeHours: 8,
    todayCheckIn: '08:00',
    todayCheckOut: '17:35',
    recentDays: { 1: 'X', 2: 'M', 3: 'X', 4: 'X', 5: 'P', 6: 'X', 7: 'X', 8: 'X', 9: 'X', 10: 'X', 11: 'X', 12: 'TC', 13: 'X', 14: 'X' },
    isLocked: false
  },
  {
    empId: 'emp-4',
    month: '2026-09',
    standardDays: 26,
    presentDays: 26,
    paidLeaveDays: 0,
    unpaidLeaveDays: 0,
    lateCount: 0,
    overtimeHours: 10,
    todayCheckIn: '07:58',
    todayCheckOut: '17:40',
    recentDays: { 1: 'X', 2: 'X', 3: 'X', 4: 'X', 5: 'X', 6: 'X', 7: 'X', 8: 'X', 9: 'X', 10: 'X', 11: 'X', 12: 'TC', 13: 'X', 14: 'X' },
    isLocked: false
  },
  {
    empId: 'emp-5',
    month: '2026-09',
    standardDays: 26,
    presentDays: 24,
    paidLeaveDays: 1,
    unpaidLeaveDays: 1,
    lateCount: 1,
    overtimeHours: 20,
    todayCheckIn: '08:04',
    todayCheckOut: '18:30',
    recentDays: { 1: 'X', 2: 'X', 3: 'X', 4: 'N', 5: 'X', 6: 'TC', 7: 'X', 8: 'M', 9: 'X', 10: 'P', 11: 'X', 12: 'TC', 13: 'X', 14: 'X' },
    isLocked: false
  },
  {
    empId: 'emp-6',
    month: '2026-09',
    standardDays: 26,
    presentDays: 26,
    paidLeaveDays: 0,
    unpaidLeaveDays: 0,
    lateCount: 0,
    overtimeHours: 18,
    todayCheckIn: '07:50',
    todayCheckOut: '17:30',
    recentDays: { 1: 'X', 2: 'X', 3: 'X', 4: 'X', 5: 'X', 6: 'TC', 7: 'X', 8: 'X', 9: 'X', 10: 'X', 11: 'X', 12: 'TC', 13: 'X', 14: 'X' },
    isLocked: false
  },
  {
    empId: 'emp-7',
    month: '2026-09',
    standardDays: 26,
    presentDays: 25,
    paidLeaveDays: 0,
    unpaidLeaveDays: 1,
    lateCount: 2,
    overtimeHours: 24,
    todayCheckIn: '08:12',
    todayCheckOut: '18:00',
    recentDays: { 1: 'X', 2: 'M', 3: 'X', 4: 'X', 5: 'X', 6: 'TC', 7: 'N', 8: 'M', 9: 'X', 10: 'X', 11: 'X', 12: 'TC', 13: 'X', 14: 'X' },
    isLocked: false
  },
  {
    empId: 'emp-8',
    month: '2026-09',
    standardDays: 26,
    presentDays: 25,
    paidLeaveDays: 1,
    unpaidLeaveDays: 0,
    lateCount: 0,
    overtimeHours: 14,
    todayCheckIn: '07:56',
    todayCheckOut: '17:30',
    recentDays: { 1: 'X', 2: 'X', 3: 'X', 4: 'P', 5: 'X', 6: 'TC', 7: 'X', 8: 'X', 9: 'X', 10: 'X', 11: 'X', 12: 'TC', 13: 'X', 14: 'X' },
    isLocked: false
  }
];

export interface CalculatedPayroll {
  empId: string;
  empCode: string;
  fullName: string;
  unitName: string;
  positionName: string;
  hskLevelName: string;
  standardDays: number;
  paidWorkDays: number; // presentDays + paidLeaveDays
  overtimeHours: number;
  baseSalary: number;
  proratedBaseSalary: number; // Lương theo ngày công thực tế
  positionAllowance: number; // Lấy tự động từ Danh mục chức danh, chức vụ
  hskAllowance: number; // Lấy tự động từ Danh mục trình độ ngoại ngữ (HSK)
  overtimePay: number; // Lương tăng ca / coi thi HSK (150% đơn giá giờ)
  kpiBonus: number;
  rewardBonus: number; // Cộng tự động từ Quyết định Khen thưởng trong kỳ
  disciplinePenalty: number; // Trừ tự động từ Quyết định Kỷ luật trong kỳ
  grossSalary: number;
  insuranceDeduction: number; // 10.5% BHXH (8%) + BHYT (1.5%) + BHTN (1%)
  latePenalty: number; // 100,000đ / lần đi muộn
  personalIncomeTax: number; // Thuế TNCN tự động sau giảm trừ bản thân 11tr + 4.4tr/người phụ thuộc
  totalDeductions: number;
  netSalary: number;
}

export function computeEmployeePayroll(
  emp: EmployeeRecord,
  att: AttendanceRecord | undefined,
  catalogs: Record<CatalogKey, CatalogItem[]>,
  rewardsDisciplines: RewardDisciplineRecord[] = []
): CalculatedPayroll {
  const standardDays = att?.standardDays || 26;
  const paidWorkDays = Math.min(standardDays, (att?.presentDays || 0) + (att?.paidLeaveDays || 0));
  const overtimeHours = att?.overtimeHours || 0;
  const lateCount = att?.lateCount || 0;

  const unitItem = catalogs.don_vi_quan_ly.find((i) => i.code === emp.catalogs.don_vi_quan_ly);
  const posItem = catalogs.chuc_danh_chuc_vu.find((i) => i.code === emp.catalogs.chuc_danh_chuc_vu);
  const hskItem = catalogs.trinh_do_ngoai_ngu.find((i) => i.code === emp.catalogs.trinh_do_ngoai_ngu);

  const dailyRate = emp.baseSalary / standardDays;
  const hourlyRate = dailyRate / 8;

  const proratedBaseSalary = Math.round(dailyRate * paidWorkDays);
  const positionAllowance = posItem?.allowance || 0;
  const hskAllowance = hskItem?.allowance || 0;
  const overtimePay = Math.round(overtimeHours * hourlyRate * 1.5);
  const kpiBonus = emp.kpiBonus || 0;

  // Tổng hợp Khen thưởng & Kỷ luật đã duyệt của nhân sự
  const empRDs = rewardsDisciplines.filter(
    (rd) => rd.empId === emp.id && rd.status === 'Đã duyệt áp dụng Lương'
  );
  const rewardBonus = empRDs
    .filter((rd) => rd.type === 'REWARD')
    .reduce((sum, rd) => sum + rd.amount, 0);
  const disciplinePenalty = empRDs
    .filter((rd) => rd.type === 'DISCIPLINE')
    .reduce((sum, rd) => sum + rd.amount, 0);

  const grossSalary =
    proratedBaseSalary + positionAllowance + hskAllowance + overtimePay + kpiBonus + rewardBonus;

  // Khấu trừ Bảo hiểm bắt buộc 10.5% trên mức lương cơ bản đóng BHXH
  const insuranceDeduction = Math.round(emp.baseSalary * 0.105);
  const latePenalty = lateCount * 100000;

  // Tính thuế TNCN: Giảm trừ bản thân 11.000.000đ + 4.400.000đ * số người phụ thuộc
  const personalRelief = 11000000 + emp.dependentsCount * 4400000;
  const taxableIncome = Math.max(0, grossSalary - insuranceDeduction - personalRelief);

  let personalIncomeTax = 0;
  if (taxableIncome > 0) {
    if (taxableIncome <= 5000000) {
      personalIncomeTax = Math.round(taxableIncome * 0.05);
    } else if (taxableIncome <= 10000000) {
      personalIncomeTax = Math.round(250000 + (taxableIncome - 5000000) * 0.1);
    } else if (taxableIncome <= 18000000) {
      personalIncomeTax = Math.round(750000 + (taxableIncome - 10000000) * 0.15);
    } else {
      personalIncomeTax = Math.round(1950000 + (taxableIncome - 18000000) * 0.2);
    }
  }

  const totalDeductions =
    insuranceDeduction + latePenalty + disciplinePenalty + personalIncomeTax;
  const netSalary = grossSalary - totalDeductions;

  return {
    empId: emp.id,
    empCode: emp.empCode,
    fullName: emp.fullName,
    unitName: unitItem?.name || emp.catalogs.don_vi_quan_ly,
    positionName: posItem?.name || emp.catalogs.chuc_danh_chuc_vu,
    hskLevelName: hskItem?.name || emp.catalogs.trinh_do_ngoai_ngu,
    standardDays,
    paidWorkDays,
    overtimeHours,
    baseSalary: emp.baseSalary,
    proratedBaseSalary,
    positionAllowance,
    hskAllowance,
    overtimePay,
    kpiBonus,
    rewardBonus,
    disciplinePenalty,
    grossSalary,
    insuranceDeduction,
    latePenalty,
    personalIncomeTax,
    totalDeductions,
    netSalary
  };
}

export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(Math.round(amount)) + ' ₫';
}
