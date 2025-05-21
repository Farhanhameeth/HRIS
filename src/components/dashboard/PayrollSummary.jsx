import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from "react-router-dom";
import TileHeader from '../reusable/TileHeader';
import DataTable from '../reusable/DataTable';  // Import DataTable component

import {
  fetchPayrollSummaries,
  selectPayrollSummaries,
  setFilters,
  setSelectedRecord,
} from '../../features/payroll/payrollSummarySlice';

const PayrollSummary = () => {
  const dispatch = useDispatch();
  const payrollSummaries = useSelector(selectPayrollSummaries);
  const status = useSelector(state => state.payrollSummary.status);
  const error = useSelector(state => state.payrollSummary.error);
  const filters = useSelector(state => state.payrollSummary.filters);
  const currentPage = useSelector(state => state.payrollSummary.currentPage);
  const itemsPerPage = useSelector(state => state.payrollSummary.itemsPerPage);
  

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const handleMonthChange = (month) => {
    dispatch(setFilters({ ...filters, month }));
  };

  const handleYearChange = (year) => {
    dispatch(setFilters({ ...filters, year }));
  };

  useEffect(() => {
    if (status === 'idle' || filters.month || filters.year) {
      dispatch(fetchPayrollSummaries({ year: filters.year, month: filters.month }));
      console.log("All payroll summaries from Redux:", payrollSummaries);
    }

    

    // dispatch(fetchPayrollSummaries({ year: "2024", month: "08" }));
  }, [dispatch, filters.year, filters.month]);

  // filters.year, filters.month

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  const handleRowClick = (detail) => {
    dispatch(setSelectedRecord(detail));
  };

  const filteredPayrollSummaryDetails = payrollSummaries
    .filter((detail) => (filters.status !== 'all' ? detail.status === filters.status : true))
    .filter((detail) => {
      const searchTerm = filters[filters.searchBy]?.toLowerCase() || '';
      return detail[filters.searchBy]?.toString().toLowerCase().includes(searchTerm);
    })
    .filter((detail) => {
      if (filters.month && filters.year) {
        const date = new Date(detail.insertDate);
        const month = date.getMonth() + 1;
        const year = date.getFullYear().toString();
        return month === parseInt(filters.month) && year === filters.year;
      }
      return true;
    });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = payrollSummaries.slice(indexOfFirstItem, indexOfLastItem);

  console.log("Current payroll items:", currentItems);

  console.log("All payroll summaries from Redux:", payrollSummaries);

  // // Define columns for DataTable @induwara
  // const payrollSummaryColumns = [
  //   {
  //     header: 'Actual Total Pay',
  //     accessor: 'ActualTotalAmountToPay',
  //   },
  //   {
  //     header: 'Paid Emp Count',
  //     accessor: 'CountOfEmployeesToBePaid',
  //   },
  //   {
  //     header: 'Exp Total Pay',
  //     accessor: 'ExpectedTotalAmountToPay',
  //   },
  //   {
  //     header: 'Total Allowance',
  //     accessor: 'TotalAllowanceAmount',
  //   },
  //   {
  //     header: 'Total Deduction',
  //     accessor: 'TotalDeductionAmount',
  //   },
  //   {
  //     header: 'Emp Count',
  //     accessor: 'TotalEmployeesCount',
  //   },
  //   {
  //     header: 'Total EPF',
  //     accessor: 'TotalEpfAmount',
  //   },
  //   {
  //     header: 'Total ETF',
  //     accessor: 'TotalEtfAmount',
  //   },
  //   {
  //     header: 'Total PayeeTax',
  //     accessor: 'TotalPayeeTaxAmount',
  //   },
  //   {
  //     header: 'Date',
  //     accessor: 'insertDate',
  //   },
  // ];
  
  const payrollSummaryColumns = [
    { header: 'Emp Count', accessor: 'TotalEmployeesCount' },
    { header: 'Paid Emp Count', accessor: 'CountOfEmployeesToBePaid' },
    {
      header: 'Exp Total Pay',
      accessor: 'ExpectedTotalAmountToPay',
      render: row => row.ExpectedTotalAmountToPay?.toFixed(2) ?? '0.00'
    },
    {
      header: 'Total Deduction',
      accessor: 'TotalDeductionAmount',
      render: row => row.TotalDeductionAmount?.toFixed(2) ?? '0.00'
    },
    {
      header: 'Total Allowance',
      accessor: 'TotalAllowanceAmount',
      render: row => row.TotalAllowanceAmount?.toFixed(2) ?? '0.00'
    },
    {
      header: 'Total EPF',
      accessor: 'TotalEpfAmount',
      render: row => row.TotalEpfAmount?.toFixed(2) ?? '0.00'
    },
    {
      header: 'Total ETF',
      accessor: 'TotalEtfAmount',
      render: row => row.TotalEtfAmount?.toFixed(2) ?? '0.00'
    },
    {
      header: 'Total PayeeTax',
      accessor: 'TotalPayeeTaxAmount',
      render: row => row.TotalPayeeTaxAmount?.toFixed(2) ?? '0.00'
    },
    {
      header: 'Actual Total Pay',
      accessor: 'ActualTotalAmountToPay',
      render: row => row.ActualTotalAmountToPay?.toFixed(2) ?? '0.00'
    },
  ];

  return (
    <div className="overflow-x-auto rounded-lg shadow-md bg-white">
      <TileHeader 
        HeaderText="Payroll Summary" 
        showMonthPicker={true}
        selectedMonth={filters.month || currentMonth} 
        selectedYear={filters.year || currentYear}   
        onMonthChange={handleMonthChange}  
        onYearChange={handleYearChange}    
      />
      <div className="w-11/12 mx-auto my-4 rounded-lg border border-gray-200 overflow-hidden">
        <DataTable 
          columns={payrollSummaryColumns} 
          data={currentItems} 
          onRowClick={handleRowClick} 
        />
      
      </div>
      <div className="flex justify-center">
        <NavLink to="/payroll" className="w-1/6 p-2 bg-customOrange-100 rounded-md hover:bg-customOrange-200 transition-colors duration-200 text-center mb-3">
          View More
        </NavLink>
      </div>
    </div>
  );
};

export default PayrollSummary;
