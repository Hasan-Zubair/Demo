import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
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
import moment from "moment";
import PropTypes from "prop-types";
import React from "react";
import { useNavigate } from "react-router-dom";
import Checkbox from "../../../components/CheckBox";
import myApi from "../../../utils/axios";

import styles from "./component.module.scss";

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
    id: "Name",
    width: 130,
    disableColumnMenu: true,
    disablePadding: true,
    label: "Name",
  },
  {
    id: "Username",
    label: "Username",
    className: "status",
    width: 110,
    disableColumnMenu: true,
    disablePadding: false,
  },
  {
    id: "Email",
    label: "Email",
    width: 180,
    disableColumnMenu: true,
  },
  {
    id: "Status",
    label: "Status",
    width: 110,
    disableColumnMenu: true,
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
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
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

export default function DataGridTable({ getDashboardMetircs }) {
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
  const [tasks, setTasks] = React.useState([]);
  const [tableCollapse, setTableCollapse] = React.useState(false);
  const [openTaskStateModal, setOpenTaskStateModal] = React.useState(false);
  const [caseStateMessage, setCaseStateMessage] = React.useState("");
  const [caseState, setCaseState] = React.useState("unlock");
  const [isConfirmBtnLoading, setIsConfirmBtnLoading] = React.useState(false);
  const [currentTask, setCurrentTask] = React.useState(null);
  const [isTaskUpdateModal, setIsTaskUpdateModal] = React.useState(false);
  const [totalRows, setTotalRows] = React.useState(null);
  const [currentCase, setCurrentCase] = React.useState(null);
  const [totalNumberOfCases, setTotalNumberOfCases] = React.useState(null);
  const [openDeleteConfirmationModal, setDeleteConfirmationModal] =
    React.useState(false);

  const [lawyers, setLawyers] = React.useState([]);
  const [lawyersLoading, setLawyersLoading] = React.useState(false);
  const [lawyerPage, setLawyerPage] = React.useState(1);
  const [lawyersCount, setLawyersCount] = React.useState(0);

  const getData = async () => {
    await myApi
      .get(
        `api/auth/user/?type=lawyer&page_size=${rowsPerPage}${
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
  };

  React.useEffect(() => {
    getData();
  }, [page, rowsPerPage]);

  React.useEffect(() => {
    if (rowsData.length) {
      setRows(rowsData);
      setTotalRows(rowsData);
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

  const handleClick = (event, name) => {
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

  const getLawyers = async () => {
    if (lawyers.length && lawyers.length === lawyersCount) return;
    setLawyersLoading(true);
    await axios
      .get(
        `${process.env.REACT_APP_BASE_API_URL}api/auth/user/?type=lawyer&page=${lawyerPage}`,
        {
          headers: {
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        },
      )
      .then((res) => {
        setLawyersCount(res?.data?.count);
        if (lawyerPage > 1) {
          setLawyers((prev) => [...prev, ...res.data.results]);
        } else {
          setLawyers(res?.data?.results);
        }
      })
      .catch((err) => {})
      .finally(() => {
        setLawyersLoading(false);
      });
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [caseStatusAnchorE1, setCaseStatusAnchorE1] = React.useState(null);
  const [taskStatusAnchorE1, setTaskStatusAnchorE1] = React.useState(null);
  const open = Boolean(anchorEl);
  const caseStatusOpen = Boolean(caseStatusAnchorE1);
  const taskStatusOpen = Boolean(taskStatusAnchorE1);
  const handleClickAssignee = (event, Case) => {
    setCurrentCase(Case);
    if (!lawyers.length) {
      getLawyers();
    }
    setAnchorEl(event.currentTarget);
  };
  const assignCase = (caseId, lawyerId) => {
    assignCaseToLawyer(caseId, lawyerId);
    setAnchorEl(null);
  };
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
        },
      )
      .then((res) => {
        setAssignCaseToLawyerModal(true);
        getData(page);
      })
      .catch((err) => {});
  };

  const handleClickTaskStatusChange = (event) => {
    setTaskStatusAnchorE1(event.currentTarget);
  };

  React.useEffect(() => {
    applySearch(searchValue);
  }, [searchValue]);

  const applySearch = (value) => {
    if (value.length > 0 && totalRows!= null) {
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

  const handleScroll = (event) => {
    const target = event.target;
    if (
      target.scrollTop + target.clientHeight === target.scrollHeight &&
      !lawyersLoading
    ) {
      setLawyerPage((prev) => prev + 1);
      getLawyers();
    }
  };

  console.log("visibleRows", visibleRows);
  return (
    <>
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
                rowCount={79}
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
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            onChange={(event) => handleClick(event, row.id)}
                            inputProps={{
                              "aria-labelledby": labelId,
                            }}
                          />
                        </TableCell>
                        <TableCell width={60}>
                          <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => {}}
                          >
                            {tableCollapse === row.id ? (
                              <KeyboardArrowUpIcon />
                            ) : (
                              <KeyboardArrowDownIcon />
                            )}
                          </IconButton>
                        </TableCell>
                        <TableCell width={100}>
                          <strong>{row.id}</strong>
                        </TableCell>

                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          width={180}
                          onClick={() => handleCellClick(row.id)}
                        >
                          <div className={styles.boldText}>
                            {row.LspName ? row.LspName : "Not Assigned"}
                          </div>
                        </TableCell>

                        <TableCell width={220}>
                          <strong>{moment(row?.created_by)}</strong>
                        </TableCell>
                        <TableCell width={180}>
                          <strong>{row.created_by}</strong>
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
    </>
  );
}
