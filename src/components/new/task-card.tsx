import { updateCardBgColor } from "@/actions/task-action";
import { startWork, stopWork } from "@/actions/work-action";
import { attendanceAtom, editTaskAtom, displayTaskFormAtom } from "@/state";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { SubTask, Task, Work } from "@prisma/client";
import { useAtomValue, useSetAtom } from "jotai";
import { Fragment, useState } from "react";
import { SketchPicker } from "react-color";

export default function TaskCard({
  task,
}: {
  task: Task & { Work: Work[]; SubTask: SubTask[] };
}) {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [cardBgColor, setcardBgColor] = useState(task.cardBgColor ?? "#fff");

  const handleClosePicker = async (taskId: string) => {
    await updateCardBgColor(taskId, cardBgColor);
    setDisplayColorPicker((prev) => !prev);
  };

  const attendanceState = useAtomValue(attendanceAtom);
  const setEditTaskValue = useSetAtom(editTaskAtom);
  const setDisplayTaskFrom = useSetAtom(displayTaskFormAtom);

  function handleOnClick() {
    setEditTaskValue(task);
    setDisplayTaskFrom(true);
  }

  return (
    <Fragment>
      <Card
        sx={{
          borderRadius: 2,
          maxWidth: 400,
          backgroundColor: cardBgColor,
        }}
      >
        <CardActionArea onClick={handleOnClick}>
          <CardContent sx={{ height: 400 }}>
            <Typography
              variant="h4"
              noWrap
              borderBottom={1}
              gutterBottom
              paddingBottom={1}
            >
              {task.title}
            </Typography>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography>{task.status}</Typography>
              <Typography color="GrayText">
                {task.dueDate?.toLocaleDateString()}
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{ whiteSpace: "pre-wrap" }}
              marginTop={2}
            >
              {task.description ? task.description : "内容がありません"}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Box
            component="div"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            padding={1}
            borderRadius={2}
            sx={{ width: "100%", backgroundColor: "#fff" }}
          >
            <Box
              component="div"
              onClick={() => setDisplayColorPicker((prev) => !prev)}
              sx={{ cursor: "pointer" }}
              title="色を選択"
            >
              <ColorLensIcon />
            </Box>

            <Stack direction="row" spacing={1}>
              {task.Work.length === 0 ? (
                <Button
                  variant="outlined"
                  title="このタスクの作業を開始します"
                  onClick={async () => await startWork(task.id)}
                  disabled={!attendanceState}
                >
                  開始
                </Button>
              ) : (
                <Button
                  color="warning"
                  variant="contained"
                  title="このタスクの作業を終了します"
                  onClick={async () => await stopWork(task.id)}
                >
                  終了
                </Button>
              )}
              <Button variant="outlined" color="error">
                削除
              </Button>
            </Stack>
          </Box>
          {displayColorPicker && (
            <Box component="div" position="absolute" zIndex={2}>
              <Box
                component="div"
                position="fixed"
                top={0}
                right={0}
                bottom={0}
                left={0}
                onClick={() => handleClosePicker(task.id)}
              />
              <SketchPicker
                color={cardBgColor}
                onChange={(color) => setcardBgColor(color.hex)}
              />
            </Box>
          )}
        </CardActions>
      </Card>
      {/* <ConfirmDeleteItem
        open={displayConfirmDelete}
        handleClose={() => setDisplayConfirmDelete(false)}
        action={async () => deleteTask(task.id)}
      /> */}
    </Fragment>
  );
}
