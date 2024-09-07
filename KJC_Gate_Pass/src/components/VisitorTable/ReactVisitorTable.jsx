import React, { useMemo, useState } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import StatusBadge from "../../components/DataGrid/StatusBadge.jsx";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Container,
  Typography,
  Button,
  Box,
  styled,
} from "@mui/material";

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(4),
  '@media (max-width: 600px)': {
    marginTop: theme.spacing(2),
  },
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.grey[200],
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  '@media (max-width: 600px)': {
    fontSize: "12px",
    padding: theme.spacing(1),
  },
}));

const FilterContainer = styled('div')(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    flexDirection: "column",
    alignItems: "start",
  },
}));

const PhotoCell = styled('div')({
  display: "flex",
  justifyContent: "center",
});

const PaginationControls = styled('div')(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  marginTop: theme.spacing(2),
  '@media (max-width: 600px)': {
    marginTop: theme.spacing(1),
    flexDirection: "column",
    alignItems: "center",
    gap: theme.spacing(1),
  },
}));

const HorizontalStatusBadgeContainer = styled(Box)({
  display: 'flex',
  flexWrap: 'nowrap',
  gap: '8px',
  overflowX: 'auto',
});

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
          <HorizontalStatusBadgeContainer>
            {value.map((card) => (
              <StatusBadge key={card.card_id} card={card} />
            ))}
          </HorizontalStatusBadgeContainer>
        ),
        disableSortBy: true,
      },
      {
        Header: "Photos",
        accessor: "photos",
        Cell: ({ value }) => (
          <PhotoCell>
            <img
              src={value}
              alt="Visitor"
              width="30"
              height="30"
            />
          </PhotoCell>
        ),
        disableSortBy: true,
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

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        mt: 8, 
        px: { 
          xs: 0,  
          sm: 0,  
          md: 3, 
          lg: 4, 
          xl: 5,  
          marginBottom:6, 
        },
      }}
    >
      <FilterContainer>
        <Typography
          variant="h5"
          sx={{
            paddingLeft: {
              xs: 2, 
            },
            fontSize: {
              xs: "18px",
              sm: "20px",
              md: "24px",
            },
          }}
        >
          Today's Visitors
        </Typography>
        <TextField
          sx={{
            paddingLeft: {
              xs: 2, 
            },
            width: {
              xs: "100%", 
              sm: "auto", 
            },
            "& .MuiInputBase-root": { 
              fontSize: "12px", 
              padding: {
                xs: "4px 8px", 
                sm: "8px 12px", 
              },
            },
          }}
          variant="outlined"
          size="small"
          placeholder="Filter by name or phone number"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </FilterContainer>

      <StyledTableContainer component={Paper}>
        <Table {...getTableProps()} size="small">
          <StyledTableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <StyledTableCell
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                  >
                    {column.render("Header")}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽"
                          : " 🔼"
                        : ""}
                    </span>
                  </StyledTableCell>
                ))}
              </TableRow>
            ))}
          </StyledTableHead>
          <TableBody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <TableRow {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <TableCell
                      {...cell.getCellProps()}
                      sx={{
                        fontSize: {
                          xs: "12px",
                          sm: "14px",
                        },
                        padding: {
                          xs: "8px",
                          sm: "10px",
                        },
                      }}
                    >
                      {cell.render("Cell")}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </StyledTableContainer>

     <PaginationControls
  sx={{
    display: "flex",
    alignItems: "center", 
    justifyContent: "space-between", 
    gap: "8px",
    flexDirection: {
      xs: "row",
      sm: "row", 
    },
    flexWrap: "nowrap", 
    marginTop: {
      xs: 1,
      sm: 2,
    },
  }}
>
  <Button
    variant="outlined"
    onClick={() => previousPage()}
    disabled={!canPreviousPage}
    sx={{
      fontSize: {
        xs: "8px",
        sm: "10px", 
        md: "12px", 
      },
      padding: {
        xs: "4px 8px",
        sm: "6px 10px",
        md: "8px 12px", 
      },
      minWidth: {
        xs: "50px",
        sm: "80px", 
      },
    }}
  >
    Previous
  </Button>

  <Typography
    sx={{
      fontSize: {
        xs: "8px", 
        sm: "10px", 
        md: "12px", 
      },
    }}
  >
    Page {pageIndex + 1} of {pageCount}
  </Typography>

  <Button
    variant="outlined"
    onClick={() => nextPage()}
    disabled={!canNextPage}
    sx={{
      fontSize: {
        xs: "8px", 
        sm: "10px", 
        md: "12px", 
      },
      padding: {
        xs: "4px 8px", 
        sm: "6px 10px", 
        md: "8px 12px",
      },
      minWidth: {
        xs: "50px", 
        sm: "80px", 
      },
    }}
  >
    Next
  </Button>
</PaginationControls>

    </Container>
  );
};

export default ReactVisitorTable;
