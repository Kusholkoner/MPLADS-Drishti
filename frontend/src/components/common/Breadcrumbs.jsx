import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
export const Breadcrumbs = ({ items, className = "" }) => {
    return (<nav aria-label="Breadcrumb" className={`flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 ${className}`}>
      <Link href="/app/command-center" className="flex items-center hover:text-slate-900 dark:hover:text-white transition-colors">
        <Home className="w-3.5 h-3.5"/>
      </Link>

      {items.map((item, idx) => {
            const isLast = idx === items.length - 1;
            return (<React.Fragment key={idx}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0"/>
            {item.href && !isLast ? (<Link href={item.href} className="hover:text-slate-900 dark:hover:text-white transition-colors truncate max-w-[200px]">
                {item.label}
              </Link>) : (<span className={`font-semibold truncate max-w-[250px] ${isLast ? "text-slate-900 dark:text-slate-100" : ""}`}>
                {item.label}
              </span>)}
          </React.Fragment>);
        })}
    </nav>);
};
