import {useEffect} from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setLoanDetails, setSelectedRecord, setIsModalOpen, setFilters, setCurrentPage, setItemsPerPage } from '../features/loan/loanSlice';

const LoansPage = () => {
  const dispatch = useDispatch();
  const {
    loanDetails,
    selectedRecord,
    isModalOpen,
    filters,
    currentPage,
    itemsPerPage,
  } = useSelector((state) => state.loans); 
  

  useEffect(() => {
    const fetchLoanDetails = async () => {
      const loanData = [
        {
            id: 1,
            employeeId: 'EMP001',
            firstName: 'Joseph',
            lastName: 'Smith',
            installmentType: 'Monthly',
            interestRate: 5.5,
            loanAmount: 10000,
            purpose: 'Home improvement',
            financeApproveBy: 'John Doe',
            hrApproveBy: 'Jane Smith',
            rejectBy: '',
            reference: 'REF001',
            searchBy: 'firstName'
        },
        {
            id: 2,
            employeeId: 'EMP002',
            firstName: 'Will',
            lastName: 'Rodrigo',
            installmentType: 'Bi-weekly',
            interestRate: 6.0,
            loanAmount: 15000,
            purpose: 'Car purchase',
            financeApproveBy: 'Alice Brown',
            hrApproveBy: 'Robert Green',
            rejectBy: '',
            reference: 'REF002',
            searchBy: 'firstName'
        },
        {
            id: 3,
            employeeId: 'EMP003',
            firstName: 'Emily',
            lastName: 'Jones',
            installmentType: 'Monthly',
            interestRate: 5.0,
            loanAmount: 12000,
            purpose: 'Debt consolidation',
            financeApproveBy: 'Mark Johnson',
            hrApproveBy: 'Sarah Wilson',
            rejectBy: '',
            reference: 'REF003',
            searchBy: 'lastName'
        },
        {
            id: 4,
            employeeId: 'EMP004',
            firstName: 'Sophia',
            lastName: 'Davis',
            installmentType: 'Weekly',
            interestRate: 5.8,
            loanAmount: 8000,
            purpose: 'Education expenses',
            financeApproveBy: 'Emma Lee',
            hrApproveBy: 'Michael Clark',
            rejectBy: '',
            reference: 'REF004',
            searchBy: 'firstName'
        },
        {
            id: 5,
            employeeId: 'EMP005',
            firstName: 'Jacob',
            lastName: 'Martinez',
            installmentType: 'Bi-weekly',
            interestRate: 6.2,
            loanAmount: 20000,
            purpose: 'Business startup',
            financeApproveBy: 'Olivia Taylor',
            hrApproveBy: 'Daniel White',
            rejectBy: '',
            reference: 'REF005',
            searchBy: 'firstName'
        },
        {
            id: 6,
            employeeId: 'EMP006',
            firstName: 'Mia',
            lastName: 'Garcia',
            installmentType: 'Monthly',
            interestRate: 5.7,
            loanAmount: 18000,
            purpose: 'Vacation expenses',
            financeApproveBy: 'James Harris',
            hrApproveBy: 'Lily Martinez',
            rejectBy: '',
            reference: 'REF006',
            searchBy: 'lastName'
        },
        {
            id: 7,
            employeeId: 'EMP007',
            firstName: 'Logan',
            lastName: 'Wilson',
            installmentType: 'Monthly',
            interestRate: 5.5,
            loanAmount: 16000,
            purpose: 'Medical bills',
            financeApproveBy: 'Ethan King',
            hrApproveBy: 'Sophie Anderson',
            rejectBy: '',
            reference: 'REF007',
            searchBy: 'firstName'
        },
        {
            id: 8,
            employeeId: 'EMP008',
            firstName: 'Ava',
            lastName: 'Brown',
            installmentType: 'Bi-weekly',
            interestRate: 6.1,
            loanAmount: 14000,
            purpose: 'Home purchase',
            financeApproveBy: 'Noah Scott',
            hrApproveBy: 'Aria Garcia',
            rejectBy: '',
            reference: 'REF008',
            searchBy: 'firstName'
        },
        {
            id: 9,
            employeeId: 'EMP009',
            firstName: 'Elijah',
            lastName: 'Lopez',
            installmentType: 'Monthly',
            interestRate: 5.3,
            loanAmount: 25000,
            purpose: 'Wedding expenses',
            financeApproveBy: 'Mia Davis',
            hrApproveBy: 'Lucas Thomas',
            rejectBy: '',
            reference: 'REF009',
            searchBy: 'lastName'
        },
        {
            id: 10,
            employeeId: 'EMP010',
            firstName: 'Emma',
            lastName: 'Miller',
            installmentType: 'Weekly',
            interestRate: 5.6,
            loanAmount: 30000,
            purpose: 'Investment',
            financeApproveBy: 'William Rodriguez',
            hrApproveBy: 'Harper Moore',
            rejectBy: '',
            reference: 'REF010',
            searchBy: 'firstName'
        },
        {
            id: 11,
            employeeId: 'EMP011',
            firstName: 'Jackson',
            lastName: 'Hernandez',
            installmentType: 'Monthly',
            interestRate: 5.9,
            loanAmount: 22000,
            purpose: 'Renovation',
            financeApproveBy: 'Charlotte Adams',
            hrApproveBy: 'Jackson Hernandez',
            rejectBy: '',
            reference: 'REF011',
            searchBy: 'lastName'
        },
        {
            id: 12,
            employeeId: 'EMP012',
            firstName: 'Grace',
            lastName: 'Gonzalez',
            installmentType: 'Monthly',
            interestRate: 5.4,
            loanAmount: 17000,
            purpose: 'Travel',
            financeApproveBy: 'Ella Perez',
            hrApproveBy: 'David Baker',
            rejectBy: '',
            reference: 'REF012',
            searchBy: 'lastName'
        },
        {
            id: 13,
            employeeId: 'EMP013',
            firstName: 'Liam',
            lastName: 'Rivera',
            installmentType: 'Bi-weekly',
            interestRate: 6.3,
            loanAmount: 28000,
            purpose: 'Starting a business',
            financeApproveBy: 'Victoria King',
            hrApproveBy: 'Luke Sanchez',
            rejectBy: '',
            reference: 'REF013',
            searchBy: 'firstName'
        },
        {
            id: 14,
            employeeId: 'EMP014',
            firstName: 'Abigail',
            lastName: 'Perez',
            installmentType: 'Weekly',
            interestRate: 5.7,
            loanAmount: 19000,
            purpose: 'Education',
            financeApproveBy: 'Zoe Howard',
            hrApproveBy: 'Christopher Long',
            rejectBy: '',
            reference: 'REF014',
            searchBy: 'lastName'
        },
        {
            id: 15,
            employeeId: 'EMP015',
            firstName: 'Benjamin',
            lastName: 'Taylor',
            installmentType: 'Monthly',
            interestRate: 5.2,
            loanAmount: 21000,
            purpose: 'Home renovation',
            financeApproveBy: 'Sophia Carter',
            hrApproveBy: 'Gabriel Martinez',
            rejectBy: '',
            reference: 'REF015',
            searchBy: 'firstName'
        },
        {
            id: 16,
            employeeId: 'EMP016',
            firstName: 'Isabella',
            lastName: 'White',
            installmentType: 'Monthly',
            interestRate: 5.6,
            loanAmount: 26000,
            purpose: 'Medical expenses',
            financeApproveBy: 'Nathan Johnson',
            hrApproveBy: 'Madison Green',
            rejectBy: '',
            reference: 'REF016',
            searchBy: 'lastName'
        },
        {
            id: 17,
            employeeId: 'EMP017',
            firstName: 'James',
            lastName: 'Clark',
            installmentType: 'Bi-weekly',
            interestRate: 6.2,
            loanAmount: 32000,
            purpose: 'Vehicle purchase',
            financeApproveBy: 'Brooklyn Lee',
            hrApproveBy: 'Isaac Allen',
            rejectBy: '',
            reference: 'REF017',
            searchBy: 'firstName'
        },
        {
            id: 18,
            employeeId: 'EMP018',
            firstName: 'Charlotte',
            lastName: 'Lewis',
            installmentType: 'Monthly',
            interestRate: 5.8,
            loanAmount: 23000,
            purpose: 'Moving expenses',
            financeApproveBy: 'Aaron Scott',
            hrApproveBy: 'Eleanor Moore',
            rejectBy: '',
            reference: 'REF018',
            searchBy: 'lastName'
        },
        {
            id: 19,
            employeeId: 'EMP019',
            firstName: 'Mason',
            lastName: 'Hall',
            installmentType: 'Weekly',
            interestRate: 5.4,
            loanAmount: 18000,
            purpose: 'Family needs',
            financeApproveBy: 'Grace Hernandez',
            hrApproveBy: 'Logan Russell',
            rejectBy: '',
            reference: 'REF019',
            searchBy: 'lastName'
        },
        {
            id: 20,
            employeeId: 'EMP020',
            firstName: 'Harper',
            lastName: 'Moore',
            installmentType: 'Monthly',
            interestRate: 5.5,
            loanAmount: 27000,
            purpose: 'Investment',
            financeApproveBy: 'Lucy Wood',
            hrApproveBy: 'Owen Turner',
            rejectBy: '',
            reference: 'REF020',
            searchBy: 'firstName'
        }
    ];
    
      dispatch(setLoanDetails(loanData));
    };
    fetchLoanDetails();
  }, [dispatch]);

  //dark mode
  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      document.documentElement.classList.add("dark");

    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    dispatch(setFilters({ [name]: value }));
  };

  const handleSearchByChange = (event) => {
    dispatch(setFilters({ searchBy: event.target.value }));
  };

  const handleRowClick = (detail) => {
    dispatch(setSelectedRecord(detail));
    dispatch(setIsModalOpen(true));
  };

  const handleCloseModal = () => {
    dispatch(setIsModalOpen(false));
    dispatch(setSelectedRecord(null));
  };

  const filteredLoanDetails = loanDetails.filter((detail) => {
    if (filters.status !== 'all') {
      return detail.status === filters.status;
    }
    return true;
  }).filter((detail) => {
    const searchTerm = filters[filters.searchBy].toLowerCase();
    return detail[filters.searchBy].toString().toLowerCase().includes(searchTerm);
  });

  const totalItems = filteredLoanDetails.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLoanDetails.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalItems/ itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const paginate = (pageNumber) => dispatch(setCurrentPage(pageNumber));

  return(
    <div className="bg-gray-100 dark:bg-gray-800 min-h-screen">
    <div className="overflow-x-auto rounded-lg shadow-md bg-white p-4 ml-64 dark:bg-gray-800 ">
      <div className="flex items-center space-x-4 mb-4">
        <select
          name="searchBy"
          value={filters.searchBy}
          onChange={handleSearchByChange}
          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:text-white"
        >
          <option value="id">ID</option>
          <option value="employeeId">Employee ID</option>
          <option value="firstName">First Name</option>
          <option value="lastName">Last Name</option>
          <option value="installmentType">Installment Type</option>
          <option value="interestRate">Interest Rate</option>
          <option value="loanAmount">Loan Amount</option>
          <option value="purpose">Purpose</option>
          <option value="financeApproveBy">Finance Approve By</option>
          <option value="hrApproveBy">HR ApproveBy</option>
          <option value="status">Status</option>
        </select>
        <input
          type="text"
          placeholder={`Search by ${filters.searchBy}`}
          name={filters.searchBy}
          value={filters[filters.searchBy]}
          onChange={handleFilterChange}
          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:text-white"
        />
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:text-white"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <table className="min-w-full bg-white border border-gray-200 divide-y divide-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">First Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Last Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Installment Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Interest Rate</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">loan Amount</th>
            {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Status</th> */}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
          {currentItems.map((detail) => (
            <tr key={detail.id} onClick={() => handleRowClick(detail)} className="cursor-pointer">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{detail.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{detail.firstName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{detail.lastName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{detail.installmentType}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{detail.interestRate}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{detail.loanAmount}</td>
              {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{detail.status}</td> */}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-center mt-4">
        <nav className="block">
          <ul className="flex pl-0 rounded list-none flex-wrap">
            <li>
              <button
                  onClick={() => {
                    if (currentPage > 1) {
                      dispatch(setCurrentPage(currentPage - 1));
                    }
                  }}
                  disabled={currentPage === 1}
                  className="relative block px-3 py-2 leading-tight bg-white border border-gray-300 text-gray-800 mr-1 hover:bg-gray-200 dark:bg-gray-700 dark:text-white"
              >
                Previous
              </button>
            </li>
            {pageNumbers.map((number) => (
                <li key={number}>
                  <button
                      onClick={() => paginate(number)}
                      className={`relative block px-3 py-2 leading-tight bg-white border border-gray-300 text-gray-800 mr-1 hover:bg-gray-200  dark:bg-gray-700 dark:text-white ${
                    currentPage === number ? 'font-semibold' : ''
                  }`}
                >
                  {number}
                </button>
              </li>
            ))}
            <li>
              <button
                  onClick={() => {
                    if (currentPage < pageNumbers.length) {
                      dispatch(setCurrentPage(currentPage + 1));
                    }
                  }}
                  disabled={currentPage === pageNumbers.length}
                  className="relative block px-3 py-2 leading-tight bg-white border border-gray-300 text-gray-800 mr-1 hover:bg-gray-200 dark:bg-gray-700 dark:text-white"
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {isModalOpen && selectedRecord && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Loan Detail
                    </h3>
                    <div className="mt-2">
                      <p>ID: {selectedRecord.id}</p>
                      <p>Employee ID: {selectedRecord.employeeId}</p>
                      <p>First Name: {selectedRecord.firstName}</p>
                      <p>Last Name: {selectedRecord.lastName}</p>
                      <p>Installment Type: {selectedRecord.installmentType}</p>
                      <p>Interest Rate: {selectedRecord.interestRate}</p>
                      <p>Loan Amount: {selectedRecord.loanAmount}</p>
                      <p>Purpose: {selectedRecord.purpose}</p>
                      <p>Finance ApproveBy: {selectedRecord.financeApproveBy}</p>
                      <p>HR ApproveBy: {selectedRecord.hrApproveBy}</p>
                      <p>Reject By: {selectedRecord.rejectBy}</p>
                      <p>Status: {selectedRecord.status}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
  );
};

export default LoansPage;

