import {
  Button,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  Switch,
  TextField,
} from "@mui/material";

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as Search } from "../../../assets/dashboard/search.svg";
import { ReactComponent as Preview } from "../../../assets/blog/eye.svg";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import { visuallyHidden } from "@mui/utils";
import AddBlog from "./Add";

// components
import { Box } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { styled, useTheme } from "@mui/material/styles";
import axios from "axios";
// style
import styles from "../../../pages/Dashboard/components/component.module.scss";
import UpdateTaskModal from "../components/UpdateTaskModal";
import { ReactComponent as Delete } from "../../../../src/assets/dashboard/trash.svg";
import MessageModal from "../../../common/MessageModal";
import handleApiError from "../../../utils/apiError";

const BlogList = () => {
  const navigate = useNavigate();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [selectedItem, setSelectedItem] = useState("Engagements");
  const [blogPosts, setBlogPosts] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [totalRows, setTotalRows] = useState(null);
  const [isModal, SetIsModal] = useState(false);
  const [totalNumberOfCases, setTotalNumberOfCases] = React.useState(null);
  const [rowsPerPage, setRowsPerPage] = React.useState(50);
  const [page, setPage] = React.useState(0);
  const [updateData, setUpdateData] = React.useState();

  const [errorModal, SetErrorModal] = useState(false);
  const [errorModalTitle, SetErrorModalTitle] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    applySearch(searchValue);
  }, [searchValue]);

  const handleUpdate = (data) => {
    SetIsModal(true);
    setUpdateData(data);
  };

  const applySearch = (value) => {
    if (value.length > 0 && blogPosts != null) {
      const filteredRows = blogPosts.filter((row) => {
        return (
          row.id?.toString()?.toLowerCase().includes(value?.toLowerCase()) ||
          row.title?.toLowerCase().includes(value?.toLowerCase()) ||
          row.created_at?.toLowerCase().includes(value?.toLowerCase())
        );
      });
      setBlogPosts(filteredRows);
    } else {
      getBlogPosts();
    }
  };

  const handleDeleteBlog = async (blogId) => {
    await axios
      .delete(
        `${process.env.REACT_APP_BASE_API_URL}api/blog/blog-remove/?id=${blogId}`,
        {
          headers: {
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        getBlogPosts();
      })
      .catch((err) => {});
  };

  const handleStatusChange = async (postId, checked) => {
    await axios
      .put(
        `${process.env.REACT_APP_BASE_API_URL}api/blog/post/${postId}/`,
        { is_published: checked },
        {
          headers: {
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        getBlogPosts();
      })
      .catch((err) => {});
  };

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

  const BlogPostHeaders = [
    {
      id: "id",
      label: "ID",
      width: 70,
      disableColumnMenu: true,
    },
    {
      id: "title",
      label: "Title",
      flex: 1,
      minWidth: 260,
      disableColumnMenu: true,
    },
    {
      id: "created_at",
      label: "Datetime",
      flex: 1,
      minWidth: 260,
      disableColumnMenu: true,
    },
    {
      id: "is_published",
      label: "Published",
      width: 180,
      disableColumnMenu: true,
    },
    {
      id: "preview",
      label: "Preview",
      width: 150,
      disableColumnMenu: true,
    },
    {
      id: "delete",
      label: "Delete",
      width: 150,
      disableColumnMenu: true,
    },
  ];

  function BlogPostTableHeaders(props) {
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
          {BlogPostHeaders.map((headCell) => (
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

  const getDate = (datetime) => {
    const dateObj = new Date(datetime);

    // Get the date components
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Month is zero-based
    const day = String(dateObj.getDate()).padStart(2, "0");
    return { year, month, day };
  };

  const getBlogPosts = async () => {
    try {
      const response = await axios.get(
        `${
          process.env.REACT_APP_BASE_API_URL
        }api/blog/post/?page_size=${rowsPerPage}${
          page >= 1 ? "&page=" + (page + 1) : ""
        }`,
        {
          headers: {
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        }
      );
      const sortedBlogPosts = response?.data?.results.sort(
        (a, b) => a.id - b.id
      );
      setBlogPosts(sortedBlogPosts);
      setTotalNumberOfCases(response.data.count);
    } catch (error) {
      // Handle the error
    }
  };

  useEffect(() => {
    getBlogPosts();
  }, []);

  useEffect(() => {
    getBlogPosts();
  }, [page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 50));
    setPage(0);
  };

  const handleSaveAndPublishP = async (formData) => {
    try {
      await axios
        .post(`${process.env.REACT_APP_BASE_API_URL}api/blog/post/`, formData, {
          headers: {
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          getBlogPosts();
          SetIsModal(false);
        });
    } catch (error) {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      SetErrorModalTitle("Error");
      SetErrorModal(true)

    }
  };

  const handleSaveP = async (id, formData) => {
    try {
      await axios
        .put(
          `${process.env.REACT_APP_BASE_API_URL}api/blog/post/${id}/`,
          formData,
          {
            headers: {
              Authorization: `JWT ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          getBlogPosts();
          SetIsModal(false);
        });
    } catch (error) {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      SetErrorModalTitle("Error");
      SetErrorModal(true)
    }
  };

 


  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Box
          component="main"
          sx={{
            display: "flex",
            width: "100%",
            padding: "0px 20px",
            height: "100vh",
          }}
        >
          <Container
            className={
              JSON.parse(localStorage.getItem("LoggedInObj")).type === "admin"
                ? styles.pageWrapperAdmin + " " + styles.adminPad_o
                : styles.pageWrapperAdmin
            }
          >
            <>
              <Box
                mt={2}
                mb={2}
                className={styles.blogPageHeader}
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <h1 className={styles.pageTitle}>Blogs</h1>
                <span></span>

                <div
                  style={{
                    marginTop: "8%",
                    width: "43%",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    onClick={(e) => {
                      setUpdateData("")
                      SetIsModal(true);
                    }}
                    variant="contained"
                    sx={{ mb: 2, mt: 1 }}
                  >
                    Add Blog
                  </Button>
                  <TextField
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
              </Box>

              <Box
                sx={{ width: "100%" }}
                className={styles["dataTable-wrapper"]}
              >
                <Box className={styles.dataTable}>
                  {/* <EnhancedTableToolbar numSelected={selected.length} /> */}
                  <TableContainer>
                    <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                      <BlogPostTableHeaders
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                      />
                      <TableBody>
                        {blogPosts.map((row, index) => {
                          return (
                            <>
                              <TableRow
                                hover
                                tabIndex={-1}
                                key={row?.id}
                                sx={{ cursor: "pointer" }}
                              >
                                <TableCell onClick={() => handleUpdate(row)}>
                                  <strong>{row?.id}</strong>
                                </TableCell>

                                <TableCell
                                  component="th"
                                  scope="row"
                                  onClick={() => handleUpdate(row)}
                                >
                                  <strong>{row?.title}</strong>
                                </TableCell>

                                <TableCell
                                  component="th"
                                  scope="row"
                                  onClick={() => handleUpdate(row)}
                                >
                                  <strong>{row?.created_at}</strong>
                                </TableCell>

                                <TableCell component="th" scope="row">
                                  <StatusSwitch
                                    checked={row?.is_published}
                                    onChange={(event) =>
                                      handleStatusChange(
                                        row.slug,
                                        event.target.checked,
                                        "lawyers"
                                      )
                                    }
                                  />
                                </TableCell>

                                <TableCell component="th" scope="row">
                                  <Link
                                    to={`/blog/${
                                      getDate(row?.created_at)?.year
                                    }/${getDate(row?.created_at)?.month}/${
                                      getDate(row?.created_at)?.day
                                    }/${row?.title}`}
                                    target="_blank"
                                  >
                                    <IconButton>
                                      <Preview />
                                    </IconButton>
                                  </Link>
                                </TableCell>
                                <TableCell
                                  component="th"
                                  scope="row"
                                  onClick={() => handleDeleteBlog(row?.id)}
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
          </Container>
        </Box>
      </Box>

      <AddBlog
        open={isModal}
        setOpen={SetIsModal}
        getBlogPosts={getBlogPosts}
        updateData={updateData}
        handleSaveAndPublishP={handleSaveAndPublishP}
        handleSaveP={handleSaveP}
      />
    <MessageModal
        open={errorModal}
        onClose={SetErrorModal}
        title={errorModalTitle}
        content={error}
      />
    </>
  );
};

export default BlogList;
