import React, { useState, useEffect } from 'react';
import TableHeader from './TableHeader.jsx';
import TableRow from './TableRow.jsx';
import './VisitorTable.css'; // Import CSS for styling

const VisitorTable = ({ visitors, totalVisitorCount }) => {
  const [filterText, setFilterText] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [cleanedVisitors, setCleanedVisitors] = useState([]);

  useEffect(() => {
    // Remove duplicates based on unique property (assuming _id is unique)
    const uniqueVisitors = visitors.filter((visitor, index, self) =>
      index === self.findIndex((v) => v._id === visitor._id)
    );
    setCleanedVisitors(uniqueVisitors);
  }, [visitors]);

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const filteredVisitors = cleanedVisitors.filter((visitor) => {
    return (
      visitor.name.toLowerCase().includes(filterText.toLowerCase()) ||
      visitor.phone_number.includes(filterText)
    );
  });

  const sortedVisitors = filteredVisitors.sort((a, b) => {
    if (sortConfig.key === '') return 0;
    const aValue = a[sortConfig.key] || '';
    const bValue = b[sortConfig.key] || '';
    
    if (aValue === bValue) {
      return a._id.localeCompare(b._id); // Ensure stable sorting by ID
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortConfig.direction === 'ascending'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortConfig.direction === 'ascending' ? aValue - bValue : bValue - aValue;
    }
    const aDate = new Date(aValue);
    const bDate = new Date(bValue);
    return sortConfig.direction === 'ascending'
      ? aDate - bDate
      : bDate - aDate;
  });

  return (
    <div className='data-grid-table'>
      <div className='text-count'>
        <span>
          <h2>Visitor Data Grid</h2>
          <input
            type="text"
            placeholder="Filter by name or phone number"
            value={filterText}
            onChange={handleFilterChange}
          />
        </span>
        <h1>{totalVisitorCount}</h1>
      </div>
      <table className="visitor-table">
        <TableHeader onSort={handleSort} sortConfig={sortConfig} mode="visitors" />
        <tbody>
          {sortedVisitors.map((visitor) => (
            <TableRow key={visitor._id} visitor={visitor} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VisitorTable;
