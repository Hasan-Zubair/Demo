import {
  Container,
  Grid,
  InputAdornment,
  Switch,
  TextField,
} from "@mui/material";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import { visuallyHidden } from "@mui/utils";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Search } from "../../assets/dashboard/search.svg";
import Header from "../../components/Header";
import cardData from "./components/cardData";

// components
import Card from "./components/Card";
// import Filters from "./components/Filters";
import { Box } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import { styled, useTheme } from "@mui/material/styles";
import VeraAiBot from "../../components/VeraAIBot";
import AddNewTaskModal from "./components/AddNewTaskModal";

import BookIcon from "@mui/icons-material/Book";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MailIcon from "@mui/icons-material/Mail";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import axios from "axios";
import Blog from "./Blog/List";
import CasesAdminTable from "./components/CasesAdminTable";
// style
import { useLocation } from "react-router-dom";
import styles from "../../pages/Dashboard/components/component.module.scss";
// import { Delete } from "@mui/icons-material";
import { ReactComponent as Delete } from "../../../src/assets/dashboard/trash.svg";
import MessageModal from "../../common/MessageModal";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [delModal, setDelModal] = React.useState(false);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [orderLawyer, setOrderLawyer] = React.useState("asc");
  const [orderByLawyer, setOrderByLawyer] = React.useState("calories");
  const [selectedLawyer, setSelectedLawyer] = React.useState([]);
  const [userData, setUserData] = useState({});
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("Engagements");
  const [clients, setClients] = useState([]);
  const [userName, setUserName] = useState("");
  const [lawyers, setLawyers] = useState([]);
  const [dashboardMetrics, setDashboardMetrics] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [totalRows, setTotalRows] = useState(null);
  const [rowsData, setRowsData] = useState([]);
  const [totalNumberOfCases, setTotalNumberOfCases] = React.useState(null);
  const [rowsPerPage, setRowsPerPage] = React.useState(50);
  const [page, setPage] = React.useState(0);
  const [isErrorModal, setIsErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [totalNumberOfCasesLawyer, setTotalNumberOfCasesLawyer] =
    React.useState(null);
  const [rowsPerPageLawyer, setRowsPerPageLawyer] = React.useState(50);
  const [pageLawyer, setPageLawyer] = React.useState(0);

  useEffect(() => {
    applySearch(searchValue);
  }, [searchValue]);

  const applySearch = (value) => {
    if (value.length > 0 && totalRows != null) {
      const filteredRows = totalRows.filter((row) => {
        return (
          row.id?.toString()?.toLowerCase().includes(value?.toLowerCase()) ||
          row.email?.toLowerCase().includes(value?.toLowerCase()) ||
          row.username?.toLowerCase().includes(value?.toLowerCase()) ||
          row.name?.toLowerCase().includes(value?.toLowerCase())
        );
      });
      setClients(filteredRows);
      setLawyers(filteredRows);
    } else {
      getClients();
      getLawyers();
    }
  };

  function createData(id, email, username, name, is_active) {
    return {
      id,
      email,
      username,
      name,
      is_active,
    };
  }

  React.useEffect(() => {
    const loggedInObj = JSON.parse(localStorage.getItem("LoggedInObj"));
    const userType = loggedInObj?.type;
    if (userType === "client" || userType === "lawyer") {
      if (rowsData.length) {
        const newRow = rowsData.map((row) => {
          return createData(
            row.id,
            row.email,
            row.username,
            row.name,
            row.is_active
          );
        });
        setTotalRows(newRow);
      }
    } else {
      if (rowsData.length) {
        const newRow = rowsData.map((row) => {
          return createData(
            row.id,
            row.email,
            row.username,
            row.name,
            row.is_active
          );
        });
        setTotalRows(newRow);
      }
    }
  }, [rowsData]);

  useEffect(() => {
    if (localStorage.getItem("LoggedInObj")) {
      const loggedInObj = JSON.parse(localStorage.getItem("LoggedInObj"));
      setUserData(loggedInObj);
    }
  }, []);

  const drawerWidth = 240;

  /** On Status Change of client status. API call to update status(active/inactive) */
  const handleStatusChange = async (clientId, checked, type) => {
    await axios
      .put(
        `${process.env.REACT_APP_BASE_API_URL}api/auth/user/${clientId}/`,
        { is_active: checked },
        {
          headers: {
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (type === "client") {
          getClients();
        } else {
          getLawyers();
        }
      })
      .catch((err) => {});
  };

  const handleDelClientLawyer = async (clientId, type) => {
    await axios
      .delete(
        `${process.env.REACT_APP_BASE_API_URL}api/auth/user-remove/?id=
        ${clientId}`,
        {
          headers: {
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setDelModal(true);
        if (type === "client") {
          getClients();
        } else {
          getLawyers();
        }
      })
      .catch((err) => {});
  };

  const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
  });

  /** material UI Design for switch */
  const StatusSwitch = styled(Switch)(({ theme }) => ({
    padding: 8,
    "& .MuiSwitch-track": {
      borderRadius: 22 / 2,
      "&:before, &:after": {
        content: '""',
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        width: 16,
        height: 16,
      },
      "&:before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
          theme.palette.getContrastText(theme.palette.primary.main)
        )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
        left: 12,
      },
      "&:after": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
          theme.palette.getContrastText(theme.palette.primary.main)
        )}" d="M19,13H5V11H19V13Z" /></svg>')`,
        right: 12,
      },
    },
    "& .MuiSwitch-thumb": {
      boxShadow: "none",
      width: 16,
      height: 16,
      margin: 2,
    },
  }));

  const closedMixin = (theme) => ({
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
      width: `calc(${theme.spacing(8)} + 1px)`,
    },
  });

  const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  }));

  const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
  })(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
      ...openedMixin(theme),
      "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      "& .MuiDrawer-paper": closedMixin(theme),
    }),
  }));

  const theme = useTheme();
  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(!open);
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
    {
      id: "status",
      label: "Status",
      width: 180,
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

  const getClients = async () => {
    try {
      const res = await axios.get(
        `${
          process.env.REACT_APP_BASE_API_URL
        }api/auth/user/?type=client&page_size=${rowsPerPage}${
          page >= 1 ? "&page=" + (page + 1) : ""
        }`,
        {
          headers: {
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        }
      );

      setClients(res.data.results);
      setTotalNumberOfCases(res.data.count);
      setRowsData(res.data.results);
    } catch (error) {
      // Handle the error
    }
  };
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
        }
      );

      setLawyers(response.data.results);
      setTotalNumberOfCases(response.data.count);
    } catch (error) {
      // Handle the error
    }
  };

  const handleChangePage = (event, newPage) => {
    console.log("newPage", newPage);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    if (selectedItem === "Clients") {
      getClients();
    }
    if (selectedItem === "Lawyers") {
      getLawyers();
    }
  }, [selectedItem]);

  React.useEffect(() => {
    if (selectedItem === "Clients") {
      getClients();
    }
    if (selectedItem === "Lawyers") {
      getLawyers();
    }
  }, [page, rowsPerPage]);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  // Access specific query parameters
  const id__ = searchParams.get("id");

  const getData = async () => {
    await axios
      .get(`${process.env.REACT_APP_BASE_API_URL}api/auth/case/dashboard/`, {
        headers: {
          Authorization: `JWT ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        cardData[0].value = res.data.data.cases.open;
        cardData[1].value = res.data.data.tasks.open;
        cardData[2].value = res.data.data.tasks.closed;
        setDashboardMetrics([...cardData]);
      })
      .catch((err) => {
        console.log("TCL: err admin", err);
        setErrorMessage(err.response.data.code);
        setIsErrorModal(true);
      });
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Drawer variant="permanent" open={open}>
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <List>
            {["Engagements", "Clients", "Lawyers", "Blog"].map(
              (text, index) => (
                <ListItem
                  key={text}
                  disablePadding
                  sx={{ display: "block" }}
                  className={
                    selectedItem === text ? styles.adminSideBarItemActive : ""
                  }
                >
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                    onClick={() => {
                      setSelectedItem(text);
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      {index % 2 === 0 ? (
                        <InboxIcon />
                      ) : text === "Blog" ? (
                        <BookIcon />
                      ) : (
                        <MailIcon />
                      )}
                      {}
                    </ListItemIcon>
                    <ListItemText
                      primary={text}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </ListItem>
              )
            )}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            display: "flex",
            width: "100%",
            padding: "0px 20px",
            height: "100vh",
          }}
        >
          {/* <DrawerHeader /> */}
          <Header />

          <Container
            className={
              JSON.parse(localStorage.getItem("LoggedInObj")).type === "admin"
                ? styles.pageWrapperAdmin + " " + styles.adminPad_o
                : styles.pageWrapperAdmin
            }
          >
            {selectedItem === "Engagements" && (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h1 className={styles.pageTitle}>Dashboard</h1>
                </div>
                <Grid
                  container
                  spacing={3}
                  mb={4}
                  style={{
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {dashboardMetrics.map((el, i) => (
                    <Grid key={i} item xs={12} sm={6} md={4} xl={4}>
                      <Card data={el} />
                    </Grid>
                  ))}
                </Grid>

                <CasesAdminTable getDashboardMetircs={getData} />
              </>
            )}
            {selectedItem === "Clients" && (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h1 className={styles.pageTitle}>Clients</h1>

                  <span></span>
                  <TextField
                    style={{ marginTop: "8%", marginBottom: "2%" }}
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

                <Box
                  sx={{ width: "100%" }}
                  className={styles["dataTable-wrapper"]}
                >
                  <Box className={styles.dataTable}>
                    {/* <EnhancedTableToolbar numSelected={selected.length} /> */}
                    <TableContainer>
                      <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                      >
                        <EnhancedTableHead
                          numSelected={selected.length}
                          order={order}
                          orderBy={orderBy}
                        />
                        <TableBody>
                          {clients.map((row, index) => {
                            return (
                              <>
                                <TableRow
                                  hover
                                  tabIndex={-1}
                                  key={row.LspName}
                                  sx={{ cursor: "pointer" }}
                                >
                                  <TableCell
                                    onClick={() =>
                                      navigate(`/dashboard/?id=${row.id}`)
                                    }
                                  >
                                    <strong>{row.id}</strong>
                                  </TableCell>

                                  <TableCell
                                    component="th"
                                    scope="row"
                                    onClick={() =>
                                      navigate(`/dashboard/?id=${row.id}`)
                                    }
                                  >
                                    <strong>{row.name}</strong>
                                  </TableCell>

                                  <TableCell
                                    component="th"
                                    scope="row"
                                    onClick={() =>
                                      navigate(`/dashboard/?id=${row.id}`)
                                    }
                                  >
                                    <strong>{row.username}</strong>
                                  </TableCell>

                                  <TableCell
                                    component="th"
                                    scope="row"
                                    onClick={() =>
                                      navigate(`/dashboard/?id=${row.id}`)
                                    }
                                  >
                                    <strong>{row.email}</strong>
                                  </TableCell>

                                  <TableCell component="th" scope="row">
                                    <StatusSwitch
                                      checked={row.is_active}
                                      onChange={(event) =>
                                        handleStatusChange(
                                          row.id,
                                          event.target.checked,
                                          "client"
                                        )
                                      }
                                    />
                                  </TableCell>

                                  <TableCell
                                    component="th"
                                    scope="row"
                                    onClick={() =>
                                      handleDelClientLawyer(row.id, "lawyers")
                                    }
                                  >
                                    <IconButton>
                                      <Delete />
                                    </IconButton>
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
              </>
            )}
            {selectedItem === "Lawyers" && (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h1 className={styles.pageTitle}>Lawyers</h1>
                  <span></span>
                  <TextField
                    style={{ marginTop: "8%", marginBottom: "2%" }}
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

                <Box
                  sx={{ width: "100%" }}
                  className={styles["dataTable-wrapper"]}
                >
                  <Box className={styles.dataTable}>
                    {/* <EnhancedTableToolbar numSelected={selected.length} /> */}
                    <TableContainer>
                      <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                      >
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
                                >
                                  <TableCell
                                    onClick={() =>
                                      navigate(
                                        `/dashboard/lawyer/?id=${row.id}`
                                      )
                                    }
                                  >
                                    <strong>{row.id}</strong>
                                  </TableCell>

                                  <TableCell
                                    component="th"
                                    scope="row"
                                    onClick={() =>
                                      navigate(
                                        `/dashboard/lawyer/?id=${row.id}`
                                      )
                                    }
                                  >
                                    <strong>{row.name}</strong>
                                  </TableCell>

                                  <TableCell
                                    component="th"
                                    scope="row"
                                    onClick={() =>
                                      navigate(
                                        `/dashboard/lawyer/?id=${row.id}`
                                      )
                                    }
                                  >
                                    <strong>{row.username}</strong>
                                  </TableCell>

                                  <TableCell
                                    component="th"
                                    scope="row"
                                    onClick={() =>
                                      navigate(
                                        `/dashboard/lawyer/?id=${row.id}`
                                      )
                                    }
                                  >
                                    <strong>{row.email}</strong>
                                  </TableCell>

                                  <TableCell component="th" scope="row">
                                    <StatusSwitch
                                      checked={row.is_active}
                                      onChange={(event) =>
                                        handleStatusChange(
                                          row.id,
                                          event.target.checked,
                                          "lawyers"
                                        )
                                      }
                                    />
                                  </TableCell>
                                  <TableCell
                                    component="th"
                                    scope="row"
                                    onClick={() =>
                                      handleDelClientLawyer(row.id, "lawyers")
                                    }
                                  >
                                    <IconButton>
                                      <Delete />
                                    </IconButton>
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
              </>
            )}
            {selectedItem === "Blog" && <Blog />}
          </Container>
        </Box>
      </Box>

      <AddNewTaskModal open={isTaskModalOpen} setOpen={setIsTaskModalOpen} />
      <VeraAiBot />
      <MessageModal
        open={delModal}
        onClose={setDelModal}
        title={selectedItem === "Clients" ? "Delete Client" : "Delete Lawyer"}
        content={
          selectedItem === "Clients"
            ? "Client deleted Successfully."
            : "Lawyer deleted Successfully."
        }
      />
      <MessageModal
        open={isErrorModal}
        onClose={setIsErrorModal}
        title="Error"
        error
        content={errorMessage}
      />
    </>
  );
};

export default AdminDashboard;
