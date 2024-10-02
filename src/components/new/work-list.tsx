"use client";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { Task, Work } from "@prisma/client";
import { Fragment, useState } from "react";
import TaskAndWorks from "@/types/task-and-works";

function Row({ task }: { task: TaskAndWorks }) {
  const [open, setOpen] = useState(false);

  return (
    <Fragment>
      <TableRow key={task.id} sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen((prev) => !prev)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell title={task.title}>{task.title}</TableCell>
        <TableCell title={task.description ?? ""}>{task.description}</TableCell>
        <TableCell align="right">20</TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={4} style={{ paddingTop: 0, paddingBottom: 0 }}>
          <Collapse in={open} timeout="auto">
            <Box component="div" sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom>
                稼働履歴
              </Typography>
              {task.Work.length > 0 ? (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>開始</TableCell>
                      <TableCell>終了</TableCell>
                      <TableCell>作業時間(h)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {task.Work.map((work) => (
                      <TableRow key={work.id}>
                        <TableCell>
                          {work.startAt.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {work?.endAt ? work.endAt.toLocaleString() : "-"}
                        </TableCell>
                        <TableCell>
                          {work.totalTime
                            ? work.totalTime.toLocaleString()
                            : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                "稼働履歴はありません"
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  );
}

export default function WorkList({ tasks }: { tasks: TaskAndWorks[] }) {
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
          {tasks.map((task) => (
            <Row task={task} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
