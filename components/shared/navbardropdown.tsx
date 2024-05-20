"use client";
import { onNavigate } from "@/actions/navigation";
import { getUserDetail, setAccessToken } from "@/app/api/login-api/accessToken";
import { useRouter } from "next/navigation";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import { TabbleSettingsModal } from "@/components/modal-content/tablesetting-modal-content";
import Modal from "../reusable/modal";
interface NavBarDropdownProps {
  dropDownOpen: boolean;
  ref: React.RefObject<HTMLInputElement>;
}

interface UserDetail {
  fName?: string;
  lName?: string;
  uuid?: string;
}
const NavBarDropdown = forwardRef<HTMLDivElement, NavBarDropdownProps>(
  (props, ref) => {
    const router = useRouter();
    const userDetail: UserDetail = getUserDetail();
    console.log(userDetail, "userDetail");
    const { dropDownOpen } = props;
    console.log(dropDownOpen, "dropdownopen");
    const [isOpen, setIsOpen] = useState(false);
    const isModalOpen = (isOpen: boolean) => {
      setIsOpen(isOpen);
      if (isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "visible";
      }
    };

    return (
      <div
        ref={ref}
        className={`${
          dropDownOpen ? "opacity-100 visible" : "opacity-0 invisible"
        } transition ease-in duration-300 flex flex-col dropdowncss shadow-lg select-none z-[9999] 
    `}
      >
        <ul className="flex flex-col z-50">
          <li className="flex">
            <div className="flex flex-col">
              <h1 className="pl-3 font-bold ">ADMIN</h1>
              <div className="pl-3">
                {userDetail.fName} {userDetail.lName}
              </div>
            </div>
          </li>
          <hr className="my-3" />

          <li
            onClick={() => isModalOpen(true)}
            className=" rounded-[5px] hover:text-[#83C5CA] cursor-pointer pl-2 mb-4"
          >
            Settings
          </li>
          <li
            className=" rounded-[5px] hover:text-[#83C5CA] cursor-pointer pl-2 mb-4"
            onClick={() => {
              setAccessToken("");
              router.replace("/login");
            }}
          >
            Sign Out
          </li>
        </ul>
        {isOpen && (
          <Modal
            content={<TabbleSettingsModal isModalOpen={isModalOpen} />}
            isModalOpen={isModalOpen}
          />
        )}
      </div>
    );
  }
);

export default NavBarDropdown;
