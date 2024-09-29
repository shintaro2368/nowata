import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

export default function TaskNew({onClick, disable}: {onClick: () => void, disable: boolean}) {
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
        sx={{ fontSize: 32, borderRadius: "50%", height: 250 , width: 250 }}
        onClick={() => onClick()}
        disabled={disable}
      >
        New
      </Button>
    </Box>
  );
}
