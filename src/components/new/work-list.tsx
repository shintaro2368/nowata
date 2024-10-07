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
            <TableCell />
            <TableCell>タスク</TableCell>
            <TableCell>内容</TableCell>
            <TableCell>稼働時間合計(h)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((task) => (
            <WorkRow task={task} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
