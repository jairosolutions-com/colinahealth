"use client";
import { Navbar } from "@/components/navbar";
import { getAccessToken } from "../api/login-api/accessToken";
import { useRouter } from "next/navigation";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";
import Footer from "@/components/footer";
import Image from "next/image";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <div className="h-screen flex flex-col justify-between">
        <Navbar setIsLoading={setIsLoading} />
        <>
          {isLoading ? (
            <div className="w-full h-full flex justify-center items-center">
              <Image
                // className="w-[100px] h-[100px]"
                src="/imgs/colina-logo-animation.gif"
                alt="logo"
                width={100}
                height={100}
              />
            </div>
          ) : (
            <div className="w-full h-full flex">{children}</div>
          )}
        </>
        <Footer />
      </div>
    </>
  );
}
