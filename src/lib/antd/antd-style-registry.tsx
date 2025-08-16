"use client";

import React from "react";
import { useServerInsertedHTML } from "next/navigation";
import { createCache, extractStyle, StyleProvider } from "@ant-design/cssinjs";
import type Entity from "@ant-design/cssinjs/es/Cache";

let cache: Entity;

if (typeof window === "undefined") {
  cache = createCache();
} else {
  cache = undefined as any;
}

export function AntdStyleRegistry({ children }: { children: React.ReactNode }) {
  useServerInsertedHTML(() => {
    if (cache) {
      const styleText = extractStyle(cache);
      return (
        <style id="antd" dangerouslySetInnerHTML={{ __html: styleText }} />
      );
    }
    return null;
  });

  return <StyleProvider cache={cache}>{children}</StyleProvider>;
}
