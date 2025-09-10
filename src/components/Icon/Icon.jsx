import React from "react";

const Icon = ({ type }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {type === "copy" && (
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      )}
      {type === "copy" && (
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      )}
      {type === "paste" && (
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
      )}
      {type === "paste" && (
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
      )}
    </svg>
  );
};

export default Icon;
