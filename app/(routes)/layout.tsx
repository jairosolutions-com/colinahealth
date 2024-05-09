"use client";
import Image from "next/image";

import { Navbar } from "@/components/navbar";
import { getAccessToken, setAccessToken } from "../api/login-api/accessToken";
import { redirect, useRouter } from "next/navigation";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect, useState } from "react";
import Footer from "@/components/footer";
import { useIdleTimer } from "react-idle-timer";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    if (!getAccessToken()) {
      redirect("/login");
    }
  }, []);
  const [isLoading, setIsLoading] = useState(false);

  const [timeout, setTimeout] = useState(5000 * 60); // 5 minute
  const [lastActive, setLastActive] = useState(Date.now());
  const { getRemainingTime, isIdle } = useIdleTimer({
    timeout,
    onIdle: () => {
      // Log out the user
      setAccessToken("");
      router.push("/login");
    },
    onActive: () => {
      setLastActive(Date.now());
    },
    debounce: 500,
  });

  useEffect(() => {
    const handleMouseMove = () => {
      setLastActive(Date.now());
    };
    const handleKeyPress = () => {
      setLastActive(Date.now());
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("keypress", handleKeyPress);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, []);

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
