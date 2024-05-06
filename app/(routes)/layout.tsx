"use client";
import Image from "next/image";

import { Navbar } from "@/components/navbar";
import { getAccessToken } from "../api/login-api/accessToken";
import { redirect, useRouter } from "next/navigation";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect, useState } from "react";
import Footer from "@/components/footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!getAccessToken()) {
      redirect("/login");
    }
  }, []);
  const [isLoading, setIsLoading] = useState(false);
  return (
    <>
      <div className="flex flex-col h-screen">
        <Navbar setIsLoading={setIsLoading} />
        {isLoading ? (
          <div className="w-full h-full flex justify-center items-center ">
            <Image
              src="/imgs/colina-logo-animation.gif"
              alt="logo"
              width={100}
              height={100}
            />
          </div>
        ) : (
          <div className="flex-grow">{children}</div>
        )}
        <Footer />
      </div>
    </>
  );
}
