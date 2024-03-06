"use client";

import { onNavigate } from "@/actions/navigation";
import { FaUser, FaBell } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";

export const Navbar = () => {
  const router = useRouter();

  const routes = [
    {
      label: "Patients List",
      url: "/patient-list",
    },
    {
      label: "Appointments",
      url: "/appointments",
    },
  ];

  return (
    <div className="fixed bg-[#007C85] w-full flex items-center justify-between px-[100px] py-[10px]">
      <Image src={"/imgs/colina-logo.png"} alt={""} width={320} height={57} />
      <div className="flex gap-[100px]">
        <div className="flex gap-[20px]">
          {routes.map((route, index) => (
            <p
              className="cursor-pointer text-white"
              onClick={() => onNavigate(router, route.url)}
              key={index}
            >
              {route.label}
            </p>
          ))}
        </div>
        <div className="flex gap-[20px]">
          <FaBell className="text-white w-[20px] h-[20px]" />
          <FaUser className="text-white w-[20px] h-[20px]" />
        </div>
      </div>
    </div>
  );
};
