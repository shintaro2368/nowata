import { searchWork } from "@/actions/work-action";
import TaskAndWorks from "@/types/task-and-works";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import grey from "@mui/material/colors/grey";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TaskStatus } from "@prisma/client";
import { useEffect, useState } from "react";
import DatePickerProvider from "../date-picker-provider";

export type WorkSearchProp = {
  taskTitle: string | undefined;
  from: Date | undefined;
  to: Date | undefined;
  status: TaskStatus[];
};

export default function WorkSearch({
  handleSetResult,
}: {
  handleSetResult: (searchParam: TaskAndWorks[]) => void;
}) {
  const [searchParam, setSearchParam] = useState<WorkSearchProp>({
    taskTitle: undefined,
    from: undefined,
    to: undefined,
    status: ["DOING"],
  });

  const handleSearch = async () => {
    const result = await searchWork(searchParam);
    console.log("result", JSON.stringify(result, null, "\t"));
    handleSetResult(result);
  };

  useEffect(() => {
    const func = async () => {
      await handleSearch();
    };

    func();
  }, []);

  return (
    <Box bgcolor={grey[100]} borderRadius={4} paddingY={2} paddingX={4}>
      <Box>
        <Stack spacing={2}>
          <Stack direction="row" spacing={4} alignItems="end">
            <Box>
              <TextField
                label="タスク"
                variant="standard"
                value={searchParam.taskTitle}
                onChange={(e) =>
                  setSearchParam((prev) => {
                    return { ...prev, taskTitle: e.target.value };
                  })
                }
                
              />
            </Box>
            <Box>
              <ButtonGroup>
                {Object.values(TaskStatus).map((value) => (
                  <Button
                    sx={{ borderColor: grey[500] }}
                    color="inherit"
                    variant={
                      searchParam.status.find((status) => status === value)
                        ? "contained"
                        : "outlined"
                    }
                    onClick={() => {
                      if (
                        !searchParam.status?.find((status) => status === value)
                      ) {
                        setSearchParam((prev) => {
                          return { ...prev, status: [...prev.status, value] };
                        });
                      } else {
                        setSearchParam((prev) => {
                          return {
                            ...prev,
                            status: prev.status.filter(
                              (status) => status !== value
                            ),
                          };
                        });
                      }
                    }}
                    key={value}
                  >
                    {value}
                  </Button>
                ))}
              </ButtonGroup>
            </Box>

            <DatePickerProvider>
              <DatePicker
                label="稼働期間(開始)"
                slotProps={{ textField: { variant: "standard" } }}
              />
              <span>-</span>
              <DatePicker
                label="稼働期間(終了)"
                slotProps={{ textField: { variant: "standard" } }}
              />
            </DatePickerProvider>
          </Stack>
          <Box>
            <Button
              startIcon={<SearchIcon />}
              variant="contained"
              onClick={handleSearch}
            >
              検索
            </Button>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
