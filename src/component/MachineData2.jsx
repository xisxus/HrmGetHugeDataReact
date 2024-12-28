import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const MachineData2 = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [machineId, setMachineId] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  //const pageSize = 10;
  const [pageSize, setPageSize] = useState(10);


  const pageSizeOptions = [10, 25, 50, 100];


  const handlePageSizeChange = (e) => {
    const newPageSize = parseInt(e.target.value);
    setPageSize(newPageSize);
    setCurrentPage(0); // Reset to first page
    setLoading(true); // Trigger loading indicator on page size change
  };
  




  const fetchData = async () => {
    setLoading(true);
    try {
        debugger
      const requestBody = {
        draw: 1,
        start: currentPage * pageSize,
        length: pageSize,
        search: {
          value: searchTerm || '',
        },
        order: [
          {
            column: 1,
            dir: 'asc',
            name: "machineId"
          },
        ],
        columns: [
          { data: 'fingerPrintId', name: 'fingerPrintId', searchable: true, orderable: true },
          { data: 'machineId', name: 'machineId', searchable: true, orderable: true },
          { data: 'date', name: 'date', searchable: true, orderable: true },
          { data: 'time', name: 'time', searchable: true, orderable: true },
          { data: 'latitude', name: 'latitude', searchable: true, orderable: true },
          { data: 'longitude', name: 'longitude', searchable: true, orderable: true },
          { data: 'hoalr', name: 'hoalr', searchable: true, orderable: true },
        ],
        startDate: startDate || '',
        endDate: endDate || '',
        machineId: machineId || '',
      };

      const response = await fetch('http://localhost:5053/api/HRM_ATD_MachineData/search/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server responded with error:', errorData);
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      setData(result.data);
      setTotalRecords(result.recordsTotal);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, searchTerm, startDate, endDate, machineId]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchData();
  };

  const totalPages = Math.ceil(totalRecords / pageSize);
  
  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 10;
    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 
            ${currentPage === i ? 'bg-blue-50 border-blue-500 text-blue-600' : 'text-gray-700'}`}
        >
          {i + 1}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Machine Data</h2>
      </div>

      <div className="p-6">
        <form onSubmit={handleSearch} className="flex gap-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1">
            <input
              type="text"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </form>

        <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Show</span>
            <select
              value={pageSize}
              onChange={handlePageSizeChange}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {pageSizeOptions.map(size => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-500">entries</span>
          </div>



        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Fingerprint ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Machine ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Time</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Latitude</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Longitude</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">HOALR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-4 text-center text-sm text-gray-500">Loading...</td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-4 text-center text-sm text-gray-500">No data found</td>
                </tr>
              ) : (
                data.map((row) => (
                  <tr key={row.autoId} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{row.autoId}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{row.fingerPrintId}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{row.machineId}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{row.date}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{row.time}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{row.latitude}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{row.longitude}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{row.hoalr}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            Showing {Math.min(currentPage * pageSize + 1, totalRecords)} to{' '}
            {Math.min((currentPage + 1) * pageSize, totalRecords)} of {totalRecords} entries
          </div>
          <div className="flex gap-2">
            {/* First Page Button */}
            <button
              onClick={() => setCurrentPage(0)}
              disabled={currentPage === 0}
              className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              title="First Page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
            
            {/* Previous Page Button */}
            <button
              onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            {renderPageNumbers()}
            
            {/* Next Page Button */}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage >= totalPages - 1}
              className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            {/* Last Page Button */}
            <button
              onClick={() => setCurrentPage(totalPages - 1)}
              disabled={currentPage >= totalPages - 1}
              className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Last Page"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MachineData2;