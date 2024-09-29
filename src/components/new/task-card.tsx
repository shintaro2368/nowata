import { deleteTask, updateCardBgColor } from "@/actions/task-action";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { SketchPicker } from "react-color";
import ConfirmDeleteItem from "../confirm-delete-item";

import { Task } from "@prisma/client";

export default function TaskCard({
  task,
  onClick,
}: {
  task: Task;
  onClick: (task: Task) => void;
}) {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [displayConfirmDelete, setDisplayConfirmDelete] = useState(false);
  const [color, setColor] = useState(
    task.cardBgColor ? task.cardBgColor : "#fff"
  );

  const handleClosePicker = async (taskId: string) => {
    await updateCardBgColor(taskId, color);
    setDisplayColorPicker((prev) => !prev);
  };

  return (
    <>
      <Card
        key={task.id}
        sx={{ borderRadius: 2, maxWidth: 400, backgroundColor: color }}
      >
        <CardActionArea onClick={() => onClick(task)}>
          <CardContent sx={{ height: 400 }}>
            <Typography variant="h4" noWrap>
              {task.title}
            </Typography>
            <Typography color="GrayText">
              {task.createdAt.toLocaleDateString()}
            </Typography>
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
              <Button variant="outlined" title="このタスクの作業を開始します">
                開始
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => setDisplayConfirmDelete(true)}
              >
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
                color={color}
                onChange={(color) => setColor(color.hex)}
              />
            </Box>
          )}
        </CardActions>
      </Card>
      <ConfirmDeleteItem
        open={displayConfirmDelete}
        handleClose={() => setDisplayConfirmDelete(false)}
        action={async () => deleteTask(task.id)}
      />
    </>
  );
}
