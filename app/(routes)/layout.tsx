"use client";
import { Navbar } from "@/components/navbar";
import { getAccessToken } from "../api/login-api/accessToken";
import { useRouter } from "next/navigation";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";
import Footer from "@/components/footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <div className="flex flex-col h-screen">
        <Navbar setIsLoading={setIsLoading} />
        {isLoading ? (
          <div className="w-full h-full flex justify-center items-center ">
            <img src="/imgs/colina-logo-animation.gif" alt="logo" width={100} />
          </div>
        ) : (
          <div className="flex-grow">{children}</div>
        )}
        <Footer />
      </div>
    </>
  );
}
