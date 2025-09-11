import { redirect } from "next/navigation";
import { Routes } from "@/types/routes";

export default function Home() {
  redirect(Routes.LOGIN);
}
