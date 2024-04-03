"use client";
import { onNavigate } from "@/actions/navigation";
import { getAccessToken } from "@/app/api/login-api/accessToken";
import TimeGraph from "@/components/timeGraph";
// import BigCalendar from "@/components/bigCalendar";
import { useRouter } from "next/navigation";

export default function AppointmentsPage() {
  const router = useRouter();
  if (!getAccessToken()) {
    onNavigate(router, "/login");
  }

  return (
    <div className="App w-full h-full pt-20">
      <div className="w-full h-full flex">
        <div className="w-1/4 sticky">{/* <BigCalendar /> */}</div>
        <p className=" h-full ring-1 ring-black mr-2 -mt-2"></p>
        <div className="w-full overflow-y-auto">
          {/* TimeGraph component */}
          <TimeGraph />
        </div>
      </div>
    </div>
  );
}
