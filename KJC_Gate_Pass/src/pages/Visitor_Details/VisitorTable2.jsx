import React, { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Collapse,
  Avatar,
  TablePagination,
  Typography,
  Grid,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import profile from "../../assets/profile.svg";
import { formatDateWithPadding } from "../../library/helper.js";

// Helper function to parse dates
const parseDate = (dateString) => new Date(dateString).getTime();

const VisitorTable2 = ({ visitors }) => {
  const [expandedRows, setExpandedRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const columns = useMemo(
    () => [
      { Header: "Name", accessor: "name" },
      { Header: "Phone Number", accessor: "phone_number" },
      { Header: "Check-in Time", accessor: "check_in_time" },
      {
        Header: "Check-out Time",
        accessor: "check_out_time",
        sortType: (rowA, rowB, columnId) => {
          const dateA = parseDate(rowA.values[columnId]);
          const dateB = parseDate(rowB.values[columnId]);
          return dateA - dateB;
        },
      },
      {
        Header: "Details",
        accessor: "details",
        Cell: ({ row }) => (
          <Button
  sx={{
    backgroundColor: "white !important", // Set white background
    color: "black !important", // Black text
    border: "1px", // Black border
    borderRadius: "5px !important", // Curved corners
    padding: "6px 12px", // Adjust padding for a clean look
    textTransform: "none", // Disable uppercase transformation
    boxShadow: "none", // Remove any button shadows
    "&:hover": {
      backgroundColor: "#f0f0f0 !important", // Subtle grey on hover
      borderColor: "black", // Keep black border on hover
    },
  }}
  endIcon={
    <ExpandMore
      sx={{
        transform: expandedRows.includes(row.index) ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 0.3s ease",
      }}
    />
  }
  onClick={() => toggleRow(row.index)}
>
  Details
</Button>

        ),
        disableSortBy: true,
      },
    ],
    [expandedRows]
  );

  const data = useMemo(() => visitors, [visitors]);

  const toggleRow = (index) => {
    const isRowExpanded = expandedRows.includes(index);
    if (isRowExpanded) {
      setExpandedRows(expandedRows.filter((rowIndex) => rowIndex !== index));
    } else {
      setExpandedRows([...expandedRows, index]);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box >
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="visitor table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.accessor} sx={{ fontWeight: 'bold' }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {column.Header}
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <React.Fragment key={index}>
                  <TableRow
                    hover
                    onClick={() => toggleRow(index)}
                    sx={{ cursor: "pointer" }}
                  >
                    {columns.map((column) => (
                      <TableCell key={column.accessor}>
                        {column.accessor === "check_in_time" ||
                          column.accessor === "check_out_time"
                          ? formatDateWithPadding(row[column.accessor])
                          : column.accessor === "details"
                            ? column.Cell({ row })
                            : row[column.accessor]}
                      </TableCell>
                    ))}
                  </TableRow>
                  {expandedRows.includes(index) && (
                    <TableRow>
                      <TableCell colSpan={columns.length}>
                        <Collapse
                          in={expandedRows.includes(index)}
                          timeout="auto"
                          unmountOnExit
                        >
                          {/* Begin updated custom details section */}
                          <Box sx={{ padding: 1, backgroundColor: "#f9f9f9", display: "flex", }}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={8}>
                                <Typography variant="subtitle1" gutterBottom>
                                  <b>Purpose of Visit:</b> {row.purpose_of_visit}
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom>
                                  <b>Entry Gate:</b> {row.entry_gate}
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom>
                                  <b>Check-In Time:</b> {formatDateWithPadding(row.check_in_time)}
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom>
                                  <b>Exit Gate:</b> {row.exit_gate}
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom>
                                  <b>Check-out Time:</b> {formatDateWithPadding(row.check_out_time)}
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom>
                                  <b>Group Size:</b> {row.group_size}
                                </Typography>
                                <Box mt={2}>
                                  <Typography variant="subtitle1" gutterBottom>
                                    <b>Card Ids:</b>
                                  </Typography>

                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexWrap: 'wrap',
                                      gap: '8px',
                                    }}
                                  >
                                    {row.visitor_cards.map((card) => (
                                      <Box
                                        key={card.card_id}
                                        sx={{
                                          display: "inline-block",
                                          padding: "2px 8px",
                                          margin: "2px",
                                          borderRadius: "4px",
                                          backgroundColor:
                                            card.status === "checked_out"
                                              ? "#28a745"
                                              : "#f44336",
                                          color: "#fff",
                                        }}
                                      >
                                        {card.card_id}
                                      </Box>
                                    ))}
                                  </Box>
                                </Box>
                              </Grid>
                              <Grid item xs={12} md={4}>
                                {row.photos ? (
                                  <Avatar
                                    src={row.photos}
                                    alt="Profile"
                                    sx={{
                                      width: 150,
                                      height: 150,
                                      borderRadius: "8px",

                                    }}
                                  />
                                ) : (
                                  <Avatar
                                    src={profile}
                                    alt="Default Profile"
                                    sx={{
                                      width: 150,
                                      height: 150,
                                      borderRadius: "8px",
                                    }}
                                  />
                                )}
                              </Grid>
                              <Grid item xs={12} mt={2}>
                                {row.visitor_cards.length > 0 ? (
                                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}> {/* New Flexbox container */}

                                    {row.visitor_cards.map((card, cardIndex) => (
                                      <Box
                                        key={cardIndex}
                                        sx={{
                                          backgroundColor:
                                            card.status === "checked_out"
                                              ? "#e8f5e9"
                                              : "#ffebee",
                                          padding: "10px",
                                          marginBottom: "10px",
                                          borderRadius: "8px",
                                          width: "30%",




                                        }}
                                      >
                                        <Typography variant="body2" gutterBottom>
                                          <b>Card ID:</b> {card.card_id}
                                        </Typography>
                                        <Typography variant="body2" gutterBottom>
                                          <b>Exit Gate:</b> {card.exit_gate || "N/A"}
                                        </Typography>
                                        <Typography variant="body2" gutterBottom>
                                          <b>Check-out Time:</b>{" "}
                                          {formatDateWithPadding(card.check_out_time)}
                                        </Typography>
                                        <Typography variant="body2" gutterBottom>
                                          <b>Status:</b>{" "}
                                          <Box
                                            component="span"
                                            sx={{
                                              padding: "2px 8px",
                                              borderRadius: "4px",
                                              backgroundColor:
                                                card.status === "checked_out"
                                                  ? "#28a745"
                                                  : "#f44336",
                                              color: "#fff",

                                            }}
                                          >
                                            {card.status}
                                          </Box>
                                        </Typography>
                                      </Box>
                                    ))}
                                  </Box>
                                ) : (
                                  <Typography variant="body2" color="textSecondary">
                                    No group members found.
                                  </Typography>
                                )}
                              </Grid>
                            </Grid>
                          </Box>
                          {/* End updated custom details section */}
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default VisitorTable2;
