"use client";

import { useEffect } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-json";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-css";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-yaml";
import type { DocCodeHighlightProps } from "../types";

export function DocCodeHighlight({
  children,
  className = "",
}: DocCodeHighlightProps) {
  useEffect(() => {
    Prism.highlightAll();
  }, [children]);

  return <div className={className}>{children}</div>;
}
