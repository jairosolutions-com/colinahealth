"use client";
import Link from "next/link";
import React, { useState } from "react";
import { IoNotifications } from "react-icons/io5";
import Image from "next/image";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="app-page flex-column flex-column-fluid bg-[#007C85]">
      <div id="kt_app_header" className="app-header">
        <div className="bg-[#007C85] flex justify-between items-center w-full ml-5">
          <div className="flex align-items-center">
            <div
              onClick={() => setIsOpen(!isOpen)}
              className="mr-[50px] relative"
            >
              <div className="symbol symbol-40px symbol-md-40px btn btn-flex align-items-center bg-hover-white bg-hover-opacity-10 py-1 ps-1 pe-1 mr-3">
                asdasd
              </div>

              {isOpen && (
                <div className="bg-body shadow-sm rounded-md text-black w-[190px] h-[170px] absolute bottom-[-183px] right-0 z-50 flex flex-col py-4">
                  <div className="flex px-3 items-center"></div>
                  <div className="separator my-1"></div>
                  <div className="font-normal text-[16px]">
                    <div className="px-3 py-1 hover:bg-[#007C85] hover:opacity-60 hover:rounded-md hover:text-white text-black">
                      Ascending
                    </div>
                    <div className="px-3 py-1 hover:bg-[#007C85] hover:opacity-60 hover:rounded-md hover:text-white">
                      Decending
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
