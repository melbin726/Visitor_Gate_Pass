import React, { useMemo, useState } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import StatusBadge from "./StatusBadge.jsx";
import "./VisitorTable.css"; // Import CSS for styling

const ReactVisitorTable = ({ visitors, totalVisitorCount }) => {
  const [filterText, setFilterText] = useState("");

  const columns = useMemo(
    () => [
      { Header: "Name", accessor: "name" },
      { Header: "Phone Number", accessor: "phone_number" },
      { Header: "Purpose of Visit", accessor: "purpose_of_visit" },
      { Header: "Entry Gate", accessor: "entry_gate" },
      {
        Header: "Check-In Time",
        accessor: "check_in_time",
        Cell: ({ value }) => new Date(value).toLocaleString(),
      },
      { Header: "Exit Gate", accessor: "exit_gate" },
      {
        Header: "Check-Out Time",
        accessor: "check_out_time",
        Cell: ({ value }) => (value ? new Date(value).toLocaleString() : "N/A"),
      },
      { Header: "Group Size", accessor: "group_size" },
      {
        Header: "Visitor ID Cards",
        accessor: "visitor_cards",
        Cell: ({ value }) => (
          <div style={{ textAlign: "left" }}>
            {value.map((card) => (
              <StatusBadge key={card.card_id} card={card} />
            ))}
          </div>
        ),
        disableSortBy: true, // Disable sorting for this column
      },
      {
        Header: "Photos",
        accessor: "photos",
        Cell: ({ value }) => (
          <div className="flex flex-1 justify-center">
            <img
              className="w-7 h-7"
              src={value}
              alt="Visitor"
              width="30"
              height="30"
            />
          </div>
        ),
        disableSortBy: true, // Disable sorting for this column
      },
    ],
    []
  );

  const filteredData = useMemo(() => {
    return visitors.filter(
      (visitor) =>
        visitor.name.toLowerCase().includes(filterText.toLowerCase()) ||
        visitor.phone_number.includes(filterText)
    );
  }, [filterText, visitors]);

  const data = useMemo(() => filteredData, [filteredData]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page, // Use page instead of rows
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

  return (
    <div className="data-grid-table">
      <div className="text-count">
        <span>
          <h2>Visitor Data Grid</h2>
          <input
            type="text"
            placeholder="Filter by name or phone number"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="border w-56 border-gray-400 rounded"
          />
        </span>
        <h1 className="text-2xl">{totalVisitorCount}</h1>
      </div>
      <table {...getTableProps()} className="visitor-table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  {/* Add a sort direction indicator */}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps({ key: row.original.id })}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination-controls">
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          Previous
        </button>
        <span>
          Page {pageIndex + 1} of {pageCount}
        </span>
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          Next
        </button>
      </div>
    </div>
  );
};

export default ReactVisitorTable;
