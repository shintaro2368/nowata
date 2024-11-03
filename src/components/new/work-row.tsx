"use client";

import { TaskAndWorksQuery } from "@/lib/definitions";
import { minutesToHoursMinutes } from "@/lib/time";
import TaskAndWorks from "@/types/task-and-works";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { Fragment, useState } from "react";
import WorkDetail from "./work-detail";

export default function WorkRow({
  task
}: {
  task: TaskAndWorks;
}) {
  const [open, setOpen] = useState(false);
  let totalWorkTime = 0;
  task.Work.forEach(
    (work) => (totalWorkTime += work.totalTime ? work.totalTime : 0)
  );

  return (
    <Fragment key={task.id}>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen((prev) => !prev)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell title={task.title}>{task.title}</TableCell>
        <TableCell title={task.description ?? ""}>{task.description}</TableCell>
        <TableCell align="right">
          {minutesToHoursMinutes(totalWorkTime)}
        </TableCell>
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
                      <TableCell align="center" width="20%" className="p-0">
                        <p className="bg-gray-100 m-1 p-2 rounded-lg">開始</p>
                      </TableCell>
                      <TableCell align="center" width="20%" className="p-0">
                        <p className="bg-gray-100 m-1 p-2 rounded-lg">終了</p>
                      </TableCell>
                      <TableCell align="center" className="p-0">
                        <p className="bg-gray-100 m-1 p-2 rounded-lg">
                          コメント
                        </p>
                      </TableCell>
                      <TableCell align="center" width="15%" className="p-0">
                        <p className="bg-gray-100 m-1 p-2 rounded-lg">
                          作業時間
                        </p>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {task.Work.map((work) => (
                      <WorkDetail work={work} />
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
