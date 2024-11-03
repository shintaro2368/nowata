import { fetchFilterdTaskAndWorks } from "@/lib/data";
import { TaskAndWorksQuery } from "@/lib/definitions";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import WorkRow from "./work-row";

export default async function WorkList({
  searchParams,
}: {
  searchParams: TaskAndWorksQuery;
}) {
  const data = await fetchFilterdTaskAndWorks(searchParams);

  return (
    <TableContainer>
      <Table sx={{ borderRadius: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell width="10%" className="p-0" />
            <TableCell width="20%" align="center" className="p-0">
              <p className="bg-gray-100 m-1 p-4 rounded-lg">タスク名</p>
            </TableCell>
            <TableCell align="center" className="p-0">
              <p className="bg-gray-100 m-1 p-4 rounded-lg">タスク内容</p>
            </TableCell>
            <TableCell width="20%" align="center" className="p-0">
              <p className="bg-gray-100 m-1 p-4 rounded-lg">稼働時間合計</p>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((task) => (
            <WorkRow task={task}/>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
