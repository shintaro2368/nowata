import { Task, Work,SubTask } from "@prisma/client";

type TaskAndWorks = Task & { Work: Work[], SubTask: SubTask[] };
export default TaskAndWorks;
