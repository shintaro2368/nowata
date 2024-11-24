import { useRef } from "react";
import { IMask, IMaskInput } from "react-imask";

type TimeMaskProps = {
  handleOnAccept: (value: string) => void;
  value: string | undefined;
  disabled: boolean;
};

export default function TimeMask({
  value,
  handleOnAccept,
  disabled,
}: TimeMaskProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <IMaskInput
      inputRef={inputRef}
      disabled={disabled}
      value={value}
      mask="HH:MM"
      blocks={{
        HH: {
          mask: IMask.MaskedRange,
          placeholderChar: "HH",
          from: 0,
          to: 23,
          maxLength: 2,
        },
        MM: {
          mask: IMask.MaskedRange,
          placeholderChar: "MM",
          from: 0,
          to: 59,
          maxLength: 2,
        },
      }}
      className={`text-right w-full h-full bg-inherit`}
      onBlur={(e) => {
        const regex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
        const targetValue = e.target.value;
        if (targetValue && !regex.test(targetValue)) {
          if (inputRef.current) {
            inputRef.current.value = value ? value : "";
          }
          alert(
            "時刻のフォーマットが異なります\nHH:mm (HHは00から23 mmは00から59)"
          );
        } else {
          handleOnAccept(targetValue);
        }
      }}
    />
  );
}
