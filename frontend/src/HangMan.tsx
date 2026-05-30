import * as React from "react"

const HangManComponent = ({ wrongGuesses = 0, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="210mm"
    height="297mm"
    viewBox="0 0 210 297"
    className="w-full h-auto max-w-xs fill-none stroke-black stroke-opacity-100" // Global styles inherited by all paths
    {...props}
  >
    <path
      d="m94.477 71.089.38-17.67"
      className="stroke-[0.520134px]"
    />
    <path
      d="m94.9 53.694-78.997-.374ZM15.903 53.507l-.562 113.937 103.086.375M15.941 68.064l16.603-14.618M15.28 167.448l-12.072-.132"
      className="stroke-[0.665001px]"
    />

    {/*HEAD*/}
    {wrongGuesses >= 1 && (
      <ellipse
        cx={95.114}
        cy={81.93}
        rx={11.176}
        ry={10.522}
        className="stroke-[0.447379px]"
      />
    )}

    {/*TORSO*/}
    {wrongGuesses >= 2 && (
      <path
        d="m95.12 92.254.245 37.824"
        className="stroke-[0.590629px]"
      />
    )}

    {/*BOTH LEGS*/}
    {wrongGuesses >= 3 && (
      <path
        d="m95.259 129.633 12.369 23.217zM95.339 129.68l-10.945 23.48Z"
        className="stroke-[0.665001px]"
      />
    )}

    {/*LEFT ARM*/}
    {wrongGuesses >= 4 && (
      <path
        d="m95.09 95.978 12.578 16.976Z"
        className="stroke-[0.670128px]"
      />
    )}

    {/*RIGHT ARM*/}
    {wrongGuesses >= 5 && (
      <path
        d="m95.365 95.908-11.58 16.994Z"
        className="stroke-[0.643318px]"
      />
    )}
  </svg>
)

export default HangManComponent