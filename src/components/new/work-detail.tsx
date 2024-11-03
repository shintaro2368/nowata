import { editDescirption } from "@/actions/work-action";
import { minutesToHoursMinutes } from "@/lib/time";
import { workDescriptionValidation } from "@/lib/validation";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { Work } from "@prisma/client";
import { useRef } from "react";
import { useFormState } from "react-dom";

export default function WorkDetail({ work }: { work: Work }) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [lastResult, action] = useFormState(editDescirption, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: workDescriptionValidation });
    },
    defaultValue: { description: work.description },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  function handleOnBlur() {
    formRef.current?.requestSubmit();
  }

  return (
    <TableRow key={work.id}>
      <TableCell>{work.startAt.toLocaleString()}</TableCell>
      <TableCell>{work?.endAt ? work.endAt.toLocaleString() : "-"}</TableCell>
      <TableCell>
        <form
          ref={formRef}
          action={action}
          id={form.id}
          onSubmit={form.onSubmit}
          noValidate
        >
          <input type="hidden" name={fields.id.name} value={work.id} />
          <textarea
            key={fields.description.key}
            name={fields.description.name}
            defaultValue={fields.description.initialValue}
            className="w-full h-auto"
            rows={5}
            placeholder="コメントを入力(最大100文字)"
            onBlur={handleOnBlur}
          ></textarea>
          {fields.description.errors && (
            <span className="text-red-600 text-sm">
              {fields.description.errors}
            </span>
          )}
        </form>
      </TableCell>
      <TableCell align="right">
        {work.totalTime ? minutesToHoursMinutes(work.totalTime) : "-"}
      </TableCell>
    </TableRow>
  );
}
