import WorkList from "@/components/new/work-list";
import WorkSearch from "@/components/new/work-search";
import { WorkListSkeleton } from "@/components/skeleton";
import { TaskAndWorksQuery } from "@/lib/definitions";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import blue from "@mui/material/colors/blue";
import { Suspense } from "react";

export default async function Works({
  searchParams,
}: {
  searchParams?: TaskAndWorksQuery;
}) {
  return (
    <Box padding={4}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <WorkSearch />
        </Grid>
        <Grid item xs={6}>
          <Box
            sx={{
              backgroundColor: blue[50],
              padding: 4,
              borderRadius: 4,
              height: "calc(100vh - 300px)",
            }}
          >
            <Suspense
              key={`search-work-${new Date()}`}
              fallback={<WorkListSkeleton />}
            >
              <Box sx={{ backgroundColor: "#fff", borderRadius: 2 }}>
                <WorkList searchParams={searchParams} />
              </Box>
            </Suspense>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
