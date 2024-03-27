"use client";

import { onNavigate } from "@/actions/navigation";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import NavBarDropdown from "./shared/navbardropdown";
import { getAccessToken } from "@/app/api/login-api/accessToken";

export const Navbar = () => {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

 

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

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownOpen && !menuRef.current?.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <div
      className={`fixed bg-[#007C85] w-full h-[70px] flex items-center justify-between px-[105px] z-10 show`}
    >
      <Image
        src={"/imgs/colina-logo.png"}
        alt={""}
        width={200}
        height={37}
        onClick={() => onNavigate(router, "/dashboard")}
        className="cursor-pointer  w-auto h-auto max-w-[200px]"
      />
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
          <Image
            className="cursor-pointer select-none rounded-full w-full h-full max-w-[30px] "
            onClick={() => setDropdownOpen((prev) => !prev)}
            src={"/imgs/dennis.svg"}
            alt={""}
            width={30}
            height={30}
          />
          {dropdownOpen && (
            <NavBarDropdown
              ref={menuRef as React.RefObject<HTMLInputElement>}
              dropDownOpen={dropdownOpen}
            />
          )}

          <Image
            className={`cursor-pointer select-none ${
              dropdownOpen ? "rotate-180" : ""
            } duration-300 w-auto h-auto`}
            onClick={() => setDropdownOpen((prev) => !prev)}
            src={"/svgs/arrow-down.svg"}
            alt={""}
            width={15}
            height={15}
          />
        </div>
      </div>
    </div>
  );
};
