import React from "react";
import { FlaskConical } from "lucide-react";
export const SyntheticDataBadge = ({ className = "", size = "sm", }) => {
    const sizeStyles = {
        sm: "px-2 py-0.5 text-[10px] gap-1",
        md: "px-2.5 py-1 text-xs gap-1.5",
    }[size];
    return (<span title="This record is part of a controlled benchmark test dataset." className={`inline-flex items-center font-bold tracking-wider uppercase rounded-md bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800 ${sizeStyles} ${className}`}>
      <FlaskConical className="w-3 h-3"/>
      <span>Benchmark Dataset</span>
    </span>);
};
