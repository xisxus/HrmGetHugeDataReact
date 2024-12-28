import axios from 'axios';
import React, { useEffect } from 'react'
import { useState } from 'react'

const MachineData = () => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [startDate, setStartDate] = useState(""); // Start date filter
    const [page, setPage] = useState(1); // Current page
    const [perPage, setPerPage] = useState(10); // Rows per page

    // Fetch data from the API
    const fetchData = async (page, perPage, startDate) => {
        setLoading(true);

        try {
            const response = await axios.post(
                "http://localhost:5053/api/HRM_ATD_MachineData/search",
                {
                    start: (page - 1) * perPage,
                    length: perPage,
                    startDate: startDate || null,
                    search: {
                        value: "", // Default search value
                    },
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const { data: responseData } = response;

            // Ensure responseData.data is an array
            if (responseData && Array.isArray(responseData.data)) {
                setData(responseData.data);
                setTotalRows(responseData.recordsTotal || 0);
            } else {
                console.error("Invalid API response:", responseData);
                setData([]); // Default to an empty array if response is invalid
                setTotalRows(0);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setData([]); // Reset data on error
            setTotalRows(0);
        }

        setLoading(false);
    };


    // Handle page change
    const handlePageChange = (newPage) => {
        setPage(newPage);
        fetchData(newPage, perPage, startDate);
    };

    // Handle rows per page change
    const handlePerPageChange = (newPerPage, newPage) => {
        setPerPage(newPerPage);
        setPage(newPage);
        fetchData(newPage, newPerPage, startDate);
    };

    // Handle start date input change
    const handleDateChange = (event) => {
        setStartDate(event.target.value);
    };

    // Refetch data when page or startDate changes
    useEffect(() => {
        fetchData(page, perPage, startDate);
    }, [page, perPage, startDate]);

    // Define table columns
    const columns = [
        { name: "ID", selector: (row) => row.autoId, sortable: true },
        { name: "Fingerprint ID", selector: (row) => row.fingerPrintId, sortable: true },
        { name: "Machine ID", selector: (row) => row.machineId, sortable: true },
        { name: "Date", selector: (row) => row.date, sortable: true },
        { name: "Time", selector: (row) => row.time, sortable: true },
        {
            name: "Location",
            selector: (row) =>
                row.latitude && row.longitude ? `${row.latitude}, ${row.longitude}` : "N/A",
            sortable: true,
        },
        { name: "HOALR", selector: (row) => row.hoalr, sortable: true },
    ];

    return (
        <div className="container">
            <h1>Machine Data</h1>

            {/* Date Filter Input */}
            <div className="form-group my-3">
                <label htmlFor="startDate">Filter by Start Date</label>
                <input
                    type="text"
                    id="startDate"
                    className="form-control"
                    placeholder="DD-MM-YYYY"
                    value={startDate}
                    onChange={handleDateChange}
                />
            </div>

            {/* Data Table */}
            {/* <DataTable
                title="Machine Attendance Data"
                columns={columns}
                data={data || []} // Always pass an empty array as a fallback
                progressPending={loading}
                pagination
                paginationServer
                paginationTotalRows={totalRows}
                onChangeRowsPerPage={handlePerPageChange}
                onChangePage={handlePageChange}
            /> */}

        </div>
    );
};

export default MachineData;
