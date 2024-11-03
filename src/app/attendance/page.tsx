import { auth, signOut } from "@/auth";
import AttendanceButton from "@/components/attendance-button";
import prisma from "@/db";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { redirect } from "next/navigation";

export default async function Attendance() {
  const session = await auth();
  if (session?.user?.id) {
    const attendancedReport = await prisma.dailyReport.findFirst({
      where: { userId: session.user.id, endAt: null },
      orderBy: { date: "desc" },
    });

    if (attendancedReport) redirect("/dashboard");
  }
  return (
    <Box component="div" className="h-screen w-screen">
      <Box component="div" className="h-full flex justify-center items-center">
        <Box>
          <Typography variant="h1" align="center" marginBottom={4}>
            Nowata
          </Typography>
          <Typography variant="h2" gutterBottom>
            おはようございます
          </Typography>
          <Typography
            variant="h4"
            gutterBottom
          >{`${session?.user?.name} さん`}</Typography>
          <Box marginTop={4} display="flex">
            <AttendanceButton />
            <Box
              component="form"
              marginLeft={1}
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <Button variant="outlined" type="submit">
                ログアウト
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
