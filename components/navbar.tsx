"use client";

import { onNavigate } from "@/actions/navigation";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import NavBarDropdown from "./shared/navbardropdown";
import { getAccessToken } from "@/app/api/login-api/accessToken";

export const Navbar = ({
  setIsLoading,
}: {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const [isActive, setIsActive] = useState(false);
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleTabClick = (url: string, isActive: boolean) => {
    setIsActive(isActive);
    router.push(url);
  };

  const routes = [
    {
      label: "Due Medications",
      url: "/due-medications",
    },
    {
      label: "Patients List",
      url: "/patient-list",
    },
    {
      label: "Appointments",
      url: "/appointments",
    },
    {
      label: "Chart",
      url: "/chart",
    },
  ];

  const [OpenProfile, setOpenProfile] = useState(false);

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

  useEffect(() => {
    if (
      pathname === "/due-medications" ||
      pathname === "/patient-list" ||
      pathname === "/chart" ||
      pathname === "/appointments" ||
      pathname === "/dashboard"
    ) {
      setIsLoading(false);
    }
  }, [pathname]);

  return (
    <div className="fixed bg-[#007C85] w-full h-[70px] flex items-center justify-between px-[145px] z-10 font-medium text-[15px]">
      <Image
        src={"/imgs/colina-logo.png"}
        alt={""}
        width={200}
        height={37}
        className="cursor-pointer"
        onClick={() => {
          setIsLoading(true);
          router.push("/dashboard");
        }}
      />
      <div className="flex gap-[30px] items-center">
        <div className="flex gap-[40px] items-end">
          {routes.map((route, index) => (
            <div
              className={`cursor-pointer text-white relative`}
              onClick={() => {
                setIsLoading(true);
                router.push(route.url);
              }}
              key={index}
            >
              <p className="hover:text-gray-200">{route.label}</p>
              {pathname === route.url && (
                <p
                  className={`${"border-b-[3px] border-[#ffffff] w-full absolute bottom-[-20px]"}`}
                ></p>
              )}

              {/* <span
                className={`${
                  pathname === route.url
                    ? "border-b-[3px] border-[#ffffff] "
                    : ""
                }`}
              ></span> */}
            </div>
          ))}
        </div>
        <div className="flex gap-3 items-center mr-2">
          <Image src={"/imgs/admin.svg"} alt={""} width={30} height={30} />
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
          {dropdownOpen && (
            <NavBarDropdown
              ref={menuRef as React.RefObject<HTMLInputElement>}
              dropDownOpen={dropdownOpen}
            />
          )}
        </div>
      </div>
    </div>
  );
};
