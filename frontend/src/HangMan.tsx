import * as React from "react"

const HangManComponent = ({ wrongGuesses = 0, className = "", strokeWidth = 4, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 210 297"
    className={`w-full h-full text-white fill-none ${className}`}
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    preserveAspectRatio="xMidYMid slice"
    {...props}
  >
    <g transform="translate(0,38)">
      <path d="m94.477 71.089.38-17.67" fill="none" />

      <path d="m94.9 53.694-78.997-.374ZM15.903 53.507l-.562 113.937 103.086.375M15.941 68.064l16.603-14.618M15.28 167.448l-12.072-.132" fill="none" />

      {/* HEAD */}
      {wrongGuesses >= 1 && (
        <ellipse cx={95.114} cy={81.93} rx={11.176} ry={10.522} fill="none" />
      )}

      {/* TORSO */}
      {wrongGuesses >= 2 && <path d="m95.12 92.254.245 37.824" fill="none" />}

      {/* BOTH LEGS */}
      {wrongGuesses >= 3 && <path d="m95.259 129.633 12.369 23.217zM95.339 129.68l-10.945 23.48Z" fill="none" />}

      {/* LEFT ARM */}
      {wrongGuesses >= 4 && <path d="m95.09 95.978 12.578 16.976Z" fill="none" />}

      {/* RIGHT ARM */}
      {wrongGuesses >= 5 && <path d="m95.365 95.908-11.58 16.994Z" fill="none" />}
    </g>
  </svg>
)

export default HangManComponent