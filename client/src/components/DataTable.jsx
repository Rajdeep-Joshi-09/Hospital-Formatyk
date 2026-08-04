import { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { Download, Search, ChevronUp, ChevronDown } from 'lucide-react';

const DataTable = ({ columns, data, exportFileName = 'data_export' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Handle Sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter and Sort Data
  const filteredAndSortedData = useMemo(() => {
    let processData = [...data];

    // Global Search
    if (searchTerm) {
      processData = processData.filter((row) => {
        return Object.values(row).some((val) =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    // Sort
    if (sortConfig.key) {
      processData.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return processData;
  }, [data, searchTerm, sortConfig]);

  // Export to Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredAndSortedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${exportFileName}.xlsx`);
  };

  return (
    <div className="glass-card rounded-[24px] overflow-hidden flex flex-col h-full">
      {/* Table Toolbar */}
      <div className="p-lg flex flex-col sm:flex-row justify-between items-center gap-md border-b border-[#E7E7E7]">
        <div className="relative w-full sm:w-[350px] md:w-[400px]">
          <Search size={20} className="absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Search all columns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-container-lowest border border-[#E7E7E7] rounded-lg pl-[44px] pr-md py-sm text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors min-h-[42px]"
          />
        </div>
        <button
          onClick={exportToExcel}
          className="w-full sm:w-auto flex items-center justify-center gap-sm bg-primary text-on-primary hover:bg-primary-container font-label-md px-md py-sm rounded-lg transition-colors"
        >
          <Download size={18} />
          Export to Excel
        </button>
      </div>

      {/* Table Wrapper for horizontal scroll */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container border-b border-[#E7E7E7]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  className={`p-md font-label-md text-label-md text-on-surface-variant whitespace-nowrap ${col.sortable !== false ? 'cursor-pointer hover:bg-surface-container-high transition-colors' : ''}`}
                >
                  <div className="flex items-center gap-xs">
                    {col.label}
                    {col.sortable !== false && (
                      <span className="flex flex-col opacity-50">
                        <ChevronUp size={12} className={sortConfig.key === col.key && sortConfig.direction === 'asc' ? 'text-primary opacity-100' : ''} />
                        <ChevronDown size={12} className="-mt-1" stroke={sortConfig.key === col.key && sortConfig.direction === 'desc' ? 'var(--color-primary)' : 'currentColor'} />
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedData.length > 0 ? (
              filteredAndSortedData.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-[#E7E7E7] hover:bg-surface-container/30 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="p-md text-body-md text-on-surface">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="p-xl text-center text-on-surface-variant font-body-md">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
