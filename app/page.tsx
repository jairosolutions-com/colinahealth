"use client";

import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";
import { getAccessToken } from "./api/login-api/accessToken";
import { onNavigate } from "@/actions/navigation";

export default function Home() {
  useEffect(() => {
    if (getAccessToken()) {
      redirect("/dashboard");
    } else {
      redirect("login");
    }
  }, []);

  return null;
}
