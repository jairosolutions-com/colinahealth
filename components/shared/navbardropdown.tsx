"use client";
import { onNavigate } from "@/actions/navigation";
import { setAccessToken } from "@/app/api/login-api/accessToken";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

interface NavBarDropdownProps {
  ref: React.RefObject<HTMLInputElement>;
}

const NavBarDropdown: React.FC<NavBarDropdownProps> = ({ ref }) => {
    const router = useRouter()
  return (
    <div ref={ref} className="transition ease-in flex flex-col dropdowncss shadow-lg select-none">
      <ul className="flex flex-col">
        <li className="flex">
          <div className="flex flex-col">
            <h1 className="pl-3 font-bold ">ADMIN</h1>
            <div className="pl-3">alexdramos@gmail.com</div>
          </div>
        </li>
        <hr className="my-3" />
        <li className=" rounded-[5px] hover:text-[#83C5CA] cursor-pointer pl-2 mb-4">
          Language
        </li>
        <li className=" rounded-[5px] hover:text-[#83C5CA] cursor-pointer pl-2 mb-4">
          Acount Settings
        </li>
        <li className=" rounded-[5px] hover:text-[#83C5CA] cursor-pointer pl-2 mb-4"
        onClick={()=>{setAccessToken(''); onNavigate(router, '/login')}}>
          Sign Out
        </li>
      </ul>
    </div>
  );
};

export default NavBarDropdown;
