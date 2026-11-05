import Link from "next/link";
import Image from "next/image";
import React from "react";
import type { MDXCardProps } from "../../types";

export function Card({ title, description, href, icon, image }: MDXCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 dark:hover:shadow-slate-900/50 transition-all duration-200"
    >
      {image && (
        <div className="aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100 group-hover:bg-blue-500 group-hover:text-white transition-colors">
              {icon}
            </div>
          )}
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
            {title}
          </h3>
        </div>
        {description && (
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
            {description}
          </p>
        )}
      </div>
    </Link>
  );
}

export function CardGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 my-8">
      {children}
    </div>
  );
}
