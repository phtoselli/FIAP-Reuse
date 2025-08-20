"use client";

import formatSegment from "@/lib/utils/formatSegment";
import { Breadcrumb } from "antd";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

export default function BreadcrumbRoute() {
  const pathname = usePathname();
  const router = useRouter();

  const pathSegments = pathname.split("/").filter(Boolean);

  const breadcrumbItems = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/");
    const isLast = index === pathSegments.length - 1;

    return {
      title: formatSegment(segment),
      onClick: !isLast ? () => router.push(href) : undefined,
      style: { cursor: !isLast ? "pointer" : "default" },
    };
  });

  return <Breadcrumb items={breadcrumbItems} style={{ marginBottom: 16 }} />;
}
