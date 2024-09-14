"use client";
import { BorderClear } from "@mui/icons-material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const columns: GridColDef[] = [
  {
    field: "status",
    headerName: "Status",
    width: 150,
    disableColumnMenu: true,
  },
  { field: "title", headerName: "Title", width: 150, disableColumnMenu: true },
  {
    field: "description",
    headerName: "Description",
    width: 300,
    disableColumnMenu: true,
  },
  {
    field: "action",
    headerName: "",
    width: 150,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    renderCell: (params) => params.row.action,
  },
];

type TaskRow = {
  id: string;
  title: string;
  status: string;
  description: string | null;
  action: JSX.Element;
};

export default function TaskList({ tasks }: { tasks: TaskRow[] }) {
  return (
    <div className="w-full">
      <DataGrid
        rows={tasks}
        columns={columns}
        disableMultipleRowSelection
        localeText={{
          MuiTablePagination: {
            labelDisplayedRows: ({ from, to, count }) =>
              `${count}件中 ${from}～${to}件を表示`,
          },
        }}
      />
    </div>
  );
}
