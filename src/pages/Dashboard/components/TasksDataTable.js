import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton } from "@mui/material";
import CheckBox from "../../../components/CheckBox";
import { ReactComponent as Delete } from "../../../assets/dashboard/trash.svg";
import { ReactComponent as Edit } from "../../../assets/dashboard/edit.svg";
import styles from "./component.module.scss";
import axios from "axios";

const TasksDataTable = () => {
  const navigate = useNavigate();
  const [rowsData, setRowsData] = React.useState([]);

  const handleCellClick = (params, event) => {
    navigate(`/application/${params.value}`);
  };

  const getData = async () => {
    await axios
      .get(`${process.env.REACT_APP_BASE_API_URL}api/auth/case/task/`, {
        headers: {
          Authorization: `JWT ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log(res.data.results);
        setRowsData(res.data.results);
      })
      .catch((err) => {});
  };

  const columns = [
    {
      field: "title",
      headerName: "Task Title",
      width: 130,
      disableColumnMenu: true,
      headerCheckboxSelection: true,
      renderCell: (param) => (
        <span onClick={(event) => handleCellClick(param, event)}>
          {param.value}
        </span>
      ),
    },
    {
      field: "status",
      headerName: "Task Status",
      className: "status",
      width: 110,
      disableColumnMenu: true,
      renderCell: (param) => (
        <span className={styles.status}>{param.value}</span>
      ),
    },
    {
      field: "created_at",
      headerName: "Task Created Date",
      width: 150,
      disableColumnMenu: true,
    },

    {
      field: "created_by",
      headerName: "Created By",
      width: 150,
      disableColumnMenu: true,
    },

    {
      field: "description",
      headerName: "Description",
      width: 500,
      disableColumnMenu: true,
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
          <IconButton>
            <Delete />
          </IconButton>
          <IconButton>
            <Edit />
          </IconButton>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  //   const rows = [
  //     {
  //       id: 1,
  //       TaskTitle: "Olivia",
  //       taskStatus: "Open",
  //       taskCreated: "12/27/2022",
  //       CreatedBy: "John Doe",
  //       Description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  //     },
  //   ];

  return (
    <Box className={styles["dataTable-wrapper"]}>
      <DataGrid
        className={styles.dataTable}
        rows={rowsData}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
        components={{
          BaseCheckbox: CheckBox,
        }}
      />
    </Box>
  );
};

export default TasksDataTable;
