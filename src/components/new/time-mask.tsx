import { useRef, useState } from "react";
import { IMask, IMaskInput } from "react-imask";
import React from "react";
import { InputReport } from "./report-row";


type TimeMaskProps = {handleOnAccept: (value: string) => void, value: string | undefined};

export default function TimeMask({value, handleOnAccept}: TimeMaskProps) {
  const ref = useRef(null);
  const inputRef = useRef(null);
  const [isError, setIsError] = useState(false);

  return (
    <IMaskInput
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
      //ref={ref}
      //inputRef={inputRef}
      //overwrite
      className={`text-right w-full h-full bg-inherit`}
      //onAccept={(e) => handleOnAccept(e)}
      onBlur={(e) => {
        const regex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
        const value = e.target.value;
        if (value && !regex.test(value)) {
          
            setIsError(!isError);
          
        } else {
          //setIsError(!isError);
          handleOnAccept(value);
        }
      }}
    />
  );
}
