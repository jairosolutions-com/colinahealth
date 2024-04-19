"use client";
import { onNavigate } from "@/actions/navigation";
import { getAccessToken } from "@/app/api/login-api/accessToken";
import { useRouter } from "next/navigation";

export default function AppointmentsPage() {
  const router = useRouter();
  if (!getAccessToken()) {
    onNavigate(router, "/login");
  }
  return (
    <div className="h-full w-full flex items-center justify-center">
      Appointments
    </div>
  );
}
