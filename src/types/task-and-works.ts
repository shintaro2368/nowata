import { Task, Work } from "@prisma/client";

type TaskAndWorks = Task & { Work: Work[] };
export default TaskAndWorks;
