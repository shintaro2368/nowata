"use client";

import { createTheme } from "@mui/material";

// font-familyはNext.jsで指定するものを継承
// 大文字と小文字を区別
const theme = createTheme({
  typography: {
    fontFamily: "inherit",
    button: {
      textTransform: "none",
    },
  },
});

export default theme;
