// TableHeader.jsx

import React from 'react';

const TableHeader = ({ onSort, sortConfig }) => {
    const getClassNamesFor = (name) => {
        if (!sortConfig) {
            return;
        }
        return sortConfig.key === name ? sortConfig.direction : undefined;
    };

    return (
        <thead>
            <tr>
                <th onClick={() => onSort('name')} className={getClassNamesFor('name')}>Name</th>
                <th onClick={() => onSort('phone_number')} className={getClassNamesFor('phone_number')}>Phone Number</th>
                <th>Purpose of Visit</th>
                <th>Entry Gate</th>
                <th onClick={() => onSort('check_in_time')} className={getClassNamesFor('check_in_time')}>Check-In Time</th>
                <th>Exit Gate</th>
                <th onClick={() => onSort('check_out_time')} className={getClassNamesFor('check_out_time')}>Check-Out Time</th>
                <th>Group Size</th>
                <th>Visitor ID Cards</th>
                <th>Photos</th>
            </tr>
        </thead>
    );
};

export default TableHeader;
