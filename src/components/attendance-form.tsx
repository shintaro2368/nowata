"use client";
import { startWork, endWork } from "@/actions/daily-report-action";

import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import { useState } from "react";

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
    <>
      <div>
        {isWorking ? (
          <form action={endWork}>
            <button
              type="submit"
              className="bg-red-500 text-white text-2xl px-8 py-4 rounded-md hover:bg-red-600"
              onClick={handleOnClick}
            >
              退勤
            </button>
          </form>
        ) : (
          <form action={startWork}>
            <button
              type="submit"
              className="bg-green-500 text-white text-2xl px-8 py-4 rounded-md hover:bg-green-600"
              onClick={handleOnClick}
            >
              出勤
            </button>
          </form>
        )}
      </div>
      <div>
        <Snackbar
          open={state.open}
          autoHideDuration={4000}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          onClose={handleClose}
        >
          <Alert severity="success" color="info">
            {state.message}
          </Alert>
        </Snackbar>
      </div>
    </>
  );
}
