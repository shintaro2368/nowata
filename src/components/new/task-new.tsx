import { displayTaskFormAtom } from "@/state";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useAtomValue, useSetAtom } from "jotai";

export default function TaskNew() {
  const displayTaskFormValue = useAtomValue(displayTaskFormAtom);
  const setDispalyTaskForm = useSetAtom(displayTaskFormAtom);

  return (
    <Box
      component="div"
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ height: "468px" }}
    >
      <Button
        variant="outlined"
        color="info"
        startIcon={<AddIcon sx={{ fontSize: 32 }} />}
        sx={{ fontSize: 32, borderRadius: "50%", height: 250, width: 250 }}
        onClick={() => setDispalyTaskForm(true)}
        disabled={displayTaskFormValue}
      >
        New
      </Button>
    </Box>
  );
}
