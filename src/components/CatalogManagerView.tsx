import React, { useState, useMemo } from 'react';
import {
  CATALOG_DEFINITIONS,
  CatalogDefinition,
  CatalogItem,
  CatalogKey,
  EmployeeRecord,
  formatVND
} from '../data/hrData';
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  Database,
  Layers,
  AlertCircle
} from 'lucide-react';

interface CatalogManagerViewProps {
  catalogs: Record<CatalogKey, CatalogItem[]>;
  employees: EmployeeRecord[];
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  onSaveCatalogItem: (key: CatalogKey, item: CatalogItem, isNew: boolean) => void;
  onDeleteCatalogItem: (key: CatalogKey, itemId: string) => void;
}

export const CatalogManagerView: React.FC<CatalogManagerViewProps> = ({
  catalogs,
  employees,
  canCreate,
  canEdit,
  canDelete,
  onSaveCatalogItem,
  onDeleteCatalogItem
}) => {
  const [selectedKey, setSelectedKey] = useState<CatalogKey>('don_vi_quan_ly');
  const [groupFilter, setGroupFilter] = useState<string>('all');
  const [catalogSearch, setCatalogSearch] = useState<string>('');
  const [itemSearch, setItemSearch] = useState<string>('');

  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>('');

  // Form state
  const [formCode, setFormCode] = useState('');
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formAllowance, setFormAllowance] = useState<number>(0);
  const [formCoeff, setFormCoeff] = useState<number>(1.0);
  const [formActive, setFormActive] = useState<boolean>(true);

  const activeCatalogDef: CatalogDefinition = useMemo(
    () => CATALOG_DEFINITIONS.find((d) => d.key === selectedKey) || CATALOG_DEFINITIONS[0],
    [selectedKey]
  );

  const filteredCatalogList = useMemo(() => {
    return CATALOG_DEFINITIONS.filter((def) => {
      const matchGroup = groupFilter === 'all' || def.group === groupFilter;
      const matchSearch =
        def.title.toLowerCase().includes(catalogSearch.toLowerCase()) ||
        def.mysqlTable.toLowerCase().includes(catalogSearch.toLowerCase()) ||
        String(def.index).includes(catalogSearch);
      return matchGroup && matchSearch;
    });
  }, [groupFilter, catalogSearch]);

  const activeItems = useMemo(() => {
    const list = catalogs[selectedKey] || [];
    if (!itemSearch.trim()) return list;
    const q = itemSearch.toLowerCase();
    return list.filter(
      (i) =>
        i.code.toLowerCase().includes(q) ||
        i.name.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q)
    );
  }, [catalogs, selectedKey, itemSearch]);

  const countEmployeeUsage = (key: CatalogKey, code: string): number => {
    return employees.filter((e) => e.catalogs[key] === code).length;
  };

  const openAddModal = () => {
    setFormError('');
    setIsAddingNew(true);
    setEditingItem(null);
    const prefix = activeCatalogDef.mysqlTable.replace('dm_', '').slice(0, 3).toUpperCase();
    const nextNum = (catalogs[selectedKey]?.length || 0) + 1;
    setFormCode(`${prefix}_0${nextNum}`);
    setFormName('');
    setFormDesc('');
    setFormAllowance(0);
    setFormCoeff(1.0);
    setFormActive(true);
  };

  const openEditModal = (item: CatalogItem) => {
    setFormError('');
    setIsAddingNew(false);
    setEditingItem(item);
    setFormCode(item.code);
    setFormName(item.name);
    setFormDesc(item.description);
    setFormAllowance(item.allowance || 0);
    setFormCoeff(item.coefficient || 1.0);
    setFormActive(item.isActive);
  };

  const closeModal = () => {
    setIsAddingNew(false);
    setEditingItem(null);
    setFormError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = formCode.trim().toUpperCase();
    const cleanName = formName.trim();
    if (!cleanCode || !cleanName) {
      setFormError('Vui lòng nhập đầy đủ Mã danh mục và Tên danh mục.');
      return;
    }

    const existingList = catalogs[selectedKey] || [];
    if (isAddingNew && existingList.some((i) => i.code.toUpperCase() === cleanCode)) {
      setFormError(`Mã danh mục "${cleanCode}" đã tồn tại trong ${activeCatalogDef.title}.`);
      return;
    }

    const payload: CatalogItem = {
      id: editingItem ? editingItem.id : `${selectedKey}-${Date.now()}`,
      code: cleanCode,
      name: cleanName,
      description: formDesc.trim(),
      allowance: activeCatalogDef.hasAllowance ? Number(formAllowance) || 0 : undefined,
      coefficient: activeCatalogDef.hasAllowance ? Number(formCoeff) || 1.0 : undefined,
      isActive: formActive,
      updatedAt: new Date().toISOString().slice(0, 10)
    };

    onSaveCatalogItem(selectedKey, payload, isAddingNew);
    closeModal();
  };

  const totalCatalogRecords = useMemo(() => {
    return Object.values(catalogs).reduce((acc, arr) => acc + arr.length, 0);
  }, [catalogs]);

  return (
    <div className="space-y-6">
      {/* Header Summary Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Quản trị Dữ liệu Nguồn</span>
            <span aria-hidden="true">·</span>
            <span>18 Bảng Danh mục Chuẩn MySQL</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{totalCatalogRecords} bản ghi đang hoạt động</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Hệ thống 18 Danh mục Nhân sự Chuẩn CTI HSK
          </h1>
        </div>

        {/* Group Filter Segmented Controls */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
          {[
            { id: 'all', label: 'Tất cả (18)' },
            { id: 'to_chuc', label: 'Tổ chức & Công tác (4)' },
            { id: 'ca_nhan_chinh_tri', label: 'Nhân thân & Đảng/Đoàn (5)' },
            { id: 'dao_tao_bang_cap', label: 'Đào tạo & Học vấn (6)' },
            { id: 'chuyen_mon_nn', label: 'Ngoại ngữ HSK & Tin học (3)' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setGroupFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                groupFilter === tab.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split Layout: Left 18 Catalogs Navigation + Right Active Catalog Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Directory: 18 Catalogs */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="p-3.5 border-b border-slate-200 bg-slate-50/60">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                placeholder="Tìm trong 18 danh mục hoặc tên bảng MySQL..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-red-700"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-100 max-h-[640px] overflow-y-auto">
            {filteredCatalogList.map((def) => {
              const count = catalogs[def.key]?.length || 0;
              const isSelected = def.key === selectedKey;
              return (
                <button
                  key={def.key}
                  onClick={() => {
                    setSelectedKey(def.key);
                    setItemSearch('');
                  }}
                  className={`w-full text-left px-4 py-3 transition-colors flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-red-50/70 border-l-4 border-l-red-700'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-semibold text-red-700 tabular-nums">
                        {String(def.index).padStart(2, '0')}.
                      </span>
                      <span
                        className={`text-sm truncate ${
                          isSelected ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'
                        }`}
                      >
                        {def.title}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 font-mono">
                      <span>{def.mysqlTable}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-sans">{def.groupLabel}</span>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-medium text-slate-500 tabular-nums shrink-0 pt-0.5">
                    {count} mục
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Content: Selected Catalog Details & Data Grid */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-lg overflow-hidden">
          {/* Active Catalog Header */}
          <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <span className="font-mono font-semibold text-red-700">
                  Danh mục #{String(activeCatalogDef.index).padStart(2, '0')}/18
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono flex items-center gap-1 text-slate-600">
                  <Database className="w-3.5 h-3.5 text-slate-400" />
                  Bảng MySQL: {activeCatalogDef.mysqlTable}
                </span>
                <span aria-hidden="true">·</span>
                <span>{activeCatalogDef.groupLabel}</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900">{activeCatalogDef.title}</h2>
              <p className="text-xs text-slate-600 mt-1">{activeCatalogDef.description}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {canCreate ? (
                <button
                  onClick={openAddModal}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-red-700 rounded-md hover:bg-red-800 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Thêm mục mới
                </button>
              ) : (
                <span className="text-xs text-amber-700">
                  Chế độ chỉ xem theo phân quyền hiện tại
                </span>
              )}
            </div>
          </div>

          {/* Search & Filter Bar for Items */}
          <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={itemSearch}
                onChange={(e) => setItemSearch(e.target.value)}
                placeholder={`Tìm mã hoặc tên trong ${activeCatalogDef.title.toLowerCase()}...`}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-red-700"
              />
            </div>
            <div className="text-xs text-slate-500 font-mono tabular-nums">
              Hiển thị {activeItems.length} / {(catalogs[selectedKey] || []).length} bản ghi
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-600">
                  <th className="py-3 px-4 w-36">Mã danh mục</th>
                  <th className="py-3 px-4">Tên danh mục & Mô tả nghiệp vụ</th>
                  {activeCatalogDef.hasAllowance && (
                    <th className="py-3 px-4 text-right w-40">Định mức Phụ cấp</th>
                  )}
                  <th className="py-3 px-4 text-right w-28">Nhân sự gắn</th>
                  <th className="py-3 px-4 w-28">Trạng thái</th>
                  <th className="py-3 px-4 text-right w-24">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {activeItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={activeCatalogDef.hasAllowance ? 6 : 5}
                      className="py-10 px-4 text-center text-slate-500 text-xs"
                    >
                      Không tìm thấy bản ghi nào phù hợp trong {activeCatalogDef.title}.
                    </td>
                  </tr>
                ) : (
                  activeItems.map((item) => {
                    const usageCount = countEmployeeUsage(selectedKey, item.code);
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/90 transition-colors">
                        <td className="py-3 px-4 align-top font-mono text-xs font-semibold text-slate-900 tabular-nums">
                          {item.code}
                        </td>
                        <td className="py-3 px-4 align-top">
                          <div className="font-semibold text-slate-900 text-sm">{item.name}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{item.description}</div>
                        </td>
                        {activeCatalogDef.hasAllowance && (
                          <td className="py-3 px-4 align-top text-right font-mono text-xs tabular-nums">
                            <div className="font-semibold text-emerald-700">
                              +{formatVND(item.allowance || 0)}
                            </div>
                            <div className="text-slate-500 mt-0.5">
                              Hệ số: {item.coefficient?.toFixed(2) || '1.00'}
                            </div>
                          </td>
                        )}
                        <td className="py-3 px-4 align-top text-right font-mono text-xs text-slate-700 tabular-nums">
                          {usageCount} người
                        </td>
                        <td className="py-3 px-4 align-top text-xs">
                          {item.isActive ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Áp dụng
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-slate-400 font-medium">
                              <XCircle className="w-3.5 h-3.5" />
                              Ngưng
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 align-top text-right">
                          <div className="inline-flex items-center justify-end gap-1">
                            {canEdit && (
                              <button
                                onClick={() => openEditModal(item)}
                                title="Chỉnh sửa danh mục"
                                className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                            )}
                            {canDelete && (
                              <button
                                onClick={() => {
                                  if (usageCount > 0) {
                                    setFormError(
                                      `Không thể xóa mã "${item.code}" vì đang có ${usageCount} hồ sơ nhân sự tham chiếu khóa ngoại MySQL.`
                                    );
                                    return;
                                  }
                                  onDeleteCatalogItem(selectedKey, item.id);
                                }}
                                title="Xóa danh mục"
                                className="p-1.5 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {formError && !isAddingNew && !editingItem && (
            <div className="p-4 bg-red-50 border-t border-red-200 flex items-center justify-between text-xs text-red-800">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
                <span>{formError}</span>
              </div>
              <button
                onClick={() => setFormError('')}
                className="font-semibold underline hover:text-red-950"
              >
                Đóng
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {(isAddingNew || editingItem) && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-lg max-w-lg w-full p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <div className="text-xs text-slate-500 font-mono">
                  Bảng MySQL: {activeCatalogDef.mysqlTable}
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {isAddingNew
                    ? `Thêm mới vào ${activeCatalogDef.title}`
                    : `Cập nhật mục: ${editingItem?.code}`}
                </h3>
              </div>
              <button
                onClick={closeModal}
                className="text-xs font-medium text-slate-500 hover:text-slate-900"
              >
                Đóng [ESC]
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-700">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mã danh mục (PK) *
                  </label>
                  <input
                    type="text"
                    value={formCode}
                    disabled={!isAddingNew}
                    onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-md disabled:bg-slate-100"
                    placeholder="VD: DV_CS_HP"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tên hiển thị chuẩn *
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md"
                    placeholder="Nhập tên đơn vị, trình độ, chức vụ..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mô tả chi tiết / Ghi chú quy định
                </label>
                <textarea
                  rows={2}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md"
                  placeholder="Mô tả phạm vi áp dụng tại hệ thống CTI HSK..."
                />
              </div>

              {activeCatalogDef.hasAllowance && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 bg-slate-50 border border-slate-200 rounded-md">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Định mức Phụ cấp tự động (VNĐ/tháng)
                    </label>
                    <input
                      type="number"
                      step={100000}
                      value={formAllowance}
                      onChange={(e) => setFormAllowance(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-md bg-white"
                    />
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      Tự động cộng vào Bảng lương hàng tháng
                    </span>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Hệ số phụ cấp
                    </label>
                    <input
                      type="number"
                      step={0.05}
                      value={formCoeff}
                      onChange={(e) => setFormCoeff(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-md bg-white"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formActive}
                    onChange={(e) => setFormActive(e.target.checked)}
                    className="rounded border-slate-300 text-red-700 focus:ring-red-700"
                  />
                  Kích hoạt sử dụng trong hồ sơ nhân sự
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-red-700 rounded-md hover:bg-red-800 cursor-pointer"
                  >
                    Lưu vào Danh mục
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
