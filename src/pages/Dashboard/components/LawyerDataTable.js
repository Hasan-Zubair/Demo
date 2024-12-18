import React from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton } from "@mui/material";
import CheckBox from "../../../components/CheckBox";
import { ReactComponent as Delete } from "../../../assets/dashboard/trash.svg";
import { ReactComponent as Edit } from "../../../assets/dashboard/edit.svg";
import styles from "./component.module.scss";

const LawyerDataTable = () => {
  const navigate = useNavigate();

  const handleCellClick = (params, event) => {
    navigate(`/dashboard/lawyer/application/${params.value}`);
  };

  const columns = [
    {
      field: "LspName",
      headerName: "LSP Name",
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
      field: "matterStatus",
      headerName: "Matter Status",
      className: "status",
      width: 110,
      disableColumnMenu: true,
      renderCell: (param) => (
        <span className={styles.status}>{param.value}</span>
      ),
    },
    {
      field: "queryDate",
      headerName: "Query Date",
      width: 110,
      disableColumnMenu: true,
    },
    {
      field: "status",
      headerName: "Status",
      width: 110,
      disableColumnMenu: true,
    },
    {
      field: "services",
      headerName: "Services",
      width: 150,
      disableColumnMenu: true,
    },

    {
      field: "fee",
      headerName: "Fee",
      width: 110,
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

  const rows = [
    {
      id: 1,
      LspName: "Olivia",
      matterStatus: "Open",
      queryDate: "12/27/2022",
      status: "closed",
      services: "Doc Review",
      fee: "$4,000",
    },
  ];

  return (
    <Box className={styles["dataTable-wrapper"]}>
      <DataGrid
        className={styles.dataTable}
        rows={rows}
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

export default LawyerDataTable;
