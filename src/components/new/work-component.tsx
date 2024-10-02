"use client";

import Box from "@mui/material/Box";
import blue from "@mui/material/colors/blue";
import Grid from "@mui/material/Grid";
import { useState } from "react";

import WorkList from "./work-list";
import WorkRate from "./work-rate";
import WorkSearch from "./work-search";

import TaskAndWorks from "@/types/task-and-works";

export default function WorkComponent() {
  const [searchResult, setSearchResult] = useState<TaskAndWorks[]>([]);

  return (
    <Box padding={4}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <WorkSearch
            handleSetResult={(result: TaskAndWorks[]) =>
              setSearchResult(result)
            }
          />
        </Grid>

        <Grid item xs={6}>
          <Box
            sx={{
              backgroundColor: blue[50],
              padding: 4,
              borderRadius: 4,
              height: "92vh",
            }}
          >
            <Box sx={{ backgroundColor: "#fff", borderRadius: 2 }}>
              <WorkList tasks={searchResult} />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box
            width="100%"
            height="100%"
            padding={6}
            border={6}
            borderRadius={2}
            borderColor={blue[50]}
          >
            <WorkRate />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
