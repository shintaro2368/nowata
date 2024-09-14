"use client";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import DeleteIcon from "@mui/icons-material/Delete";
import { startWork, stopWork } from "@/actions/work-action";
import { deleteTask } from "@/actions/task-action";
import EditIcon from "@mui/icons-material/Edit";

export default function WorkControle({
  taskId,
  status,
}: {
  taskId: string;
  status: "none" | "running";
}) {
  const play = () => {
    return (
      <div
        onClick={() => startWork(taskId)}
        className="cursor-pointer w-fit"
        title="開始"
      >
        <PlayArrowIcon color="primary" />
      </div>
    );
  };

  const stop = () => {
    return (
      <div
        onClick={() => stopWork(taskId)}
        className="cursor-pointer w-fit"
        title="停止"
      >
        <StopIcon color="error" />
      </div>
    );
  };

  return (
    <div className="flex items-center gap-4">
      <div>{status === "none" ? play() : stop()}</div>
      <div className="cursor-pointer w-fit" title="編集">
        <EditIcon color="primary" />
      </div>
      <div className="cursor-pointer w-fit" title="削除">
        <DeleteIcon color="error" onClick={() => deleteTask(taskId)} />
      </div>
    </div>
  );
}
