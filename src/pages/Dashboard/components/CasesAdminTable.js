import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import { visuallyHidden } from "@mui/utils";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import PropTypes from "prop-types";
import React from "react";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Edit } from "../../../assets/dashboard/edit.svg";
import { ReactComponent as Search } from "../../../assets/dashboard/search.svg";
import { ReactComponent as Delete } from "../../../assets/dashboard/trash.svg";
import ConfirmationModal from "../../../common/ConfirmationsModal";
import MessageModal from "../../../common/MessageModal";
import Checkbox from "../../../components/CheckBox";
import myApi from "../../../utils/axios";
import UpdateTaskModal from "./UpdateTaskModal";

import styles from "./component.module.scss";
import LawyerAdminTable from "./LawyerAdminTable";

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
  },
  {
    id: "LspName",
    width: 130,
    disableColumnMenu: true,
    disablePadding: true,
    label: "Service Providers",
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
    id: "created_by",
    label: "Client Name",
    width: 110,
    disableColumnMenu: true,
  },
  {
    id: "assignee",
    label: "Assignee",
    width: "200",
    disableColumnMenu: true,
  },
  {
    id: "delete",
    label: "Delete",
    width: 180,
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
              {headCell.label}
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

export default function CasesAdminTable({ getDashboardMetircs }) {
  const navigate = useNavigate();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(50);
  const [rowsData, setRowsData] = React.useState([]);
  const [openCaseStatusUpdateModal, setOpenCaseStatusUpdateModal] =
    React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  const [assignCaseToLawyerModal, setAssignCaseToLawyerModal] =
    React.useState(false);
  const [rows, setRows] = React.useState([]);
  const [rowId, setRowId] = React.useState();
  const [tasks, setTasks] = React.useState([]);
  const [tableCollapse, setTableCollapse] = React.useState(false);
  const [openTaskStateModal, setOpenTaskStateModal] = React.useState(false);
  const [delCaseModal, setDelCaseModal] = React.useState(false);
  const [caseStateMessage, setCaseStateMessage] = React.useState("");
  const [isConfirmBtnLoading, setIsConfirmBtnLoading] = React.useState(false);
  const [currentTask, setCurrentTask] = React.useState(null);
  const [isTaskUpdateModal, setIsTaskUpdateModal] = React.useState(false);
  const [isLawyerTable, setIsLawyerTable] = React.useState(false);
  const [totalRows, setTotalRows] = React.useState(null);
  const [currentCase, setCurrentCase] = React.useState(null);
  const [totalNumberOfCases, setTotalNumberOfCases] = React.useState(null);
  const [openDeleteConfirmationModal, setDeleteConfirmationModal] =
    React.useState(false);

  const [lawyers, setLawyers] = React.useState([]);
  const [lawyersLoading, setLawyersLoading] = React.useState(false);
  const [lawyerPage, setLawyerPage] = React.useState(1);
  const [lawyersCount, setLawyersCount] = React.useState(0);

  function createData(
    id,
    caseID,
    LspName,
    status,
    query_date,
    created_by,
    created_at,
    services,
    assignee
  ) {
    return {
      id,
      caseID,
      LspName,
      status,
      query_date,
      created_by,
      created_at,
      services,
      assignee,
    };
  }
  const getCaseTasks = async (caseId) => {
    if (caseId) {
      await axios
        .get(
          `${process.env.REACT_APP_BASE_API_URL}api/auth/case/task/?case=${caseId}`,
          {
            headers: {
              Authorization: `JWT ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          setTasks(res.data.results);
          getDashboardMetircs();
          setIsTaskUpdateModal(false);
        })
        .catch((err) => {});
    } else {
      setTasks([]);
    }
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
        }
      )
      .then((res) => {
        // setIsTaskModalOpen(true);
        getCaseTasks(currentCase?.id);
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
        }
      )
      .then((res) => {
        getCaseTasks(currentCase?.id);
        setDeleteConfirmationModal(false);
        setIsConfirmBtnLoading(false);
      })
      .catch((err) => {
        setIsConfirmBtnLoading(false);
      });
  };

  const getData = async () => {
    await myApi
      .get(
        `api/auth/case/?page_size=${rowsPerPage}${
          page >= 1 ? "&page=" + (page + 1) : ""
        }`
      )
      .then((res) => {
        setRowsData(res.data.results);
        setTotalNumberOfCases(res.data.count);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  React.useEffect(() => {
    getData();
  }, [page, rowsPerPage]);

  const task_status = ["closed", "open"];

  const taskColumns = [
    {
      field: "title",
      headerName: "Task Title",
      width: 180,
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
      width: 165,
      disableColumnMenu: true,
      renderCell: (param) => (
        <>
          <span
            className={
              param.value === "open"
                ? styles.open
                : param.value === "closed"
                ? styles.close
                : styles.open
            }
            aria-controls={taskStatusOpen ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={taskStatusOpen ? "true" : undefined}
            onClick={(e) => handleClickTaskStatusChange(e)}
          >
            {param.value}
          </span>
          <Menu
            id="basic-menu"
            anchorEl={taskStatusAnchorE1}
            open={taskStatusOpen}
            onClose={handleClose}
            onChange={(e) => console.log(e.target.value)}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            {task_status.map((status) => (
              <MenuItem
                onClick={() => {
                  updateTasksStatus(param.id, status);
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
        </>
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
      field: "actions",
      headerName: "",
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
    if (rowsData.length) {
      const newRow = rowsData.map((row) => {
        return createData(
          row.id,
          row.case_id,
          row.lawyer,
          row.status,
          row.created_at,
          row.created_by,
          row.created_at,
          "null",
          "null",
          "null"
        );
      });
      setRows(newRow);
      setTotalRows(newRow);
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
      page * rowsPerPage + rowsPerPage
    );
    return outPut;
  }, [rows, order, orderBy, page, rowsPerPage]);

  const handleCellClick = (id) => {
    navigate(`/application/${id}`);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [caseStatusAnchorE1, setCaseStatusAnchorE1] = React.useState(null);
  const [taskStatusAnchorE1, setTaskStatusAnchorE1] = React.useState(null);
  const open = Boolean(anchorEl);
  const caseStatusOpen = Boolean(caseStatusAnchorE1);
  const taskStatusOpen = Boolean(taskStatusAnchorE1);

  const handleClose = () => {
    setAnchorEl(null);
    setCaseStatusAnchorE1(null);
    setTaskStatusAnchorE1(null);
  };

  const assignCaseToLawyer = async (caseId, lawyerId) => {
    await axios
      .put(
        `${process.env.REACT_APP_BASE_API_URL}api/auth/case/${currentCase?.id}/`,
        {
          lawyer: lawyerId,
        },
        {
          headers: {
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setAssignCaseToLawyerModal(true);
        getData(page);
      })
      .catch((err) => {});
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
          }
        )
        .then((res) => {
          getData();
          setOpenCaseStatusUpdateModal(true);
        });
    } catch (e) {
      console.log("error ");
    }
  };

  const deleteCase = async (caseId) => {
    try {
      await axios
        .delete(
          `${process.env.REACT_APP_BASE_API_URL}api/auth/case-remove/?id=${caseId}`,
          {
            headers: {
              Authorization: `JWT ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          getData();
          setDelCaseModal(true);
        });
    } catch (e) {
      console.log("error ");
    }
  };

  const handleClickStatusChange = (event, currentObj) => {
    setCurrentCase(currentObj);
    setCaseStatusAnchorE1(event.currentTarget);
  };
  const handleClickTaskStatusChange = (event) => {
    setTaskStatusAnchorE1(event.currentTarget);
  };

  React.useEffect(() => {
    applySearch(searchValue);
  }, [searchValue]);

  const applySearch = (value) => {
    if (value.length > 0 && totalRows != null) {
      const filteredRows = totalRows.filter((row) => {
        return (
          row.LspName?.toLowerCase().includes(value?.toLowerCase()) ||
          row.id?.toString()?.toLowerCase().includes(value?.toLowerCase()) ||
          row.caseID?.toLowerCase().includes(value?.toLowerCase()) ||
          row.status?.toLowerCase().includes(value?.toLowerCase()) ||
          row.created_by?.toLowerCase().includes(value?.toLowerCase()) ||
          moment(row?.created_at)
            .format("LLL")
            ?.toLowerCase()
            .includes(value?.toLowerCase())
        );
      });
      setRows(filteredRows);
    } else {
      setRows([]);
      getData();
    }
  };

  const case_status = ["closed", "open", "locked"];

  return (
    <>
      <div className={styles.searchBarContainer}>
        <h2 className={styles.heading}>Engagements</h2>
        <Stack className={styles.sectionHeader}>
          <span></span>
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
                        // role="checkbox"
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
                                val === row.id ? false : row.id
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

                        <TableCell>
                          <strong>{row.caseID}</strong>
                        </TableCell>

                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          onClick={() => handleCellClick(row.id)}
                        >
                          <strong>
                            {row.LspName ? row.LspName : "Not Assigned"}
                          </strong>
                        </TableCell>

                        <TableCell>
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
                              onClick={(e) => handleClickStatusChange(e, row)}
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
                                    updateCaseStatus(currentCase?.id, status);
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
                        </TableCell>

                        <TableCell onClick={() => handleCellClick(row.id)}>
                          <strong>
                            {moment(row?.created_at).format("LLL")}
                          </strong>
                        </TableCell>

                        <TableCell onClick={() => handleCellClick(row.id)}>
                          <strong>{row.created_by}</strong>
                        </TableCell>

                        <TableCell
                          align="center"
                          sx={{
                            display: "flex",
                          }}
                        >
                          <span
                            onClick={(e) => {
                              setIsLawyerTable(true);
                              setCurrentCase(row);
                            }}
                          >
                            {row.LspName ? (
                              <Tooltip title={row.LspName}>
                                <Avatar>{row?.LspName[0]}</Avatar>
                              </Tooltip>
                            ) : (
                              <Avatar>
                                <PersonAddAlt1Icon />
                              </Avatar>
                            )}
                          </span>
                        </TableCell>
                        <TableCell
                          component="th"
                          onClick={() => deleteCase(row.id)}
                        >
                          <IconButton>
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                      <TableRow
                        hover
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        sx={{
                          background: tasks?.length > 0 ? "#f4f4f4" : "white",
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
        open={openTaskStateModal}
        onClose={setOpenTaskStateModal}
        message={caseStateMessage}
        title="Task State Updated"
      />
      <MessageModal
        open={openCaseStatusUpdateModal}
        onClose={setOpenCaseStatusUpdateModal}
        title="Update Case Status"
        content="Case Status is Updated successfully"
      />
      <MessageModal
        open={assignCaseToLawyerModal}
        onClose={setAssignCaseToLawyerModal}
        title="Case Assigned"
        content="Case is Assigned to lawyer successfully."
      />
      <MessageModal
        open={delCaseModal}
        onClose={setDelCaseModal}
        title="Delete Case"
        content="Case deleted successfully."
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

      <LawyerAdminTable
        open={isLawyerTable}
        setOpen={setIsLawyerTable}
        setCase={currentCase}
        assignCaseToLawyer={assignCaseToLawyer}
      />
    </>
  );
}
