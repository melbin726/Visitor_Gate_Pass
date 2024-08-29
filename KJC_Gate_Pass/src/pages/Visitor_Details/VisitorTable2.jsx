import React, { useMemo, useState } from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextField } from '@mui/material'; // Don't forget to import TextField
import { format } from 'date-fns';
import './VisitorTable2.css';
import dropdown_logo from '../../assets/Icons/dropdown_logo.svg';
import profile from '../../assets/profile.svg';
import { formatDateWithPadding } from '../../library/helper.js';

const VisitorTable2 = ({ visitors }) => {
    const [expandedRows, setExpandedRows] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);

    const filteredVisitors = useMemo(() => {
        if (!selectedDate) return visitors;
        // Ensure selectedDate is valid before formatting
        if (selectedDate.isValid()) {
            const formattedSelectedDate = format(selectedDate.toDate(), 'yyyy-MM-dd'); // Convert to JavaScript date
            return visitors.filter(visitor => format(new Date(visitor.check_in_time), 'yyyy-MM-dd') === formattedSelectedDate);
        }
        return visitors; // If the date is invalid, return the original visitors array
    }, [visitors, selectedDate]);

    const columns = useMemo(
        () => [
            {
                Header: 'Name',
                accessor: 'name',
                sortType: 'basic'
            },
            {
                Header: 'Phone Number',
                accessor: 'phone_number',
                sortType: 'basic'
            },
            {
                Header: 'Check-in Time',
                accessor: 'check_in_time',
                sortType: 'basic'
            },
            {
                Header: 'Check-out Time',
                accessor: 'check_out_time',
                sortType: 'basic'
            },
            {
                Header: 'Details',
                accessor: 'details',
                Cell: ({ row }) => (
                    <div className='logoclass'>
                        Details
                        <div className={`dropdown-icon ${expandedRows.includes(row.index) ? 'rotated' : ''}`}>
                            <img src={dropdown_logo} alt="Dropdown" />
                        </div>
                    </div>
                ),
                disableSortBy: true // Disable sorting for the Details column
            }
        ],
        [expandedRows]
    );

    const data = useMemo(() => filteredVisitors, [filteredVisitors]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        state: { pageIndex, pageSize },
        setPageSize,
        gotoPage,
        canPreviousPage,
        canNextPage,
        pageCount,
        nextPage,
        previousPage,
    } = useTable(
        {
            columns,
            data,
            initialState: {
                pageIndex: 0,
                pageSize: 10,
            },
        },
        useSortBy,
        usePagination
    );

    const toggleRow = (index) => {
        const isRowExpanded = expandedRows.includes(index);
        if (isRowExpanded) {
            setExpandedRows(expandedRows.filter(rowIndex => rowIndex !== index));
        } else {
            setExpandedRows([...expandedRows, index]);
        }
    };

    return (
        <div className="vt_table-container">
            <LocalizationProvider dateAdapter={AdapterDayjs} >
<DatePicker
    label="Select Date"
    value={selectedDate}
    onChange={(newValue) => setSelectedDate(newValue)}
    renderInput={(params) => (
        <TextField {...params} />
    )}
    components={{
        OpenPickerIcon: () => (
            <CalendarTodayIcon style={{ fontSize: '1px' }} /> // Set a smaller size for the custom icon
        ),
    }}
/>
            </LocalizationProvider>

            <table className="vt_visitor-table" {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr className='tr' {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th
                                    {...column.getHeaderProps(column.getSortByToggleProps())}
                                >
                                    {column.render('Header')}
                                    <span>
                                        {column.isSorted
                                            ? column.isSortedDesc
                                                ? ' 🔽'
                                                : ' 🔼'
                                            : ''}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map(row => {
                        prepareRow(row);
                        return (
                            <React.Fragment key={row.index}>
                                <tr
                                    {...row.getRowProps()}
                                    onClick={() => toggleRow(row.index)}
                                    className="vt_table-row"
                                >
                                    {row.cells.map(cell => (
                                        <td {...cell.getCellProps()}>
                                            {cell.column.id === 'check_in_time' || cell.column.id === 'check_out_time'
                                                ? formatDateWithPadding(cell.value)
                                                : cell.render('Cell')}
                                        </td>
                                    ))}
                                </tr> 
                                {expandedRows.includes(row.index) && (
                                    <tr className="expanded-row">
                                        <td className="vt_tdclass" colSpan="6">
                                            <div className='vt_tabledetails'>
                                                <div className="vt_main-section-form">
                                                    <div className="vt_left-section-form">
                                                        <div className='vt_sessiondetail'><b>Purpose of Visit:</b> {row.original.purpose_of_visit}</div>
                                                        <div className='vt_sessiondetail'><b>Entry Gate:</b> {row.original.entry_gate}</div>
                                                        <div className='vt_sessiondetail'><b>Check-In Time:</b> {formatDateWithPadding(row.original.check_in_time)}</div>
                                                        <div className='vt_sessiondetail'><b>Exit Gate:</b> {row.original.exit_gate}</div>
                                                        <div className='vt_sessiondetail'><b>Check-out Time:</b> {formatDateWithPadding(row.original.check_out_time)}</div>
                                                        <div className='vt_sessiondetail'><b>Group Size:</b> {row.original.group_size}</div> 
                                                        <div className="vt_sessiondetail">
                                                            <b>Card Id</b>:&nbsp;&nbsp;
                                                            {row.original.visitor_cards.map((card, index) => (
                                                                <span
                                                                    key={card.card_id}
                                                                    style={{ backgroundColor: card.status === 'checked_out' ? '#28a745' : 'red'}}
                                                                    className='card-left-section'
                                                                >
                                                                    {card.card_id}
                                                                </span>
                                                            )).reduce((prev, curr) => [prev, '', curr])}
                                                        </div>
                                                    </div>

                                                    <div className="vt_separator"></div>

                                                    <div className="vt_center-section-form">
                                                        {row.original.visitor_cards.length > 0 ? (
                                                            row.original.visitor_cards.map((card, cardIndex) => (
                                                                <div key={cardIndex} className='vt_Groupcard1' style={{backgroundColor: card.status === 'checked_out' ? '#c0f7b5' : '#f7b5b5' }}>
                                                                    <div className='vt_card'>
                                                                        <div className='vt_card_details'>
                                                                            <p><b>Card ID:</b> {card.card_id}</p>
                                                                        </div>
                                                                        <div className='vt_card_details'>
                                                                            <p><b>Exit Gate:</b> {card.exit_gate || 'N/A'}</p>
                                                                        </div>
                                                                        <div className='vt_card_details'>
                                                                            <p><b>Check-out Time:</b> {formatDateWithPadding(card.check_out_time)}</p>
                                                                        </div>
                                                                        <div className='vt_card_details' style={{margin: 0}}>
                                                                            <b>Status:</b> <span style={{backgroundColor: card.status === 'checked_out' ? '#28a745' : 'red'}}>{card.status}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <p>No group members found.</p>
                                                        )}
                                                    </div>

                                                    <div className="vt_separator"></div>
                                                    
                                                    <div className="vt_right-section-formm">
                                                        <div className='image_container'>
                                                            {row.original.photos ? (
                                                                <img src={row.original.photos} className='visitorDetails_image_container' alt="Profile" />
                                                            ) : (
                                                                <img src={profile} className='visitorDetails_image_container' alt="Default Profile" />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="pagination-controls">
                <button
                    onClick={() => previousPage()}
                    disabled={!canPreviousPage}
                >
                    Previous
                </button>
                <span>
                    Page {pageIndex + 1} of {pageCount}
                </span>
                <button
                    onClick={() => nextPage()}
                    disabled={!canNextPage}
                >
                    Next
                </button>
                <select
                    value={pageSize}
                    onChange={e => {
                        setPageSize(Number(e.target.value));
                    }}
                >
                    {[10, 20, 30, 40].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default VisitorTable2;
