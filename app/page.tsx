"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getAccessToken } from "./api/login-api/accessToken";
import { onNavigate } from "@/actions/navigation";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    if (getAccessToken()) {
      onNavigate(router, "/dashboard");
    } else {
      router.replace("login");
    }
  }, []);

  return null;
}