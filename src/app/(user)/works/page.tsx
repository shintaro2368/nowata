import WorkList from "@/components/new/work-list";
import WorkSearch from "@/components/new/work-search";
import { WorkListSkeleton } from "@/components/skeleton";
import { TaskAndWorksQuery } from "@/lib/definitions";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { TaskStatus } from "@prisma/client";
import dayjs from "dayjs";
import { Suspense } from "react";

// Next.js 15からはクエリパラメータがPromiseオブジェクトで渡されるようなのでバージョンアップの際は注意
export default async function Works({
  searchParams,
}: {
  searchParams: {
    [key in keyof TaskAndWorksQuery]: string | string[] | undefined;
  };
}) {
  // 同期処理が多いので非同期関数として定義しているが、効果はあるのかな
  // zodのバリデーション処理の方が見通しが良いかもしれない
  async function parseQuery(): Promise<TaskAndWorksQuery> {
    const { title, from, to } = searchParams;
    if (Array.isArray(title) || Array.isArray(from) || Array.isArray(to)) {
      throw new Error("URLが不正のため、検索ができませんでした");
    }

    let statuses: TaskStatus[] = [];
    if (statuses) {
      if (Array.isArray(searchParams.statuses)) {
        Object.values(TaskStatus).forEach((value) => {
          if (searchParams.statuses?.includes(value)) {
            statuses.push(value);
          }
        });
      } else {
        Object.values(TaskStatus).forEach((value) => {
          if (value === searchParams.statuses) {
            statuses.push(value);
          }
        });
      }
    }

    return {
      title,
      statuses: statuses.length > 0 ? statuses : undefined,
      from: from ? dayjs(from + " 00:00").add(9, "hour").toDate() : undefined,
      to: to ? dayjs(to + " 00:00").add(9, "hour").toDate() : undefined,
    };
  }

  const taskAndWorksQuery = await parseQuery();

  return (
    <Box padding={4}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <WorkSearch />
        </Grid>
        <Grid item xs={6}>
          <Suspense
            key={`search-work-${new Date()}`}
            fallback={<WorkListSkeleton />}
          >
            <Box sx={{ backgroundColor: "#fff", borderRadius: 2 }}>
              <WorkList searchParams={taskAndWorksQuery} />
            </Box>
          </Suspense>
        </Grid>
      </Grid>
    </Box>
  );
}
