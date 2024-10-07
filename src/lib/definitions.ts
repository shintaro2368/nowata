import { TaskStatus } from "@prisma/client";

export type TaskAndWorksQuery =
  | {
      title?: string;
      statuses?: TaskStatus[];
      from?: Date;
      to?: Date;
    }
  | undefined;
