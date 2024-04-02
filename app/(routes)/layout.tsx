'use client'
import { Navbar } from "@/components/navbar";
import { getAccessToken } from "../api/login-api/accessToken";
import { useRouter } from "next/navigation";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  return (
    
    <>
      <Navbar />
      <div className="h-full w-full flex ">{children}</div>

    </>
  );
}
