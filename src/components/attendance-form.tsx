"use client";
import { endWork, startWork } from "@/actions/daily-report-action";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";

import { Fragment, useState } from "react";

export default function AttendanceForm({ isWorking }: { isWorking: boolean }) {
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

  const handleOnClick = () => {
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
          <form action={endWork}>
            <Button
              type="submit"
              variant="contained"
              color="success"
              onClick={handleOnClick}
            >
              退勤
            </Button>
          </form>
        ) : (
          <form action={startWork}>
            <Button
              variant="contained"
              type="submit"
              color="primary"
              onClick={handleOnClick}
            >
              出勤
            </Button>
          </form>
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
