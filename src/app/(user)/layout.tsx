import { auth, signOut } from "@/auth";
import AttendanceForm from "@/components/attendance-form";
import ProjectForm from "@/components/project-form";
import prisma from "@/db";
import Link from "next/link";

import { Nav, NavList } from "@/components/nav-list";

import BarChartIcon from "@mui/icons-material/BarChart";
import DateRangeIcon from "@mui/icons-material/DateRange";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import SettingsIcon from "@mui/icons-material/Settings";
import TaskIcon from "@mui/icons-material/Task";
import Box from "@mui/material/Box";
import grey from "@mui/material/colors/grey";

const navs: Nav[] = [
  { icon: BarChartIcon, title: "ダッシュボード", href: "/dashboard" },
  { icon: TaskIcon, title: "タスク", href: "/tasks" },
  { icon: PendingActionsIcon, title: "稼働状況", href: "/works" },
  {
    icon: DateRangeIcon,
    title: "レポート",
    subNavs: [
      { icon: DateRangeIcon, title: "全般", href: "/reports/common" },
      { icon: DateRangeIcon, title: "プロジェクト", href: "/reports/project" },
    ],
  },
  { icon: SettingsIcon, title: "設定", href: "/settings" },
];

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const user = session?.user;

  if (!user?.id) {
    return;
  }

  const projects = await prisma.project.findMany({
    where: { createdBy: { id: user?.id } },
  });
  const activeProject = await prisma.project.findUnique({
    where: { selecterId: user?.id },
  });
  const lastAttendance = await prisma.dailyReport.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-72 flex-none">
        <div className="flex flex-col h-full">
          <div className="grow">
            <Link href="/dashboard">
              <div className="bg-gradient-to-tr from-blue-500 to-blue-300 py-10 m-3 text-white rounded-lg hover:opacity-95">
                <h2 className="text-3xl font-medium text-center">Nowata</h2>
              </div>
            </Link>
            <NavList navs={navs} />
          </div>
          <div className="bg-gray-400 flex items-center justify-between p-4 m-3 rounded-lg">
            <div className="flex items-center">
              <img
                src={user?.image ?? ""}
                alt="user"
                className="inline-block w-8 h-8 rounded-full"
              />
              <p className="text-white text-sm ml-3">{user?.name}</p>
            </div>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
              className="flex items-center"
            >
              <button type="submit" title="Logout">
                <svg
                  className="h-8 w-8 text-white"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {" "}
                  <path stroke="none" d="M0 0h24v24H0z" />{" "}
                  <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />{" "}
                  <path d="M7 12h14l-3 -3m0 6l3 -3" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col">
        <Box
          padding={1}
          borderBottom={1}
          borderColor={grey[500]}
          boxShadow={3}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{ width: "100%" }}
        >
          <ProjectForm
            projects={projects.map((project) => ({
              id: project.id,
              checked: project.id === activeProject?.id,
              name: project.title,
              description: project.description,
            }))}
          />
          <AttendanceForm lastAttendance={lastAttendance} />
        </Box>
        <Box
          flexGrow={1}
          bgcolor={grey[100]}
          //padding={2}
          sx={{ overflow: "auto" }}
        >
          {children}
        </Box>
      </div>
    </div>
  );
}
