"use client";

import { Routes } from "@/types/routes";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  router.push(Routes.LOGIN);
  return (
    <div>
      <p>Home</p>
    </div>
  );
}
