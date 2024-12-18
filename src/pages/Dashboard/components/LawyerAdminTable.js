import { Container, InputAdornment, Paper, TextField } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import Modal from "@mui/material/Modal";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import { visuallyHidden } from "@mui/utils";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ReactComponent as Search } from "../../../assets/dashboard/search.svg";
import MessageModal from "../../../common/MessageModal";
import myApi from "../../../utils/axios";
import styles from "./component.module.scss";

export default function LawyerAdminTable({
  open,
  setOpen,
  setCase,
  assignCaseToLawyer,
}) {
  console.log("setCase", setCase);
  const [searchValue, setSearchValue] = React.useState("");
  const [lawyers, setLawyers] = useState([]);
  const [rowsData, setRowsData] = useState([]);
  const [totalNumberOfCases, setTotalNumberOfCases] = React.useState(null);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [page, setPage] = React.useState(0);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [assignCaseToLawyerModal, setAssignCaseToLawyerModal] =
    React.useState(false);

  const handleClose = () => setOpen(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const assignCase = (caseId, lawyerId) => {
    assignCaseToLawyer(caseId, lawyerId);
    setOpen(false);
  };

  const headCellClient = [
    {
      id: "id",
      label: "ID",
      width: 70,
      disableColumnMenu: true,
    },
    {
      id: "name",
      label: "Name",
      flex: 1,
      minWidth: 260,
      disableColumnMenu: true,
    },
    {
      id: "username",
      label: "Username",
      flex: 1,
      minWidth: 260,
      disableColumnMenu: true,
    },
    {
      id: "email",
      label: "Email",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      flex: 1,
      minWidth: 300,
      disableColumnMenu: true,
    },
  ];

  function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead className={styles.tableHead}>
        <TableRow>
          {/* <TableCell></TableCell> */}
          {headCellClient.map((headCell) => (
            <TableCell
              key={headCell.id}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  const getLawyers = async () => {
    try {
      const response = await axios.get(
        `${
          process.env.REACT_APP_BASE_API_URL
        }api/auth/user/?type=lawyer&page_size=${rowsPerPage}${
          page >= 1 ? "&page=" + (page + 1) : ""
        }`,
        {
          headers: {
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        },
      );

      setLawyers(response.data.results);
      setTotalNumberOfCases(response.data.count);
    } catch (error) {
      // Handle the error
    }
  };

  const applySearch = (value) => {
    if (value.length > 0 && lawyers!= null) {
      const filteredRows = lawyers.filter((row) => {
        return (
          row.id?.toString()?.toLowerCase().includes(value?.toLowerCase()) ||
          row.email?.toLowerCase().includes(value?.toLowerCase()) ||
          row.username?.toLowerCase().includes(value?.toLowerCase()) ||
          row.name?.toLowerCase().includes(value?.toLowerCase())
        );
      });
      setLawyers(filteredRows);
    } else {
      getLawyers();
    }
  };

  React.useEffect(() => {
    getLawyers();
  }, [page, rowsPerPage]);

  useEffect(() => {
    applySearch(searchValue);
  }, [searchValue]);

  useEffect(() => {
    getLawyers();
  }, []);

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Container
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "1200",
              bgcolor: "#fff",
              boxShadow: 24,
              p: 4,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h1
                style={{
                  fontFamily: "Tomato Grotesk",
                  fontWeight: "500",
                  fontSize: "30px",
                  lineHeight: "1.2",
                  color: "#008284",
                }}
              >
                Lawyers
              </h1>
              <span></span>
              <TextField
                style={{ marginBottom: "2%" }}
                className={styles.searchBar}
                id="application-search"
                placeholder="Search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </div>

            <Box sx={{ width: "100%" }} className={styles["dataTable-wrapper"]}>
              <Box className={styles.dataTable}>
                <TableContainer component={Paper} style={{ maxHeight: 400 }}>
                  <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                    <EnhancedTableHead
                      numSelected={selected.length}
                      order={order}
                      orderBy={orderBy}
                    />
                    <TableBody>
                      {lawyers.map((row, index) => {
                        return (
                          <>
                            <TableRow
                              hover
                              tabIndex={-1}
                              key={row.LspName}
                              sx={{ cursor: "pointer" }}
                              onClick={(e) => {
                                assignCase(setCase?.id, row.id);
                              }}
                            >
                              <TableCell onClick={() => {}}>
                                <strong>{row.id}</strong>
                              </TableCell>

                              <TableCell
                                component="th"
                                scope="row"
                                onClick={() => {}}
                              >
                                <strong>{row.name}</strong>
                              </TableCell>

                              <TableCell
                                component="th"
                                scope="row"
                                onClick={() => {}}
                              >
                                <strong>{row.username}</strong>
                              </TableCell>

                              <TableCell
                                component="th"
                                scope="row"
                                onClick={() => {}}
                              >
                                <strong>{row.email}</strong>
                              </TableCell>
                            </TableRow>
                          </>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>

                <TablePagination
                  rowsPerPageOptions={[10, 20, 30, 40, 50]}
                  component="div"
                  count={totalNumberOfCases}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Box>
            </Box>
          </Container>
        </Fade>
      </Modal>
    </div>
  );
}
