import React from "react";

export const TextError = ({ errorText }: { errorText: string }) => {
  return (
    <div
      style={{
        maxHeight: errorText ? "10px" : "0px",
        transition: "max-height 0.5s ease-in-out",
        height: "auto",
      }}
      className="mx-auto flex w-full justify-center space-x-3"
    >
      <p
        className={`-translate-y-[10px] animate-pulse text-4xl text-red-600 ${
          errorText ? "opacity-1 h-[10px]" : "hidden h-[0px] opacity-0"
        }`}
      >
        &bull;
      </p>
      <p
        className={`duration-800 animate-bounce text-center text-red-600 transition-all ease-in-out ${
          errorText ? "opacity-1 h-full" : "hidden h-[0px] opacity-0"
        }`}
      >
        {`${errorText}`}
      </p>
      <p
        className={`-translate-y-[10px] animate-pulse text-4xl text-red-600 ${
          errorText ? "opacity-1 h-full" : "hidden h-[0px] opacity-0"
        }`}
      >
        &bull;
      </p>
    </div>
  );
};
