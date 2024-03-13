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
    <div className="fixed bg-[#007C85] w-full h-[70px] flex items-center justify-between px-[105px]">
      <Image src={"/imgs/colina-logo.png"} alt={""} width={200} height={37} />
      <div className="flex gap-[20px] items-center">
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
        <div className="flex gap-3 items-center">
          <Image src={"/imgs/admin 1.png"} alt={""} width={30} height={30} />
          <Image src={"/svgs/arrow-down.svg"} alt={""} width={15} height={15} />
        </div>
      </div>
    </div>
  );
};
