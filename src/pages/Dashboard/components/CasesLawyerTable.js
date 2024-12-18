import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import moment from "moment";
import Checkbox from "../../../components/CheckBox";
import IconButton from "@mui/material/IconButton";
import { ReactComponent as Search } from "../../../assets/dashboard/search.svg";
import VeraButton from "../../../components/VeraButton";
import { ReactComponent as AddIcon } from "../../../assets/add-icon.svg";
import AddNewTaskModal from "./AddNewTaskModal";

import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { visuallyHidden } from "@mui/utils";
import { ReactComponent as Delete } from "../../../assets/dashboard/trash.svg";
import { ReactComponent as Edit } from "../../../assets/dashboard/edit.svg";
import myApi from "../../../utils/axios";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import MessageModal from "../../../common/MessageModal";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import styles from "./component.module.scss";

import ConfirmationModal from "../../../common/ConfirmationsModal";
import UpdateTaskModal from "./UpdateTaskModal";

import { useLocation } from "react-router-dom";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "id",
    label: "ID",
    width: 100,
    disableColumnMenu: true,
    disablePadding: false,
  },
  {
    id: "LspName",
    width: 130,
    disableColumnMenu: true,
    disablePadding: true,
    label: "Client Name",
  },
  {
    id: "status",
    label: "Status",
    className: "status",
    width: 110,
    disableColumnMenu: true,
    disablePadding: false,
  },
  {
    id: "query_date",
    label: "Query Date",
    width: 180,
    disableColumnMenu: true,
  },

  {
    id: "actions",
    label: "",
    disableColumnMenu: true,
    sortable: false,
    width: 210,
    flex: 1,
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead className={styles.tableHead}>
      <TableRow>
        <TableCell></TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              <h3> {headCell.label} </h3>
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

// function EnhancedTableToolbar(props) {
//   const { numSelected } = props;

//   return (
//     <Toolbar
//       sx={{
//         pl: { sm: 2 },
//         pr: { xs: 1, sm: 1 },
//         ...(numSelected > 0 && {
//           bgcolor: (theme) =>
//             alpha(
//               theme.palette.primary.main,
//               theme.palette.action.activatedOpacity
//             ),
//         }),
//       }}
//     >
//       {numSelected > 0 ? (
//         <Typography
//           sx={{ flex: "1 1 100%" }}
//           color="inherit"
//           variant="subtitle1"
//           component="div"
//         >
//           {numSelected} selected
//         </Typography>
//       ) : (
//         <Typography
//           sx={{
//             flex: "1 1 100%",
//             fontSize: "16px !important",
//             fontFamily: `"Tomato Grotesk", sans-serif`,
//           }}
//           variant="h6"
//           id="tableTitle"
//           component="div"
//         >
//           Engagements
//         </Typography>
//       )}

//       {numSelected > 0 ? (
//         <Tooltip title="Delete">
//           <IconButton>
//             <DeleteIcon />
//           </IconButton>
//         </Tooltip>
//       ) : (
//         ""
//       )}
//     </Toolbar>
//   );
// }

// EnhancedTableToolbar.propTypes = {
//   numSelected: PropTypes.number.isRequired,
// };

export default function CasesLawyerTable({ getDashboardMetircs }) {
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [taskData, setTaskData] = useState(null);
  const { caseID } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(50);
  const [totalRows, setTotalRows] = React.useState(null);
  const [rowsData, setRowsData] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState("");
  const [rows, setRows] = React.useState([]);
  const [tasks, setTasks] = React.useState([]);
  const [totalNumberOfCases, setTotalNumberOfCases] = React.useState(null);
  const [openCaseStatusUpdateModal, setOpenCaseStatusUpdateModal] =
    React.useState(false);
  const [tableCollapse, setTableCollapse] = React.useState(false);
  const [currentCase, setCurrentCase] = React.useState(null);
  const [isConfirmBtnLoading, setIsConfirmBtnLoading] = React.useState(false);
  const [currentTask, setCurrentTask] = React.useState(null);
  const [isTaskUpdateModal, setIsTaskUpdateModal] = React.useState(false);
  const [noOfRows, setNoOfRows] = React.useState(0);
  const [openDeleteConfirmationModal, setDeleteConfirmationModal] =
    React.useState(false);

  function createData(
    id,
    caseID,
    client,
    status,
    query_date,
    created_at,
    fee,
    assignee,
  ) {
    return {
      id,
      caseID,
      client,
      status,
      query_date,
      created_at,
      fee,
      assignee,
    };
  }

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  // Access specific query parameters
  const lawyer_id = searchParams.get("id");

  const getData = async () => {
    if (JSON.parse(localStorage.getItem("LoggedInObj"))?.type === "admin") {
      await myApi
        .get(
          `api/auth/admin/lawyer-dashboard/?id=${lawyer_id}&page_size=${rowsPerPage}${
            page >= 1 ? "&page=" + (page + 1) : ""
          }`,
        )
        .then((res) => {
          setRowsData(res.data.data);
          setTotalNumberOfCases(res.data.count);
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      await myApi
        .get(
          `api/auth/case/?page_size=${rowsPerPage}${
            page >= 1 ? "&page=" + (page + 1) : ""
          }`,
        )
        .then((res) => {
          setRowsData(res.data.results);
          setTotalNumberOfCases(res.data.count);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };
  React.useEffect(() => {
    getData();
  }, [page, rowsPerPage]);

  const taskColumns = [
    {
      field: "title",
      headerName: "Task Title",
      width: 190,
      disableColumnMenu: true,
      headerCheckboxSelection: true,
      renderCell: (param) => (
        <>
          <Checkbox
            checked={param.row.status === "closed" ? true : false}
            onChange={(e) => {
              if (e.target.checked) {
                updateTasksStatus(param.row.id, "closed");
              } else {
                updateTasksStatus(param.row.id, "open");
              }
            }}
          />
          <span className={param.row.status === "closed" ? styles.strike : ""}>
            {param.value}
          </span>
        </>
      ),
    },
    {
      field: "status",
      headerName: "Task Status",
      className: "status",
      width: 110,
      disableColumnMenu: true,
      renderCell: (param) => (
        <span
          className={
            param.value === "open"
              ? styles.open
              : param.value === "closed"
              ? styles.close
              : styles.open
          }
        >
          {param.value}
        </span>
      ),
    },

    {
      field: "description",
      headerName: "Description",
      width: 500,
      disableColumnMenu: true,
      renderCell: (param) => (
        <span className={param.row.status === "closed" ? styles.strike : ""}>
          {param.value}
        </span>
      ),
    },
    {
      headerClassName: "customHeaderStyle",
      renderHeader: (params) => (
        <div
          className={styles.actions}
          style={{
            display: "flex",
            justifyContent: "flex-start",
            margin: "20px 0px",
          }}
        >
          <VeraButton
            variant="text"
            onClick={() => setIsAddTaskModalOpen(true)}
          >
            <AddIcon /> Add Tasks
          </VeraButton>
        </div>
      ),
      field: "actions",
      disableColumnMenu: true,
      sortable: false,
      width: 210,
      flex: 1,
      renderCell: (params) => (
        <div className={styles.actions}>
          <IconButton
            onClick={() => {
              setCurrentTask(params.row);
              setDeleteConfirmationModal(true);
            }}
          >
            <Delete />
          </IconButton>
          <IconButton
            onClick={() => {
              setCurrentTask(params.row);
              setIsTaskUpdateModal(true);
            }}
          >
            <Edit />
          </IconButton>
        </div>
      ),
    },
  ];

  React.useEffect(() => {
    if (JSON.parse(localStorage.getItem("LoggedInObj"))?.type === "admin") {
      if (rowsData.length) {
        const newRow = rowsData.map((row) => {
          return createData(
            // row.id,
            // row.lawyer,
            // row.status,
            // row.created_at,
            // row.created_by,
            // row.created_at,
            // "null",
            // "null",
            // "null"

            row.id,
            row.case_id,
            row.client,
            row.status,
            row.created_at,
            row.created_at,
          );
        });
        // setRows(newRow);
        setRows(newRow);
      }
    } else {
      if (rowsData.length) {
        const newRow = rowsData.map((row) => {
          return createData(
            row.id,
            row.case_id,
            row.client,
            row.status,
            row.created_at,
            row.created_at,
          );
        });
        setRows(newRow);
        setTotalRows(newRow);
        // if (rows.length === 0) {
        //   setRows(newRow);
        // } else {

        //   setRows((rows) => [...rows, ...newRow]);
        // }
      }
    }
  }, [rowsData]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClickStatus = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(() => {
    const outPut = stableSort(rows, getComparator(order, orderBy)).slice(
      0,
      page * rowsPerPage + rowsPerPage,
    );
    return outPut;
  }, [rows, order, orderBy, page, rowsPerPage]);

  const handleCellClick = (id) => {
    navigate(`/application/${id}`);
  };

  const [lawyers, setLawyers] = React.useState([]);

  const getCaseTasks = async (caseId) => {
    await axios
      .get(
        `${process.env.REACT_APP_BASE_API_URL}api/auth/case/task/?case=${caseId}`,
        {
          headers: {
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        },
      )
      .then((res) => {
        setTasks(res.data.results);
        getDashboardMetircs();
        setIsTaskUpdateModal(false);
      })
      .catch((err) => {});
  };

  const getLawyers = async () => {
    await axios
      .get(`${process.env.REACT_APP_BASE_API_URL}api/auth/user/?type=lawyer`, {
        headers: {
          Authorization: `JWT ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setLawyers(res.data.results);
      })
      .catch((err) => {});
  };
  const updateTasksStatus = async (taskId, status) => {
    await axios
      .put(
        `${process.env.REACT_APP_BASE_API_URL}api/auth/case/task/${taskId}/`,
        {
          status: status,
        },
        {
          headers: {
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        },
      )
      .then((res) => {
        getCaseTasks(currentCase?.id);
        // setIsTaskModalOpen(true);
        // getTasksData(caseID);
      })
      .catch((err) => {});
  };
  const deleteTask = async (taskId) => {
    setIsConfirmBtnLoading(true);
    await axios
      .delete(
        `${process.env.REACT_APP_BASE_API_URL}api/auth/case/task/${taskId}/`,
        {
          headers: {
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        },
      )
      .then((res) => {
        getCaseTasks(currentCase?.id);
        setDeleteConfirmationModal(false);
        setIsConfirmBtnLoading(false);

        // setIsTaskModalOpen(true);
        // getTasksData(caseID);
      })
      .catch((err) => {
        setIsConfirmBtnLoading(false);
      });
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [caseStatusAnchorE1, setCaseStatusAnchorE1] = React.useState(null);

  const open = Boolean(anchorEl);
  const caseStatusOpen = Boolean(caseStatusAnchorE1);

  const handleClickStatusAssignee = (event) => {
    getLawyers();
    setAnchorEl(event.currentTarget);
  };
  const handleClickStatusChange = (event, currentObj) => {
    setCurrentCase(currentObj);
    setCaseStatusAnchorE1(event.currentTarget);
  };

  const updateCaseStatus = async (caseId, caseStatus) => {
    try {
      await axios
        .put(
          `${process.env.REACT_APP_BASE_API_URL}api/auth/case/${caseId}/`,
          {
            status: caseStatus,
          },
          {
            headers: {
              Authorization: `JWT ${localStorage.getItem("token")}`,
            },
          },
        )
        .then((res) => {
          setRows([]);
          getData();
          setOpenCaseStatusUpdateModal(true);
        });
    } catch (e) {
      console.log("error ");
    }
  };

  const case_status = ["closed", "open", "in_progress"];
  const handleClose = () => {
    setAnchorEl(null);
    setCaseStatusAnchorE1(null);
  };

  React.useEffect(() => {
    applySearch(searchValue);
  }, [searchValue]);

  const applySearch = (value) => {
    if (value.length > 0 && totalRows!= null) {
      const filteredRows = totalRows.filter((row) => {
        return (
          row.client?.toLowerCase().includes(value?.toLowerCase()) ||
          row.caseID?.toLowerCase().includes(value?.toLowerCase()) ||
          row.id?.toString()?.toLowerCase().includes(value?.toLowerCase()) ||
          row.status?.toLowerCase().includes(value?.toLowerCase()) ||
          moment(row?.created_at)
            .format("LLL")
            ?.toLowerCase()
            .includes(value?.toLowerCase()) ||
          row.fee?.toLowerCase().includes(value?.toLowerCase())
        );
      });

      setRows(filteredRows);
    } else {
      setRows([]);
      getData();
    }
  };

  return (
    <>
      <div className={styles.searchBarContainer}>
        <h2 className={styles.heading}>Engagements</h2>
        <Stack className={styles.sectionHeader}>
          <TextField
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
        </Stack>
      </div>
      <Box sx={{ width: "100%" }} className={styles["dataTable-wrapper"]}>
        <Box className={styles.dataTable}>
          {/* <EnhancedTableToolbar numSelected={selected.length} /> */}
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {visibleRows.map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <>
                      <TableRow
                        hover
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.LspName}
                        selected={isItemSelected}
                        sx={{ cursor: "pointer" }}
                      >
                        <TableCell width={60}>
                          <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => {
                              getCaseTasks(row.id);
                              setCurrentCase(row);
                              setTableCollapse((val) =>
                                val === row.id ? false : row.id,
                              );
                            }}
                          >
                            {tableCollapse === row.id ? (
                              <KeyboardArrowUpIcon />
                            ) : (
                              <KeyboardArrowDownIcon />
                            )}
                          </IconButton>
                        </TableCell>

                        <TableCell
                          width={150}
                          onClick={() => handleCellClick(row.id)}
                        >
                          <div style={{ fontSize: "0.9rem" }}>{row.caseID}</div>
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          width={180}
                          onClick={() => handleCellClick(row.id)}
                        >
                          <div className={styles.boldText}>
                            {row.client ? row.client : "No title"}
                          </div>
                        </TableCell>
                        <TableCell
                          width={150}
                          onClick={() => handleCellClick(row.id)}
                        >
                          {JSON.parse(localStorage.getItem("LoggedInObj"))
                            .type === "client" ? (
                            <div>
                              <span
                                id="basic-button"
                                className={
                                  row.status === "open"
                                    ? styles.open
                                    : row.status === "closed"
                                    ? styles.closed
                                    : row.status === "in_progress"
                                    ? styles.progress
                                    : row.status === "locked"
                                    ? styles.locked
                                    : styles.open
                                }
                                aria-controls={open ? "basic-menu" : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? "true" : undefined}
                                onClick={(e) => handleClickStatusChange(e, row)}
                              >
                                {row.status}
                              </span>
                            </div>
                          ) : (
                            <>
                              <div>
                                <span
                                  id="basic-button"
                                  className={
                                    row.status === "open"
                                      ? styles.open
                                      : row.status === "closed"
                                      ? styles.closed
                                      : row.status === "in_progress"
                                      ? styles.progress
                                      : row.status === "locked"
                                      ? styles.locked
                                      : styles.open
                                  }
                                  aria-controls={
                                    caseStatusOpen ? "basic-menu" : undefined
                                  }
                                  aria-haspopup="true"
                                  aria-expanded={
                                    caseStatusOpen ? "true" : undefined
                                  }
                                  onClick={(e) =>
                                    handleClickStatusChange(e, row)
                                  }
                                >
                                  {row.status}
                                </span>
                                <Menu
                                  id="basic-menu"
                                  anchorEl={caseStatusAnchorE1}
                                  open={caseStatusOpen}
                                  onClose={handleClose}
                                  onChange={(e) => console.log(e.target.value)}
                                  MenuListProps={{
                                    "aria-labelledby": "basic-button",
                                  }}
                                >
                                  {case_status.map((status) => (
                                    <MenuItem
                                      onClick={() => {
                                        updateCaseStatus(
                                          currentCase?.id,
                                          status,
                                        );
                                        handleClose();
                                      }}
                                      key={status}
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      {status}
                                    </MenuItem>
                                  ))}
                                </Menu>
                              </div>
                            </>
                          )}
                        </TableCell>
                        <TableCell
                          width={220}
                          onClick={() => handleCellClick(row.id)}
                        >
                          <div style={{ fontSize: "0.9rem" }}>
                            {moment(row?.created_at).format("LLL")}
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow
                        hover
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        sx={{
                          background: "#f4f4f4",
                        }}
                        selected={isItemSelected}
                      >
                        <TableCell
                          style={{
                            paddingBottom: 0,
                            paddingTop: 0,
                          }}
                          colSpan={9}
                        >
                          <Collapse
                            in={tableCollapse === row.id}
                            timeout="auto"
                            unmountOnExit
                          >
                            {tasks.length > 0 ? (
                              <>
                                <Box
                                  className={
                                    styles["dataTable-wrapper-tasks"] +
                                    " " +
                                    (row.status === "closed" ||
                                    row.status === "locked"
                                      ? "disabled"
                                      : "")
                                  }
                                >
                                  <DataGrid
                                    pagination={false}
                                    className={
                                      styles.dataTable + " d-none-footer"
                                    }
                                    rows={tasks}
                                    autoHeight={true}
                                    columns={taskColumns}
                                    initialState={{
                                      pagination: {
                                        paginationModel: {
                                          pageSize: 100,
                                        },
                                      },
                                    }}
                                    pageSizeOptions={[5]}
                                    disableRowSelectionOnClick
                                  />
                                </Box>
                              </>
                            ) : (
                              <Box sx={{ m: 1, p: 3 }}>
                                <p>No tasks</p>
                              </Box>
                            )}
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow>
                    <TableCell colSpan={9} />
                  </TableRow>
                )}
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
      <MessageModal
        open={openCaseStatusUpdateModal}
        onClose={setOpenCaseStatusUpdateModal}
        title="Update Case Status"
        content="Case Status is Updated successfully"
      />
      <ConfirmationModal
        open={openDeleteConfirmationModal}
        onClose={setDeleteConfirmationModal}
        title="Delete Task"
        isBtnLoading={isConfirmBtnLoading}
        content="Are you sure you want to delete this task?"
        onConfirm={() => {
          deleteTask(currentTask?.id);
        }}
      />
      <UpdateTaskModal
        open={isTaskUpdateModal}
        setOpen={setIsTaskUpdateModal}
        currentTask={currentTask}
        currentCase={currentCase}
        getCaseTasks={getCaseTasks}
      />
      <AddNewTaskModal
        open={isAddTaskModalOpen}
        setOpen={setIsAddTaskModalOpen}
        caseId={currentCase?.id}
        getData={getData}
        getTasksData={getCaseTasks}
      />
    </>
  );
}
