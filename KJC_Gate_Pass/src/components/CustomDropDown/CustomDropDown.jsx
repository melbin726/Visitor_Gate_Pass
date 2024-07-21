import React, { useState, useEffect, useRef } from 'react';
import './CustomDropDown.css';

const CustomDropDown = ({ options = [], value, onChange, placeholder, widths, heights }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value ? value.label : '');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (options && options.length > 0) {
      setFilteredOptions(
        options.filter(option =>
          option.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, options]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionClick = (option) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm(option.label);
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
    // Trigger onChange with custom input if necessary
    onChange({ value: event.target.value, label: event.target.value });
  };

  return (
    <div className="custom-dropdown" style={{ width: `${widths * 1.2}px`, height: heights ? `${heights}px` : 'auto' }} ref={dropdownRef}>
      <div
        className="custom-dropdown-control"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="custom-dropdown-placeholder" style={{ width: `${widths}px`, height: heights ? `${heights}px` : 'auto' }}>
          {searchTerm || placeholder}
        </div>
        <div className="custom-dropdown-arrow">
          {isOpen ? '▲' : '▼'}
        </div>
      </div>
      {isOpen && (
        <div className="custom-dropdown-menu" style={{ width: `${widths * 3.5}px`, height: heights ? `${heights}px` : 'auto' }}>
          <input
            type="text"
            className="custom-dropdown-search"
            style={{ width: `${widths * 3}px`, height: heights ? `${heights}px` : 'auto' }}
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="Type to search..."
          />
          <div className="custom-dropdown-options">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className="custom-dropdown-option"
                  onClick={() => handleOptionClick(option)}
                  style={{ width: `${widths}px`, height: heights ? `${heights}px` : 'auto' }}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className="custom-dropdown-no-options">No options found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDropDown;
