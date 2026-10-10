import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, SlidersHorizontal, CheckSquare, Square, RefreshCw } from 'lucide-react';

export default function DataTable({
  columns = [],
  data = [],
  loading = false,
  searchable = true,
  searchPlaceholder = 'Search records...',
  filterOptions = [], // Array of { key: 'status', label: 'Status', options: [{ label, value }] }
  actions = null, // Header actions like "Add Product" button
  onRowClick = null,
  selectable = false,
  onSelectionChange = null,
  pageSize = 10,
  emptyTitle = 'No records found',
  emptyDescription = 'Try adjusting your search query or filters.',
  onRefresh = null,
}) {
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' | 'desc'
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState(new Set());

  // Filter & Search logic
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // 1. Search Query
      if (search.trim()) {
        const query = search.toLowerCase().trim();
        const matchesSearch = columns.some((col) => {
          if (!col.accessor) return false;
          const val = typeof col.accessor === 'function' ? col.accessor(item) : item[col.accessor];
          return val !== null && val !== undefined && String(val).toLowerCase().includes(query);
        });
        if (!matchesSearch) return false;
      }

      // 2. Active Filters
      for (const [filterKey, filterValue] of Object.entries(activeFilters)) {
        if (filterValue && filterValue !== 'all') {
          const itemVal = item[filterKey];
          if (String(itemVal) !== String(filterValue)) return false;
        }
      }

      return true;
    });
  }, [data, search, activeFilters, columns]);

  // Sort logic
  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;
    return [...filteredData].sort((a, b) => {
      const col = columns.find((c) => c.key === sortColumn || c.accessor === sortColumn);
      if (!col) return 0;

      let valA = typeof col.accessor === 'function' ? col.accessor(a) : a[col.accessor];
      let valB = typeof col.accessor === 'function' ? col.accessor(b) : b[col.accessor];

      if (valA === null || valA === undefined) valA = '';
      if (valB === null || valB === undefined) valB = '';

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      }

      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();
      if (strA < strB) return sortDirection === 'asc' ? -1 : 1;
      if (strA > strB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortColumn, sortDirection, columns]);

  // Pagination logic
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (columnKey) => {
    if (sortColumn === columnKey) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else setSortColumn(null);
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.size === paginatedData.length && paginatedData.length > 0) {
      const next = new Set(selectedIds);
      paginatedData.forEach((row) => next.delete(row.id));
      setSelectedIds(next);
      if (onSelectionChange) onSelectionChange(Array.from(next));
    } else {
      const next = new Set(selectedIds);
      paginatedData.forEach((row) => next.add(row.id));
      setSelectedIds(next);
      if (onSelectionChange) onSelectionChange(Array.from(next));
    }
  };

  const handleSelectRow = (id, e) => {
    e.stopPropagation();
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
    if (onSelectionChange) onSelectionChange(Array.from(next));
  };

  return (
    <div className="bg-white border border-zinc-200/90 rounded-xl overflow-hidden shadow-none">
      {/* Table Toolbar */}
      <div className="p-3.5 sm:p-4 border-b border-zinc-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {searchable && (
            <div className="relative flex-1 min-w-[220px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none z-10" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={searchPlaceholder}
                style={{ paddingLeft: '2.5rem', color: '#09090b', backgroundColor: '#ffffff' }}
                className="w-full pr-3.5 py-1.5 bg-white border border-zinc-300 hover:border-zinc-400 focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 rounded-lg text-xs font-normal text-zinc-900 placeholder:text-zinc-400 focus:outline-none transition-colors admin-input-control"
              />
            </div>
          )}

          {/* Filter Dropdowns */}
          {filterOptions.map((filter) => (
            <div key={filter.key} className="relative">
              <select
                value={activeFilters[filter.key] || 'all'}
                onChange={(e) => {
                  setActiveFilters((prev) => ({ ...prev, [filter.key]: e.target.value }));
                  setCurrentPage(1);
                }}
                style={{ paddingRight: '2rem' }}
                className="bg-zinc-50/70 border border-zinc-200 hover:border-zinc-300 text-xs font-medium text-zinc-700 rounded-lg px-3 py-1.5 focus:outline-none focus:border-zinc-900 transition-colors appearance-none cursor-pointer"
              >
                <option value="all">All {filter.label}</option>
                {filter.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
            </div>
          ))}

          {onRefresh && (
            <button
              onClick={onRefresh}
              title="Refresh Data"
              className="p-1.5 bg-white hover:bg-zinc-100 text-zinc-600 rounded-lg border border-zinc-200 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50/60 border-b border-zinc-200/80 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
              {selectable && (
                <th className="py-3 px-3.5 w-10 text-center">
                  <button onClick={handleSelectAll} className="text-zinc-400 hover:text-zinc-800">
                    {selectedIds.size > 0 && selectedIds.size === paginatedData.length ? (
                      <CheckSquare className="w-4 h-4 text-zinc-900" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
              )}
              {columns.map((col) => {
                const key = col.key || (typeof col.accessor === 'string' ? col.accessor : col.header);
                const isSorted = sortColumn === key;
                return (
                  <th
                    key={key}
                    onClick={() => col.sortable !== false && handleSort(key)}
                    className={`py-3 px-4 ${col.sortable !== false ? 'cursor-pointer select-none hover:text-zinc-900' : ''} ${
                      col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                    }`}
                  >
                    <div className={`flex items-center gap-1.5 ${col.align === 'right' ? 'justify-end' : col.align === 'center' ? 'justify-center' : 'justify-start'}`}>
                      <span>{col.header}</span>
                      {col.sortable !== false && (
                        <span className="text-zinc-400">
                          {isSorted ? (
                            sortDirection === 'asc' ? (
                              <ChevronUp className="w-3 h-3 text-zinc-900" />
                            ) : (
                              <ChevronDown className="w-3 h-3 text-zinc-900" />
                            )
                          ) : (
                            <ChevronDown className="w-3 h-3 opacity-25" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 text-xs text-zinc-800">
            {loading ? (
              Array.from({ length: pageSize }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  {selectable && <td className="p-3.5 text-center"><div className="w-3.5 h-3.5 bg-zinc-100 rounded m-auto" /></td>}
                  {columns.map((_, colIdx) => (
                    <td key={colIdx} className="p-3.5">
                      <div className="h-3.5 bg-zinc-100 rounded w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="py-12 px-4 text-center">
                  <div className="max-w-xs mx-auto space-y-1.5">
                    <SlidersHorizontal className="w-7 h-7 mx-auto text-zinc-300 stroke-[1.5]" />
                    <p className="font-medium text-zinc-900 text-xs">{emptyTitle}</p>
                    <p className="text-[11px] text-zinc-500">{emptyDescription}</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIdx) => {
                const isSelected = selectedIds.has(row.id);
                return (
                  <tr
                    key={row.id || rowIdx}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={`transition-colors hover:bg-zinc-50/70 ${
                      onRowClick ? 'cursor-pointer' : ''
                    } ${isSelected ? 'bg-zinc-50/90 font-medium' : ''}`}
                  >
                    {selectable && (
                      <td className="py-3 px-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                        <button onClick={(e) => handleSelectRow(row.id, e)} className="text-zinc-400 hover:text-zinc-900">
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-zinc-900" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                    )}
                    {columns.map((col, colIdx) => {
                      const value = typeof col.accessor === 'function' ? col.accessor(row) : row[col.accessor];
                      return (
                        <td
                          key={colIdx}
                          className={`py-3 px-4 ${
                            col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                          }`}
                        >
                          {col.render ? col.render(value, row) : value}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3 border-t border-zinc-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
        <div>
          Showing <span className="font-medium text-zinc-800">{sortedData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</span> to{' '}
          <span className="font-medium text-zinc-800">{Math.min(currentPage * pageSize, sortedData.length)}</span> of{' '}
          <span className="font-medium text-zinc-800">{sortedData.length}</span> results
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 bg-white border border-zinc-200 text-zinc-600 rounded-md hover:bg-zinc-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="px-2.5 py-1 text-xs font-medium text-zinc-700 bg-zinc-50 border border-zinc-200 rounded-md">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1.5 bg-white border border-zinc-200 text-zinc-600 rounded-md hover:bg-zinc-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
