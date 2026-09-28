import {
  CATALOG_DEFINITIONS,
  CatalogItem,
  CatalogKey,
  EmployeeRecord,
  AttendanceRecord,
  RoleDefinition,
  CandidateRecord,
  InterviewScheduleRecord,
  TransferRequestRecord,
  RewardDisciplineRecord,
  computeEmployeePayroll
} from '../data/hrData';

export function generateMySQLSchemaAndSeed(
  catalogs: Record<CatalogKey, CatalogItem[]>,
  employees: EmployeeRecord[],
  roles: RoleDefinition[],
  attendance: AttendanceRecord[],
  candidates: CandidateRecord[] = [],
  interviews: InterviewScheduleRecord[] = [],
  transfers: TransferRequestRecord[] = [],
  rewardsDisciplines: RewardDisciplineRecord[] = []
): string {
  const lines: string[] = [];

  lines.push(`-- ============================================================================`);
  lines.push(`-- HỆ THỐNG QUẢN LÝ NHÂN SỰ, TUYỂN DỤNG, ĐIỀU CHUYỂN, KHEN THƯỞNG & LƯƠNG CTI HSK`);
  lines.push(`-- Engine: MySQL 8.0+ / MariaDB 10.6+ (InnoDB, utf8mb4_unicode_ci)`);
  lines.push(`-- Bao gồm: 18 Danh mục chuẩn + Hồ sơ & Sinh nhật + Tuyển dụng/Phỏng vấn`);
  lines.push(`--          + Xin chuyển công tác + Khen thưởng/Kỷ luật + Chấm công & Lương tự động`);
  lines.push(`-- Tự động sinh từ dữ liệu thực tế lúc: ${new Date().toISOString()}`);
  lines.push(`-- ============================================================================\n`);

  lines.push(`CREATE DATABASE IF NOT EXISTS \`cti_hsk_hrms\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
  lines.push(`USE \`cti_hsk_hrms\`;\n`);
  lines.push(`SET NAMES utf8mb4;`);
  lines.push(`SET FOREIGN_KEY_CHECKS = 0;\n`);

  // 1. Tạo 18 bảng Danh mục chuẩn
  lines.push(`-- ----------------------------------------------------------------------------`);
  lines.push(`-- PHẦN 1: KHỞI TẠO 18 BẢNG DANH MỤC NHÂN SỰ CHUẨN CTI HSK`);
  lines.push(`-- ----------------------------------------------------------------------------\n`);

  for (const def of CATALOG_DEFINITIONS) {
    lines.push(`-- ${def.index}. ${def.title} (${def.mysqlTable})`);
    lines.push(`DROP TABLE IF EXISTS \`${def.mysqlTable}\`;`);
    lines.push(`CREATE TABLE \`${def.mysqlTable}\` (`);
    lines.push(`  \`id\` VARCHAR(36) NOT NULL,`);
    lines.push(`  \`ma_danh_muc\` VARCHAR(50) NOT NULL UNIQUE COMMENT 'Mã định danh danh mục',`);
    lines.push(`  \`ten_danh_muc\` VARCHAR(255) NOT NULL COMMENT '${def.title}',`);
    lines.push(`  \`mo_ta\` TEXT DEFAULT NULL,`);
    if (def.hasAllowance) {
      lines.push(`  \`muc_phu_cap\` DECIMAL(15,2) NOT NULL DEFAULT 0.00 COMMENT 'Phụ cấp định mức hàng tháng (VNĐ)',`);
      lines.push(`  \`he_so_phu_cap\` DECIMAL(5,2) NOT NULL DEFAULT 1.00 COMMENT 'Hệ số phụ cấp',`);
    }
    lines.push(`  \`trang_thai\` TINYINT(1) NOT NULL DEFAULT 1,`);
    lines.push(`  \`ngay_cap_nhat\` DATE DEFAULT (CURRENT_DATE),`);
    lines.push(`  PRIMARY KEY (\`ma_danh_muc\`)`);
    lines.push(`) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n`);

    const items = catalogs[def.key] || [];
    if (items.length > 0) {
      for (const item of items) {
        const safeName = item.name.replace(/'/g, "''");
        const safeDesc = item.description.replace(/'/g, "''");
        if (def.hasAllowance) {
          lines.push(
            `INSERT INTO \`${def.mysqlTable}\` (\`id\`, \`ma_danh_muc\`, \`ten_danh_muc\`, \`mo_ta\`, \`muc_phu_cap\`, \`he_so_phu_cap\`, \`trang_thai\`, \`ngay_cap_nhat\`) VALUES ('${item.id}', '${item.code}', '${safeName}', '${safeDesc}', ${item.allowance || 0}, ${item.coefficient || 1.0}, ${item.isActive ? 1 : 0}, '${item.updatedAt}');`
          );
        } else {
          lines.push(
            `INSERT INTO \`${def.mysqlTable}\` (\`id\`, \`ma_danh_muc\`, \`ten_danh_muc\`, \`mo_ta\`, \`trang_thai\`, \`ngay_cap_nhat\`) VALUES ('${item.id}', '${item.code}', '${safeName}', '${safeDesc}', ${item.isActive ? 1 : 0}, '${item.updatedAt}');`
          );
        }
      }
      lines.push(``);
    }
  }

  // 2. Bảng Phân quyền Vai trò (RBAC)
  lines.push(`-- ----------------------------------------------------------------------------`);
  lines.push(`-- PHẦN 2: BẢNG VAI TRÒ & MA TRẬN PHÂN QUYỀN (RBAC)`);
  lines.push(`-- ----------------------------------------------------------------------------\n`);
  lines.push(`DROP TABLE IF EXISTS \`sys_vai_tro_phan_quyen\`;`);
  lines.push(`CREATE TABLE \`sys_vai_tro_phan_quyen\` (`);
  lines.push(`  \`role_id\` VARCHAR(32) NOT NULL,`);
  lines.push(`  \`ma_vai_tro\` VARCHAR(50) NOT NULL UNIQUE,`);
  lines.push(`  \`ten_vai_tro\` VARCHAR(150) NOT NULL,`);
  lines.push(`  \`mo_ta\` TEXT DEFAULT NULL,`);
  lines.push(`  \`permissions_json\` JSON NOT NULL COMMENT 'Ma trận quyền Xem/Thêm/Sửa/Xóa/Duyệt',`);
  lines.push(`  PRIMARY KEY (\`role_id\`)`);
  lines.push(`) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n`);

  for (const r of roles) {
    const jsonStr = JSON.stringify(r.permissions).replace(/'/g, "''");
    lines.push(
      `INSERT INTO \`sys_vai_tro_phan_quyen\` (\`role_id\`, \`ma_vai_tro\`, \`ten_vai_tro\`, \`mo_ta\`, \`permissions_json\`) VALUES ('${r.id}', '${r.code}', '${r.name.replace(/'/g, "''")}', '${r.description.replace(/'/g, "''")}', '${jsonStr}');`
    );
  }
  lines.push(``);

  // 3. Bảng Hồ sơ Nhân sự (Liên kết khóa ngoại tới 18 Danh mục + Quản lý Sinh nhật)
  lines.push(`-- ----------------------------------------------------------------------------`);
  lines.push(`-- PHẦN 3: BẢNG HỒ SƠ NHÂN SỰ & THEO DÕI SINH NHẬT (18 KHÓA NGOẠI DANH MỤC)`);
  lines.push(`-- ----------------------------------------------------------------------------\n`);
  lines.push(`DROP TABLE IF EXISTS \`hr_nhan_vien\`;`);
  lines.push(`CREATE TABLE \`hr_nhan_vien\` (`);
  lines.push(`  \`id\` VARCHAR(36) NOT NULL,`);
  lines.push(`  \`ma_nhan_vien\` VARCHAR(30) NOT NULL UNIQUE,`);
  lines.push(`  \`ho_va_ten\` VARCHAR(150) NOT NULL,`);
  lines.push(`  \`gioi_tinh\` ENUM('Nam', 'Nữ') NOT NULL,`);
  lines.push(`  \`ngay_sinh\` DATE NOT NULL COMMENT 'Phục vụ truy vấn chúc mừng & chế độ sinh nhật tháng',`);
  lines.push(`  \`email\` VARCHAR(150) NOT NULL UNIQUE,`);
  lines.push(`  \`so_dien_thoai\` VARCHAR(25) NOT NULL,`);
  lines.push(`  \`ngay_vao_lam\` DATE NOT NULL,`);
  lines.push(`  \`loai_hop_dong\` VARCHAR(100) NOT NULL,`);
  lines.push(`  \`role_id\` VARCHAR(32) NOT NULL,`);
  lines.push(`  \`luong_co_ban\` DECIMAL(15,2) NOT NULL DEFAULT 0.00,`);
  lines.push(`  \`he_so_luong\` DECIMAL(5,2) NOT NULL DEFAULT 1.00,`);
  lines.push(`  \`thuong_kpi_dinh_muc\` DECIMAL(15,2) NOT NULL DEFAULT 0.00,`);
  lines.push(`  \`so_nguoi_phu_thuoc\` INT NOT NULL DEFAULT 0,`);
  lines.push(`  \`trang_thai_lam_viec\` VARCHAR(50) NOT NULL DEFAULT 'Đang công tác',`);
  lines.push(`  -- 18 Trường Khóa Ngoại liên kết 18 Danh mục Nhân sự chuẩn`);
  for (const def of CATALOG_DEFINITIONS) {
    lines.push(`  \`ma_${def.key}\` VARCHAR(50) NOT NULL COMMENT '${def.title}',`);
  }
  lines.push(`  PRIMARY KEY (\`id\`),`);
  lines.push(`  INDEX \`idx_thang_sinh_nhat\` ((MONTH(\`ngay_sinh\`))),`);
  lines.push(`  CONSTRAINT \`fk_nv_role\` FOREIGN KEY (\`role_id\`) REFERENCES \`sys_vai_tro_phan_quyen\` (\`role_id\`),`);
  CATALOG_DEFINITIONS.forEach((def, idx) => {
    const comma = idx === CATALOG_DEFINITIONS.length - 1 ? '' : ',';
    lines.push(
      `  CONSTRAINT \`fk_nv_${def.key}\` FOREIGN KEY (\`ma_${def.key}\`) REFERENCES \`${def.mysqlTable}\` (\`ma_danh_muc\`) ON UPDATE CASCADE${comma}`
    );
  });
  lines.push(`) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n`);

  for (const emp of employees) {
    const catCols = CATALOG_DEFINITIONS.map((d) => `\`ma_${d.key}\``).join(', ');
    const catVals = CATALOG_DEFINITIONS.map((d) => `'${emp.catalogs[d.key]}'`).join(', ');
    lines.push(
      `INSERT INTO \`hr_nhan_vien\` (\`id\`, \`ma_nhan_vien\`, \`ho_va_ten\`, \`gioi_tinh\`, \`ngay_sinh\`, \`email\`, \`so_dien_thoai\`, \`ngay_vao_lam\`, \`loai_hop_dong\`, \`role_id\`, \`luong_co_ban\`, \`he_so_luong\`, \`thuong_kpi_dinh_muc\`, \`so_nguoi_phu_thuoc\`, \`trang_thai_lam_viec\`, ${catCols}) VALUES ('${emp.id}', '${emp.empCode}', '${emp.fullName.replace(/'/g, "''")}', '${emp.gender}', '${emp.birthDate}', '${emp.email}', '${emp.phone}', '${emp.joinDate}', '${emp.contractType}', '${emp.roleId}', ${emp.baseSalary}, ${emp.salaryCoefficient}, ${emp.kpiBonus}, ${emp.dependentsCount}, '${emp.status}', ${catVals});`
    );
  }
  lines.push(``);

  // 4. Bảng Tuyển dụng: Danh sách Ứng viên & Lịch phỏng vấn / Giảng thử HSK
  lines.push(`-- ----------------------------------------------------------------------------`);
  lines.push(`-- PHẦN 4: TUYỂN DỤNG — DANH SÁCH ỨNG VIÊN & LỊCH PHỎNG VẤN / GIẢNG THỬ HSK`);
  lines.push(`-- ----------------------------------------------------------------------------\n`);
  lines.push(`DROP TABLE IF EXISTS \`hr_ung_vien\`;`);
  lines.push(`CREATE TABLE \`hr_ung_vien\` (`);
  lines.push(`  \`id\` VARCHAR(36) NOT NULL,`);
  lines.push(`  \`ma_ung_vien\` VARCHAR(30) NOT NULL UNIQUE,`);
  lines.push(`  \`ho_va_ten\` VARCHAR(150) NOT NULL,`);
  lines.push(`  \`gioi_tinh\` ENUM('Nam', 'Nữ') NOT NULL,`);
  lines.push(`  \`ngay_sinh\` DATE NOT NULL,`);
  lines.push(`  \`email\` VARCHAR(150) NOT NULL,`);
  lines.push(`  \`so_dien_thoai\` VARCHAR(25) NOT NULL,`);
  lines.push(`  \`ma_don_vi_ung_tuyen\` VARCHAR(50) NOT NULL,`);
  lines.push(`  \`ma_chuc_danh_ung_tuyen\` VARCHAR(50) NOT NULL,`);
  lines.push(`  \`ma_trinh_do_hsk\` VARCHAR(50) NOT NULL,`);
  lines.push(`  \`ma_trinh_do_chuyen_mon\` VARCHAR(50) NOT NULL,`);
  lines.push(`  \`ma_truong_dao_tao\` VARCHAR(50) NOT NULL,`);
  lines.push(`  \`muc_luong_ky_vong\` DECIMAL(15,2) NOT NULL DEFAULT 0.00,`);
  lines.push(`  \`so_nam_kinh_nghiem\` INT NOT NULL DEFAULT 0,`);
  lines.push(`  \`trang_thai_ung_tuyen\` VARCHAR(60) NOT NULL,`);
  lines.push(`  \`ngay_nop_ho_so\` DATE NOT NULL,`);
  lines.push(`  \`ghi_chu_chuyen_mon\` TEXT DEFAULT NULL,`);
  lines.push(`  PRIMARY KEY (\`id\`),`);
  lines.push(`  CONSTRAINT \`fk_uv_dv\` FOREIGN KEY (\`ma_don_vi_ung_tuyen\`) REFERENCES \`dm_don_vi_quan_ly\` (\`ma_danh_muc\`),`);
  lines.push(`  CONSTRAINT \`fk_uv_cv\` FOREIGN KEY (\`ma_chuc_danh_ung_tuyen\`) REFERENCES \`dm_chuc_danh_chuc_vu\` (\`ma_danh_muc\`),`);
  lines.push(`  CONSTRAINT \`fk_uv_hsk\` FOREIGN KEY (\`ma_trinh_do_hsk\`) REFERENCES \`dm_trinh_do_ngoai_ngu\` (\`ma_danh_muc\`)`);
  lines.push(`) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n`);

  for (const c of candidates) {
    lines.push(
      `INSERT INTO \`hr_ung_vien\` VALUES ('${c.id}', '${c.candidateCode}', '${c.fullName.replace(/'/g, "''")}', '${c.gender}', '${c.birthDate}', '${c.email}', '${c.phone}', '${c.appliedUnitCode}', '${c.appliedPositionCode}', '${c.hskQualificationCode}', '${c.educationLevelCode}', '${c.universityCode}', ${c.expectedSalary}, ${c.experienceYears}, '${c.stage}', '${c.appliedDate}', '${c.notes.replace(/'/g, "''")}');`
    );
  }
  lines.push(``);

  lines.push(`DROP TABLE IF EXISTS \`hr_lich_phong_van\`;`);
  lines.push(`CREATE TABLE \`hr_lich_phong_van\` (`);
  lines.push(`  \`id\` VARCHAR(36) NOT NULL,`);
  lines.push(`  \`ma_lich_pv\` VARCHAR(30) NOT NULL UNIQUE,`);
  lines.push(`  \`ung_vien_id\` VARCHAR(36) NOT NULL,`);
  lines.push(`  \`vong_phong_van\` VARCHAR(120) NOT NULL,`);
  lines.push(`  \`ngay_phong_van\` DATE NOT NULL,`);
  lines.push(`  \`gio_phong_van\` VARCHAR(10) NOT NULL,`);
  lines.push(`  \`nguoi_phong_van_id\` VARCHAR(36) NOT NULL,`);
  lines.push(`  \`dia_diem_hoac_link\` VARCHAR(255) NOT NULL,`);
  lines.push(`  \`chu_de_giang_thu_hsk\` VARCHAR(255) DEFAULT NULL,`);
  lines.push(`  \`diem_danh_gia\` INT DEFAULT NULL,`);
  lines.push(`  \`ket_qua_pv\` VARCHAR(60) NOT NULL,`);
  lines.push(`  \`nhan_xet_hoi_dong\` TEXT DEFAULT NULL,`);
  lines.push(`  PRIMARY KEY (\`id\`),`);
  lines.push(`  CONSTRAINT \`fk_pv_uv\` FOREIGN KEY (\`ung_vien_id\`) REFERENCES \`hr_ung_vien\` (\`id\`) ON DELETE CASCADE`);
  lines.push(`) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n`);

  for (const iv of interviews) {
    const scoreVal = iv.evaluationScore !== undefined ? iv.evaluationScore : 'NULL';
    lines.push(
      `INSERT INTO \`hr_lich_phong_van\` VALUES ('${iv.id}', '${iv.interviewCode}', '${iv.candidateId}', '${iv.roundName.replace(/'/g, "''")}', '${iv.interviewDate}', '${iv.interviewTime}', '${iv.interviewerEmpId}', '${iv.locationOrLink.replace(/'/g, "''")}', '${iv.demoTopic.replace(/'/g, "''")}', ${scoreVal}, '${iv.status}', '${iv.feedback.replace(/'/g, "''")}');`
    );
  }
  lines.push(``);

  // 5. Bảng Xin chuyển công tác (Điều chuyển Phòng ban / Cơ sở) & Khen thưởng Kỷ luật
  lines.push(`-- ----------------------------------------------------------------------------`);
  lines.push(`-- PHẦN 5: ĐIỀU CHUYỂN CÔNG TÁC (PHÒNG BAN) & QUYẾT ĐỊNH KHEN THƯỞNG / KỶ LUẬT`);
  lines.push(`-- ----------------------------------------------------------------------------\n`);
  lines.push(`DROP TABLE IF EXISTS \`hr_dieu_chuyen_cong_tac\`;`);
  lines.push(`CREATE TABLE \`hr_dieu_chuyen_cong_tac\` (`);
  lines.push(`  \`id\` VARCHAR(36) NOT NULL,`);
  lines.push(`  \`ma_phieu_dieu_chuyen\` VARCHAR(30) NOT NULL UNIQUE,`);
  lines.push(`  \`nhan_vien_id\` VARCHAR(36) NOT NULL,`);
  lines.push(`  \`tu_don_vi\` VARCHAR(50) NOT NULL,`);
  lines.push(`  \`den_don_vi\` VARCHAR(50) NOT NULL,`);
  lines.push(`  \`tu_chuc_vu\` VARCHAR(50) NOT NULL,`);
  lines.push(`  \`den_chuc_vu\` VARCHAR(50) NOT NULL,`);
  lines.push(`  \`ngay_lam_don\` DATE NOT NULL,`);
  lines.push(`  \`ngay_hieu_luc\` DATE NOT NULL,`);
  lines.push(`  \`ly_do_dieu_chuyen\` TEXT NOT NULL,`);
  lines.push(`  \`trang_thai_duyet\` VARCHAR(60) NOT NULL,`);
  lines.push(`  \`nguoi_phe_duyet\` VARCHAR(150) DEFAULT NULL,`);
  lines.push(`  PRIMARY KEY (\`id\`),`);
  lines.push(`  CONSTRAINT \`fk_dc_nv\` FOREIGN KEY (\`nhan_vien_id\`) REFERENCES \`hr_nhan_vien\` (\`id\`) ON DELETE CASCADE`);
  lines.push(`) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n`);

  for (const tr of transfers) {
    const approver = tr.approvedBy ? `'${tr.approvedBy.replace(/'/g, "''")}'` : 'NULL';
    lines.push(
      `INSERT INTO \`hr_dieu_chuyen_cong_tac\` VALUES ('${tr.id}', '${tr.requestCode}', '${tr.empId}', '${tr.fromUnitCode}', '${tr.toUnitCode}', '${tr.fromPositionCode}', '${tr.toPositionCode}', '${tr.requestDate}', '${tr.effectiveDate}', '${tr.reason.replace(/'/g, "''")}', '${tr.status}', ${approver});`
    );
  }
  lines.push(``);

  lines.push(`DROP TABLE IF EXISTS \`hr_khen_thuong_ky_luat\`;`);
  lines.push(`CREATE TABLE \`hr_khen_thuong_ky_luat\` (`);
  lines.push(`  \`id\` VARCHAR(36) NOT NULL,`);
  lines.push(`  \`so_quyet_dinh\` VARCHAR(40) NOT NULL UNIQUE,`);
  lines.push(`  \`nhan_vien_id\` VARCHAR(36) NOT NULL,`);
  lines.push(`  \`loai_quyet_dinh\` ENUM('REWARD', 'DISCIPLINE') NOT NULL COMMENT 'REWARD: Khen thưởng (+), DISCIPLINE: Kỷ luật (-)',`);
  lines.push(`  \`danh_hieu_hinh_thuc\` VARCHAR(255) NOT NULL,`);
  lines.push(`  \`ly_do_chi_tiet\` TEXT NOT NULL,`);
  lines.push(`  \`so_tien\` DECIMAL(15,2) NOT NULL DEFAULT 0.00,`);
  lines.push(`  \`ky_ap_dung_luong\` CHAR(7) NOT NULL COMMENT 'YYYY-MM liên thông trực tiếp vào Bảng lương',`);
  lines.push(`  \`ngay_quyet_dinh\` DATE NOT NULL,`);
  lines.push(`  \`nguoi_ky\` VARCHAR(150) NOT NULL,`);
  lines.push(`  \`trang_thai\` VARCHAR(50) NOT NULL,`);
  lines.push(`  PRIMARY KEY (\`id\`),`);
  lines.push(`  CONSTRAINT \`fk_ktkl_nv\` FOREIGN KEY (\`nhan_vien_id\`) REFERENCES \`hr_nhan_vien\` (\`id\`) ON DELETE CASCADE`);
  lines.push(`) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n`);

  for (const rd of rewardsDisciplines) {
    lines.push(
      `INSERT INTO \`hr_khen_thuong_ky_luat\` VALUES ('${rd.id}', '${rd.decisionCode}', '${rd.empId}', '${rd.type}', '${rd.categoryTitle.replace(/'/g, "''")}', '${rd.reason.replace(/'/g, "''")}', ${rd.amount}, '${rd.appliedMonth}', '${rd.decisionDate}', '${rd.signedBy.replace(/'/g, "''")}', '${rd.status}');`
    );
  }
  lines.push(``);

  // 6. Bảng Chấm công & Bảng Lương tự động
  lines.push(`-- ----------------------------------------------------------------------------`);
  lines.push(`-- PHẦN 6: BẢNG CHẤM CÔNG THÁNG & BẢNG LƯƠNG TỰ ĐỘNG (TÍCH HỢP THƯỞNG/PHẠT)`);
  lines.push(`-- ----------------------------------------------------------------------------\n`);
  lines.push(`DROP TABLE IF EXISTS \`hr_cham_cong_thang\`;`);
  lines.push(`CREATE TABLE \`hr_cham_cong_thang\` (`);
  lines.push(`  \`nhan_vien_id\` VARCHAR(36) NOT NULL,`);
  lines.push(`  \`ky_cham_cong\` CHAR(7) NOT NULL COMMENT 'Định dạng YYYY-MM',`);
  lines.push(`  \`cong_chuan\` INT NOT NULL DEFAULT 26,`);
  lines.push(`  \`ngay_di_lam\` DECIMAL(4,1) NOT NULL DEFAULT 0,`);
  lines.push(`  \`ngay_nghi_phep\` DECIMAL(4,1) NOT NULL DEFAULT 0,`);
  lines.push(`  \`ngay_khong_luong\` DECIMAL(4,1) NOT NULL DEFAULT 0,`);
  lines.push(`  \`so_lan_di_muon\` INT NOT NULL DEFAULT 0,`);
  lines.push(`  \`gio_tang_ca_coi_thi_hsk\` DECIMAL(5,1) NOT NULL DEFAULT 0,`);
  lines.push(`  \`da_chot_cong\` TINYINT(1) NOT NULL DEFAULT 0,`);
  lines.push(`  PRIMARY KEY (\`nhan_vien_id\`, \`ky_cham_cong\`),`);
  lines.push(`  CONSTRAINT \`fk_cc_nv\` FOREIGN KEY (\`nhan_vien_id\`) REFERENCES \`hr_nhan_vien\` (\`id\`) ON DELETE CASCADE`);
  lines.push(`) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n`);

  for (const att of attendance) {
    lines.push(
      `INSERT INTO \`hr_cham_cong_thang\` (\`nhan_vien_id\`, \`ky_cham_cong\`, \`cong_chuan\`, \`ngay_di_lam\`, \`ngay_nghi_phep\`, \`ngay_khong_luong\`, \`so_lan_di_muon\`, \`gio_tang_ca_coi_thi_hsk\`, \`da_chot_cong\`) VALUES ('${att.empId}', '${att.month}', ${att.standardDays}, ${att.presentDays}, ${att.paidLeaveDays}, ${att.unpaidLeaveDays}, ${att.lateCount}, ${att.overtimeHours}, ${att.isLocked ? 1 : 0});`
    );
  }
  lines.push(``);

  lines.push(`DROP TABLE IF EXISTS \`hr_bang_luong_tu_dong\`;`);
  lines.push(`CREATE TABLE \`hr_bang_luong_tu_dong\` (`);
  lines.push(`  \`nhan_vien_id\` VARCHAR(36) NOT NULL,`);
  lines.push(`  \`ky_luong\` CHAR(7) NOT NULL,`);
  lines.push(`  \`cong_huong_luong\` DECIMAL(4,1) NOT NULL,`);
  lines.push(`  \`luong_ngay_cong\` DECIMAL(15,2) NOT NULL,`);
  lines.push(`  \`phu_cap_chuc_vu\` DECIMAL(15,2) NOT NULL,`);
  lines.push(`  \`phu_cap_trinh_do_hsk\` DECIMAL(15,2) NOT NULL,`);
  lines.push(`  \`luong_tang_ca_hsk\` DECIMAL(15,2) NOT NULL,`);
  lines.push(`  \`thuong_kpi\` DECIMAL(15,2) NOT NULL,`);
  lines.push(`  \`thuong_khen_thuong\` DECIMAL(15,2) NOT NULL DEFAULT 0.00,`);
  lines.push(`  \`tong_thu_nhap_gross\` DECIMAL(15,2) NOT NULL,`);
  lines.push(`  \`khau_tru_bhxh_105\` DECIMAL(15,2) NOT NULL,`);
  lines.push(`  \`phat_di_muon\` DECIMAL(15,2) NOT NULL,`);
  lines.push(`  \`phat_ky_luat\` DECIMAL(15,2) NOT NULL DEFAULT 0.00,`);
  lines.push(`  \`thue_tncn\` DECIMAL(15,2) NOT NULL,`);
  lines.push(`  \`thuc_linh_net\` DECIMAL(15,2) NOT NULL,`);
  lines.push(`  PRIMARY KEY (\`nhan_vien_id\`, \`ky_luong\`)`);
  lines.push(`) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n`);

  for (const emp of employees) {
    const att = attendance.find((a) => a.empId === emp.id);
    const p = computeEmployeePayroll(emp, att, catalogs, rewardsDisciplines);
    lines.push(
      `INSERT INTO \`hr_bang_luong_tu_dong\` VALUES ('${emp.id}', '${att?.month || '2026-09'}', ${p.paidWorkDays}, ${p.proratedBaseSalary}, ${p.positionAllowance}, ${p.hskAllowance}, ${p.overtimePay}, ${p.kpiBonus}, ${p.rewardBonus}, ${p.grossSalary}, ${p.insuranceDeduction}, ${p.latePenalty}, ${p.disciplinePenalty}, ${p.personalIncomeTax}, ${p.netSalary});`
    );
  }

  lines.push(`\nSET FOREIGN_KEY_CHECKS = 1;`);
  return lines.join('\n');
}

export const PHP_SOURCE_FILES: Record<string, { filename: string; title: string; description: string; code: string }> = {
  db_config: {
    filename: 'config/Database.php',
    title: 'Kết nối PDO MySQL & Cấu hình Hệ thống',
    description: 'Lớp kết nối cơ sở dữ liệu MySQL chuẩn PDO, chống SQL Injection và ép kiểu UTF-8mb4 cho tiếng Việt & chữ Hán.',
    code: `<?php
/**
 * Hệ thống Quản lý Nhân lực CTI HSK (CTI HSK HRMS)
 * File: config/Database.php
 */
declare(strict_types=1);

namespace CtiHsk\\Config;

use PDO;
use PDOException;

class Database {
    private static ?PDO $instance = null;

    public static function getConnection(): PDO {
        if (self::$instance === null) {
            $host = getenv('DB_HOST') ?: '127.0.0.1';
            $port = getenv('DB_PORT') ?: '3306';
            $dbName = getenv('DB_NAME') ?: 'cti_hsk_hrms';
            $username = getenv('DB_USER') ?: 'root';
            $password = getenv('DB_PASS') ?: '';

            $dsn = "mysql:host={$host};port={$port};dbname={$dbName};charset=utf8mb4";

            try {
                self::$instance = new PDO($dsn, $username, $password, [
                    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES   => false,
                ]);
            } catch (PDOException $e) {
                http_response_code(500);
                die(json_encode([
                    'status' => 'error',
                    'message' => 'Lỗi kết nối MySQL CTI HSK: ' . $e->getMessage()
                ], JSON_UNESCAPED_UNICODE));
            }
        }
        return self::$instance;
    }
}
`
  },
  recruitment_transfer_controller: {
    filename: 'controllers/RecruitmentTransferRewardController.php',
    title: 'Controller Tuyển dụng, Phỏng vấn, Điều chuyển, Khen thưởng & Sinh nhật',
    description: 'Xử lý nghiệp vụ tuyển dụng ứng viên HSK, lịch giảng thử Demo, duyệt xin chuyển công tác tự động cập nhật phòng ban, khen thưởng kỷ luật và danh sách sinh nhật tháng.',
    code: `<?php
/**
 * Hệ thống Quản lý Nhân lực CTI HSK (CTI HSK HRMS)
 * File: controllers/RecruitmentTransferRewardController.php
 * Nghiệp vụ: Tuyển dụng, Lịch phỏng vấn, Sinh nhật, Chuyển công tác & Khen thưởng Kỷ luật
 */
declare(strict_types=1);

namespace CtiHsk\\Controllers;

use CtiHsk\\Config\\Database;
use PDO;

class RecruitmentTransferRewardController {
    /**
     * 1. Truy vấn Danh sách Sinh nhật Nhân sự trong tháng (birthday tracker)
     */
    public function getBirthdaysByMonth(int $month): array {
        $db = Database::getConnection();
        $sql = "
            SELECT 
                nv.id, nv.ma_nhan_vien, nv.ho_va_ten, nv.gioi_tinh, nv.ngay_sinh, nv.email, nv.so_dien_thoai,
                DAY(nv.ngay_sinh) AS ngay_sinh_nhat,
                (YEAR(CURRENT_DATE) - YEAR(nv.ngay_sinh)) AS tuoi_moi,
                dv.ten_danh_muc AS ten_don_vi,
                cv.ten_danh_muc AS ten_chuc_vu
            FROM hr_nhan_vien nv
            LEFT JOIN dm_don_vi_quan_ly dv ON nv.ma_don_vi_quan_ly = dv.ma_danh_muc
            LEFT JOIN dm_chuc_danh_chuc_vu cv ON nv.ma_chuc_danh_chuc_vu = cv.ma_danh_muc
            WHERE MONTH(nv.ngay_sinh) = :month AND nv.trang_thai_lam_viec = 'Đang công tác'
            ORDER BY DAY(nv.ngay_sinh) ASC
        ";
        $stmt = $db->prepare($sql);
        $stmt->execute([':month' => $month]);
        return $stmt->fetchAll();
    }

    /**
     * 2. Tiếp nhận Ứng viên trúng tuyển vào Bảng Hồ sơ Nhân sự chính thức (Transactional)
     */
    public function onboardCandidateToEmployee(string $candidateId, string $newEmpCode): bool {
        $db = Database::getConnection();
        $db->beginTransaction();

        try {
            $stmt = $db->prepare("SELECT * FROM hr_ung_vien WHERE id = :id FOR UPDATE");
            $stmt->execute([':id' => $candidateId]);
            $cand = $stmt->fetch();
            if (!$cand) {
                throw new \\RuntimeException("Không tìm thấy hồ sơ ứng viên.");
            }

            // Cập nhật trạng thái ứng viên
            $upd = $db->prepare("UPDATE hr_ung_vien SET trang_thai_ung_tuyen = 'Đã tiếp nhận Nhân sự' WHERE id = :id");
            $upd->execute([':id' => $candidateId]);

            // Khởi tạo hồ sơ nhân viên mới gắn khóa ngoại 18 danh mục
            $ins = $db->prepare("
                INSERT INTO hr_nhan_vien (
                    id, ma_nhan_vien, ho_va_ten, gioi_tinh, ngay_sinh, email, so_dien_thoai,
                    ngay_vao_lam, loai_hop_dong, role_id, luong_co_ban, he_so_luong, thuong_kpi_dinh_muc,
                    ma_don_vi_quan_ly, ma_chuc_danh_chuc_vu, ma_trinh_do_ngoai_ngu, ma_trinh_do_chuyen_mon, ma_truong_dao_tao,
                    ma_tinh_trang_hon_nhan, ma_dan_toc, ma_ton_giao, ma_chuc_vu_dang, ma_chuc_vu_doan,
                    ma_cong_viec_chuyen_mon, ma_nganh_dao_tao, ma_hinh_thuc_dao_tao, ma_trinh_do_tin_hoc,
                    ma_ngoai_ngu, ma_trinh_do_hoc_van, ma_linh_vuc_cong_tac, ma_noi_dao_tao
                ) VALUES (
                    :id, :emp_code, :full_name, :gender, :birth_date, :email, :phone,
                    CURRENT_DATE, 'Hợp đồng 12 tháng', 'STAFF', :salary, 1.25, 2000000,
                    :unit, :pos, :hsk, :edu, :uni,
                    'HN_DOCTHAN', 'DT_KINH', 'TG_KHONG', 'CVD_QC', 'DOAN_DV',
                    'CM_GD_HSK_CC', 'NG_GD_HANNGU', 'HT_CHINHQUY', 'TH_UDCNTT_NC',
                    'NN_TRUNG', 'HV_12_12', 'LV_DAOTAO_HSK', 'NOI_VN_HN'
                )
            ");
            $ins->execute([
                ':id'         => uniqid('emp_'),
                ':emp_code'   => $newEmpCode,
                ':full_name'  => $cand['ho_va_ten'],
                ':gender'     => $cand['gioi_tinh'],
                ':birth_date' => $cand['ngay_sinh'],
                ':email'      => $cand['email'],
                ':phone'      => $cand['so_dien_thoai'],
                ':salary'     => $cand['muc_luong_ky_vong'],
                ':unit'       => $cand['ma_don_vi_ung_tuyen'],
                ':pos'        => $cand['ma_chuc_danh_ung_tuyen'],
                ':hsk'        => $cand['ma_trinh_do_hsk'],
                ':edu'        => $cand['ma_trinh_do_chuyen_mon'],
                ':uni'        => $cand['ma_truong_dao_tao'],
            ]);

            $db->commit();
            return true;
        } catch (\\Throwable $e) {
            $db->rollBack();
            throw $e;
        }
    }

    /**
     * 3. Phê duyệt Đơn xin chuyển công tác (Tự động cập nhật Đơn vị & Chức vụ mới vào hr_nhan_vien)
     */
    public function approveDepartmentTransfer(string $transferId, string $approverName): bool {
        $db = Database::getConnection();
        $db->beginTransaction();

        try {
            $stmt = $db->prepare("SELECT * FROM hr_dieu_chuyen_cong_tac WHERE id = :id FOR UPDATE");
            $stmt->execute([':id' => $transferId]);
            $trf = $stmt->fetch();
            if (!$trf) {
                throw new \\RuntimeException("Không tìm thấy phiếu xin chuyển công tác.");
            }

            // 1. Đánh dấu phiếu đã phê duyệt
            $updTrf = $db->prepare("
                UPDATE hr_dieu_chuyen_cong_tac 
                SET trang_thai_duyet = 'Đã phê duyệt & Cập nhật Hồ sơ', nguoi_phe_duyet = :approver
                WHERE id = :id
            ");
            $updTrf->execute([':approver' => $approverName, ':id' => $transferId]);

            // 2. Tự động cập nhật Đơn vị quản lý và Chức danh mới cho nhân viên
            $updEmp = $db->prepare("
                UPDATE hr_nhan_vien
                SET ma_don_vi_quan_ly = :new_unit, ma_chuc_danh_chuc_vu = :new_pos
                WHERE id = :emp_id
            ");
            $updEmp->execute([
                ':new_unit' => $trf['den_don_vi'],
                ':new_pos'  => $trf['den_chuc_vu'],
                ':emp_id'   => $trf['nhan_vien_id'],
            ]);

            $db->commit();
            return true;
        } catch (\\Throwable $e) {
            $db->rollBack();
            throw $e;
        }
    }
}
`
  },
  catalog_controller: {
    filename: 'controllers/CatalogController.php',
    title: 'Controller Quản lý 18 Danh mục Nhân sự Chuẩn',
    description: 'Xử lý lấy danh sách, thêm mới, cập nhật và khóa/mở khóa cho toàn bộ 18 bảng danh mục trong MySQL.',
    code: `<?php
/**
 * Hệ thống Quản lý Nhân lực CTI HSK (CTI HSK HRMS)
 * File: controllers/CatalogController.php
 * Quản lý tập trung 18 Danh mục Nhân sự chuẩn
 */
declare(strict_types=1);

namespace CtiHsk\\Controllers;

use CtiHsk\\Config\\Database;
use PDO;

class CatalogController {
    private const ALLOWED_CATALOGS = [
        'don_vi_quan_ly'       => ['table' => 'dm_don_vi_quan_ly', 'has_allowance' => false],
        'tinh_trang_hon_nhan'  => ['table' => 'dm_tinh_trang_hon_nhan', 'has_allowance' => false],
        'dan_toc'              => ['table' => 'dm_dan_toc', 'has_allowance' => false],
        'ton_giao'             => ['table' => 'dm_ton_giao', 'has_allowance' => false],
        'chuc_danh_chuc_vu'    => ['table' => 'dm_chuc_danh_chuc_vu', 'has_allowance' => true],
        'chuc_vu_dang'         => ['table' => 'dm_chuc_vu_dang', 'has_allowance' => false],
        'chuc_vu_doan'         => ['table' => 'dm_chuc_vu_doan', 'has_allowance' => false],
        'cong_viec_chuyen_mon' => ['table' => 'dm_cong_viec_chuyen_mon', 'has_allowance' => false],
        'trinh_do_chuyen_mon'  => ['table' => 'dm_trinh_do_chuyen_mon', 'has_allowance' => false],
        'nganh_dao_tao'        => ['table' => 'dm_nganh_dao_tao', 'has_allowance' => false],
        'truong_dao_tao'       => ['table' => 'dm_truong_dao_tao', 'has_allowance' => false],
        'hinh_thuc_dao_tao'    => ['table' => 'dm_hinh_thuc_dao_tao', 'has_allowance' => false],
        'trinh_do_tin_hoc'     => ['table' => 'dm_trinh_do_tin_hoc', 'has_allowance' => false],
        'ngoai_ngu'            => ['table' => 'dm_ngoai_ngu', 'has_allowance' => false],
        'trinh_do_ngoai_ngu'   => ['table' => 'dm_trinh_do_ngoai_ngu', 'has_allowance' => true],
        'trinh_do_hoc_van'     => ['table' => 'dm_trinh_do_hoc_van', 'has_allowance' => false],
        'linh_vuc_cong_tac'    => ['table' => 'dm_linh_vuc_cong_tac', 'has_allowance' => false],
        'noi_dao_tao'          => ['table' => 'dm_noi_dao_tao', 'has_allowance' => false],
    ];

    public function listByCatalogKey(string $catalogKey): array {
        if (!isset(self::ALLOWED_CATALOGS[$catalogKey])) {
            throw new \\InvalidArgumentException("Danh mục không hợp lệ: {$catalogKey}");
        }
        $table = self::ALLOWED_CATALOGS[$catalogKey]['table'];
        $db = Database::getConnection();
        $stmt = $db->query("SELECT * FROM \`{$table}\` ORDER BY \`ma_danh_muc\` ASC");
        return $stmt->fetchAll();
    }
}
`
  },
  payroll_service: {
    filename: 'services/PayrollAutoService.php',
    title: 'Động cơ Tính lương Tự động & Tích hợp Thưởng/Kỷ luật (PHP 8)',
    description: 'Tự động kết nối Nhân sự + Phụ cấp Chức vụ + Phụ cấp HSK + Chấm công + Quyết định Khen thưởng/Kỷ luật để tính Gross, BHXH 10.5%, Thuế TNCN và Thực lĩnh Net.',
    code: `<?php
/**
 * Hệ thống Quản lý Nhân lực CTI HSK (CTI HSK HRMS)
 * File: services/PayrollAutoService.php
 * Tự động tổng hợp công, phụ cấp 18 danh mục, quyết định khen thưởng/kỷ luật và tính lương
 */
declare(strict_types=1);

namespace CtiHsk\\Services;

use CtiHsk\\Config\\Database;
use PDO;

class PayrollAutoService {
    public function generateMonthlyPayroll(string $month): array {
        $db = Database::getConnection();

        $sql = "
            SELECT 
                nv.id AS emp_id,
                nv.ma_nhan_vien,
                nv.ho_va_ten,
                nv.luong_co_ban,
                nv.thuong_kpi_dinh_muc,
                nv.so_nguoi_phu_thuoc,
                COALESCE(cv.muc_phu_cap, 0) AS phu_cap_chuc_vu,
                COALESCE(nn.muc_phu_cap, 0) AS phu_cap_hsk,
                COALESCE(cc.cong_chuan, 26) AS cong_chuan,
                COALESCE(cc.ngay_di_lam, 26) AS ngay_di_lam,
                COALESCE(cc.ngay_nghi_phep, 0) AS ngay_nghi_phep,
                COALESCE(cc.so_lan_di_muon, 0) AS so_lan_di_muon,
                COALESCE(cc.gio_tang_ca_coi_thi_hsk, 0) AS gio_tang_ca,
                COALESCE((
                    SELECT SUM(so_tien) FROM hr_khen_thuong_ky_luat kt
                    WHERE kt.nhan_vien_id = nv.id AND kt.ky_ap_dung_luong = :m1
                      AND kt.loai_quyet_dinh = 'REWARD' AND kt.trang_thai = 'Đã duyệt áp dụng Lương'
                ), 0) AS tong_khen_thuong,
                COALESCE((
                    SELECT SUM(so_tien) FROM hr_khen_thuong_ky_luat kl
                    WHERE kl.nhan_vien_id = nv.id AND kl.ky_ap_dung_luong = :m2
                      AND kl.loai_quyet_dinh = 'DISCIPLINE' AND kl.trang_thai = 'Đã duyệt áp dụng Lương'
                ), 0) AS tong_ky_luat
            FROM hr_nhan_vien nv
            LEFT JOIN dm_chuc_danh_chuc_vu cv ON nv.ma_chuc_danh_chuc_vu = cv.ma_danh_muc
            LEFT JOIN dm_trinh_do_ngoai_ngu nn ON nv.ma_trinh_do_ngoai_ngu = nn.ma_danh_muc
            LEFT JOIN hr_cham_cong_thang cc ON nv.id = cc.nhan_vien_id AND cc.ky_cham_cong = :m3
            WHERE nv.trang_thai_lam_viec = 'Đang công tác'
            ORDER BY nv.ma_nhan_vien ASC
        ";

        $stmt = $db->prepare($sql);
        $stmt->execute([':m1' => $month, ':m2' => $month, ':m3' => $month]);
        return $stmt->fetchAll();
    }
}
`
  }
};
