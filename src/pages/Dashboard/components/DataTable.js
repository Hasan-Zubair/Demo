import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton } from "@mui/material";
import CheckBox from "../../../components/CheckBox";
import { ReactComponent as Delete } from "../../../assets/dashboard/trash.svg";
import { ReactComponent as Edit } from "../../../assets/dashboard/edit.svg";
import styles from "./component.module.scss";
// import InputLabel from "@mui/material/InputLabel";
// import MenuItem from "@mui/material/MenuItem";
// import FormControl from "@mui/material/FormControl";
// import Select from "@mui/material/Select";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import axios from "axios";

const DataTable = () => {
  const navigate = useNavigate();
  const [rowsData, setRowsData] = useState([]);

  const handleCellClick = (params, event) => {
    navigate(`/application/${params.id}`);
  };

  const getData = async () => {
    await axios
      .get(`${process.env.REACT_APP_BASE_API_URL}api/auth/case/`, {
        headers: {
          Authorization: `JWT ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setRowsData(res.data.results);
      })
      .catch((err) => {});
  };

  useEffect(() => {
    getData();
  }, []);
  // const columns = [
  //   {
  //     field: "LspName",
  //     headerName: "LSP Name",
  //     width: 130,
  //     disableColumnMenu: true,
  //     headerCheckboxSelection: true,
  //     renderCell: (param) => (
  //       <span onClick={(event) => handleCellClick(param, event)}>
  //         {param.value}
  //       </span>
  //     ),
  //   },
  //   {
  //     field: "matterStatus",
  //     headerName: "Matter Status",
  //     className: "status",
  //     width: 110,
  //     disableColumnMenu: true,
  //     renderCell: (param) => (
  //       <span className={styles.status}>{param.value}</span>
  //     ),
  //   },
  //   {
  //     field: "queryDate",
  //     headerName: "Query Date",
  //     width: 110,
  //     disableColumnMenu: true,
  //   },
  //   {
  //     field: "status",
  //     headerName: "Status",
  //     width: 110,
  //     disableColumnMenu: true,
  //   },
  //   {
  //     field: "services",
  //     headerName: "Services",
  //     width: 150,
  //     disableColumnMenu: true,
  //   },

  //   {
  //     field: "fee",
  //     headerName: "Fee",
  //     width: 110,
  //     disableColumnMenu: true,
  //   },
  //   {
  //     field: "actions",
  //     headerName: "",
  //     disableColumnMenu: true,
  //     sortable: false,
  //     width: 210,
  //     flex: 1,
  //     renderCell: (params) => (
  //       <div className={styles.actions}>
  //         <IconButton>
  //           <Delete />
  //         </IconButton>
  //         <IconButton>
  //           <Edit />
  //         </IconButton>
  //       </div>
  //     ),
  //   },
  // ];
  const columns = [
    {
      field: "LspName",
      headerName: "LSP Name",
      width: 130,
      disableColumnMenu: true,
      headerCheckboxSelection: true,
      renderCell: (param) => (
        <span onClick={(event) => handleCellClick(param, event)}>
          {param.value ? param.value : "Not Assigned"}
        </span>
      ),
    },
    {
      field: "status",
      headerName: "Matter Status",
      className: "status",
      width: 110,
      disableColumnMenu: true,
      renderCell: (param) => (
        <span className={styles.status}>{param.value}</span>
      ),
    },
    {
      field: "created_at",
      headerName: "Query Date",
      width: 180,
      disableColumnMenu: true,
    },

    {
      field: "created_by",
      headerName: "Created By",
      width: 110,
      disableColumnMenu: true,
    },
    {
      field: "services",
      headerName: "Services",
      width: 110,
      disableColumnMenu: true,
    },
    {
      field: "fee",
      headerName: "Fee",
      width: 200,
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

  // const rows = [
  //   {
  //     id: 1,
  //     LspName: "Olivia",
  //     matterStatus: "Open",
  //     queryDate: "12/27/2022",
  //     status: "closed",
  //     services: "Doc Review",
  //     fee: "$4,000",
  //   },
  // ];

  const SubRow = ({ row }) => {
    return <div>Sub-row content for ID: {row.id}</div>;
  };

  const CustomCell = ({ params }) => {
    const [expanded, setExpanded] = useState(false);

    const toggleExpanded = () => {
      setExpanded((prevExpanded) => !prevExpanded);
    };

    return (
      <div>
        <IconButton size="small" onClick={toggleExpanded}>
          {expanded ? (
            <KeyboardArrowUpIcon fontSize="small" />
          ) : (
            <KeyboardArrowDownIcon fontSize="small" />
          )}
        </IconButton>
        {params.value}
        {expanded && <SubRow row={params.row} />}
      </div>
    );
  };

  const [expandedRows, setExpandedRows] = useState([]);

  const toggleRowExpansion = (rowId) => {
    if (expandedRows.includes(rowId)) {
      setExpandedRows((prevExpandedRows) =>
        prevExpandedRows.filter((id) => id !== rowId),
      );
    } else {
      setExpandedRows((prevExpandedRows) => [...prevExpandedRows, rowId]);
    }
  };

  const getRowClassName = (params) => {
    return expandedRows.includes(params.id) ? "expanded-row" : "";
  };

  return (
    <Box className={styles["dataTable-wrapper"]}>
      <DataGrid
        className={styles.dataTable}
        rows={rowsData}
        columns={columns}
        // columns={columns.map((column) => ({
        //   ...column,
        //   renderCell: (params) => <CustomCell params={params} />,
        // }))}
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
        // components={{
        //   BaseCheckbox: CheckBox,
        // }}
        // getRowId={(row) => row.id}
        // rowClassName={getRowClassName}
        components={{
          BaseCheckbox: CheckBox,
          // Row: ({ row }) => (
          //   <div>
          //     {row}
          //     {expandedRows.includes(row.id) && <SubRow row={row} />}
          //   </div>
          // ),
        }}
      />
    </Box>
  );
};

export default DataTable;
