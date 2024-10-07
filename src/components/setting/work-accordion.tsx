import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import { Setting } from "@prisma/client";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import DatePickerProvider from "../date-picker-provider";
import HourAndMinutes from "../hour-minute";

import { updataSetting } from "@/actions/setting-action";

function SubmitButton() {
  const status = useFormStatus();
  return (
    <Button type="submit" variant="contained" disabled={status.pending}>
      変更を保存
    </Button>
  );
}

export default function WorkAccordion({ setting }: { setting: Setting }) {
  const [isChenged, setIsChanged] = useState(true);
  const [formState, action] = useFormState(updataSetting, null);
  console.log(formState);

  // useEffect(() => {
  //   if (isChenged) {
  //     setIsChanged(false);
  //   }
  // },[setting]);

  return (
    <form action={action}>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          勤務形態
        </AccordionSummary>
        <AccordionDetails>
          <DatePickerProvider>
            <Stack spacing={4}>
              <Divider>勤怠</Divider>
              <HourAndMinutes
                defaultHour={setting.standardStartWorkHour}
                defaultMinute={setting.standardStartWorkMinute}
                label="標準稼働開始"
                hourName="stdStartHour"
                minuteNuame="stdStartMinute"
                hourAdorment="時"
              />
              <HourAndMinutes
                defaultHour={setting.standardEndWorkHour}
                defaultMinute={setting.standardEndWorkMinute}
                label="標準稼働終了"
                hourName="stdEndHour"
                minuteNuame="stdEndMinute"
                hourAdorment="時"
              />
              <HourAndMinutes
                defaultHour={setting.standardBreakHour}
                defaultMinute={setting.standardBreakMinute}
                label="休憩時間"
                hourName="breakHour"
                minuteNuame="breakMinute"
              />
              <Divider>稼働時間(月単位)</Divider>
              <HourAndMinutes
                label="標準"
                hourName="stdWorkHour"
                minuteNuame="stdWorkMinute"
              />
              <HourAndMinutes
                label="最低"
                hourName="minWorkHour"
                minuteNuame="minWorkMinute"
              />
              <HourAndMinutes
                label="最大"
                hourName="maxWorkHour"
                minuteNuame="maxWorkMinute"
              />
            </Stack>
          </DatePickerProvider>
        </AccordionDetails>
        <AccordionActions>{isChenged && <SubmitButton />}</AccordionActions>
      </Accordion>
    </form>
  );
}
