"use client";
import { attendance, leave } from "@/actions/daily-report-action";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import { usePathname } from "next/navigation";
import { Fragment, useState } from "react";

export default function AttendanceForm({ isWorking }: { isWorking: boolean }) {
  const pathname = usePathname();
  const [state, setState] = useState<{
    open: boolean;
    message: string | null;
  }>({
    open: false,
    message: null,
  });

  const handleClose = () => {
    setState({
      open: false,
      message: null,
    });
  };

  const handleOnClick = async () => {
    isWorking ? await leave(pathname) : await attendance();
    setState({
      open: true,
      message: isWorking
        ? "お疲れ様でした！退勤しました"
        : "おはようございます！出勤しました",
    });
  };
  return (
    <Fragment>
      <Box>
        {isWorking ? (
          <Button
            type="submit"
            variant="contained"
            color="success"
            onClick={handleOnClick}
          >
            退勤
          </Button>
        ) : (
          <Button
            variant="contained"
            type="submit"
            color="primary"
            onClick={handleOnClick}
          >
            出勤
          </Button>
        )}
      </Box>

      <Snackbar
        open={state.open}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={handleClose}
      >
        <Alert severity="success" color="info">
          {state.message}
        </Alert>
      </Snackbar>
    </Fragment>
  );
}
