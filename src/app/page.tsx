"use client";

import { Routes } from "@/types/routes";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push(Routes.LOGIN);
  }, [router]);

  return (
    <div>
      <p>Home</p>
    </div>
  );
}
