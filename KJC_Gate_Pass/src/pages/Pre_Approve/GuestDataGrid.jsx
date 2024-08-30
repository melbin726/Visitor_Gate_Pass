import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { IconButton, TextField } from "@mui/material";
import Stack from "@mui/material/Stack";
import EmailIcon from "@mui/icons-material/Email";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useState } from "react";

const handleResendEmail = (row) => {
  confirm("Are you sure you want to send an invitation to: " + row.email);
};

const GuestDataGrid = () => {
  const [rows, setRows] = useState(initialRows);
  const [editMode, setEditMode] = useState({}); // Track which rows are in edit mode
  const [filterDate, setFilterDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleOnChange = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
  };

  const handleDateFilterChange = (date) => {
    setFilterDate(date);
  };

  const toggleEditMode = (id) => {
    setEditMode((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSaveClick = (id) => {
    // You can add your save logic here, like sending data to the backend
    toggleEditMode(id);
  };

  const handleCancelClick = (id) => {
    // Restore row data from backup
    toggleEditMode(id);
    const restoredRows = rows.map((row) =>
      row.id === id ? rowBackup[id] : row
    );
    setRows(restoredRows);
  };
  // Handle cell edits
  const handleCellEditCommit = React.useCallback(
    (params) => {
      const updatedRows = rows.map((row) => {
        if (row.id === params.id) {
          return { ...row, [params.field]: params.value };
        }
        return row;
      });
      setRows(updatedRows);
    },
    [rows]
  );

  // Columns configuration
  const columns = [
    {
      field: "passId",
      headerName: "Pass Id",
      width: 100,
      type: "number",
      sortable: true,
      renderCell: (params) => {
        const formattedValue = params.value
          ? params.value.toString().padStart(4, "0")
          : "N/A";
        return editMode[params.id] ? (
          <input
            value={formattedValue}
            onChange={(e) =>
              handleCellEditCommit({
                id: params.id,
                field: "passId",
                value: e.target.value,
              })
            }
          />
        ) : (
          <div>{formattedValue}</div>
        );
      },
    },
    {
      field: "name",
      headerName: "Name",
      width: 150,
      sortable: true,
      editable: true,
      renderCell: (params) =>
        editMode[params.id] ? (
          <input
            value={params.value}
            onChange={(e) =>
              handleCellEditCommit({
                id: params.id,
                field: "name",
                value: e.target.value,
              })
            }
          />
        ) : (
          <div>{params.value}</div>
        ),
    },
    {
      field: "mobileNo",
      headerName: "Mobile No",
      width: 150,
      sortable: false,
      editable: true,
      renderCell: (params) =>
        editMode[params.id] ? (
          <input
            value={params.value}
            onChange={(e) =>
              handleCellEditCommit({
                id: params.id,
                field: "mobileNo",
                value: e.target.value,
              })
            }
          />
        ) : (
          <div>{params.value}</div>
        ),
    },
    {
      field: "date",
      headerName: "Date",
      width: 130,
      sortable: true,
      editable: true,
      renderCell: (params) =>
        editMode[params.id] ? (
          <input
            value={params.value}
            onChange={(e) =>
              handleCellEditCommit({
                id: params.id,
                field: "date",
                value: e.target.value,
              })
            }
          />
        ) : (
          <div>{params.value}</div>
        ),
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
      sortable: true,
      editable: true,
      renderCell: (params) =>
        editMode[params.id] ? (
          <input
            value={params.value}
            onChange={(e) =>
              handleCellEditCommit({
                id: params.id,
                field: "email",
                value: e.target.value,
              })
            }
          />
        ) : (
          <div>{params.value}</div>
        ),
    },
    {
      field: "event",
      headerName: "Event",
      width: 150,
      sortable: true,
      editable: false,
      renderCell: (params) =>
        editMode[params.id] ? (
          <input
            value={params.value}
            onChange={(e) =>
              handleCellEditCommit({
                id: params.id,
                field: "event",
                value: e.target.value,
              })
            }
          />
        ) : (
          <div>{params.value}</div>
        ),
    },
    {
      field: "invitedAs",
      headerName: "Invited As",
      width: 150,
      sortable: true,
      editable: true,
      renderCell: (params) =>
        editMode[params.id] ? (
          <input
            value={params.value}
            onChange={(e) =>
              handleCellEditCommit({
                id: params.id,
                field: "invitedAs",
                value: e.target.value,
              })
            }
          />
        ) : (
          <div>{params.value}</div>
        ),
    },
    {
      field: "Actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          {editMode[params.id] ? (
            <>
              <IconButton
                size="small"
                onClick={() => handleSaveClick(params.id)}
              >
                <SaveIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleCancelClick(params.id)}
              >
                <CancelIcon fontSize="small" />
              </IconButton>
            </>
          ) : (
            <IconButton size="small" onClick={() => toggleEditMode(params.id)}>
              <EditIcon fontSize="small" />
            </IconButton>
          )}
          <IconButton
            size="small"
            onClick={() => handleResendEmail(params.row)}
          >
            <EmailIcon fontSize="small" />
          </IconButton>
        </Stack>
      ),
      sortable: false,
      filterable: false,
    },
  ];

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        backgroundColor: "#f2f9ff",
      }}
    >
      <div
        className="search-filter-txt"
        style={{ display: "flex", justifyContent: "flex-end", padding: "16px" }}
      >
        <Stack direction="row" spacing={2}>
          <TextField
            sx={{ backgroundColor: "#ffffff" }}
            id="search-filter"
            label="Search by name or Pass Id"
            variant="outlined"
            value={searchTerm}
            onChange={handleOnChange}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              sx={{ backgroundColor: "#ffffff" }}
              label="Filter by Date"
              value={filterDate}
              onChange={handleDateFilterChange}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Stack>
      </div>
      <DataGrid
        sx={{
          border: "1px solid white",
          borderRadius: "15px",
          boxShadow: "2",
          backgroundColor: "#ffffff",
        }}
        rows={rows.filter((row) => {
          const matchesSearchTerm =
            row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.passId.toString().includes(searchTerm);
          const matchesDateFilter = filterDate
            ? new Date(row.date).toDateString() ===
              new Date(filterDate).toDateString()
            : true;
          return matchesSearchTerm && matchesDateFilter;
        })}
        columns={columns}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        pageSizeOptions={[10, 20, 50]}
        components={{
          Toolbar: GridToolbar,
        }}
        disableSelectionOnClick
        disableColumnMenu
        onCellEditCommit={handleCellEditCommit} // Handle cell edit commits
        style={{ height: 650, width: "100%" }}
      />
    </div>
  );
};

// Sample initial rows
const initialRows = [
  {
    id: 1,
    passId: 2001,
    name: "Guest 1",
    mobileNo: "9876543201",
    date: new Date().toISOString().split("T")[0],
    email: "guest1@example.com",
    event: "Event 1",
    invitedAs: "Speaker",
  },
  // Add more rows here...
];

export default GuestDataGrid;
