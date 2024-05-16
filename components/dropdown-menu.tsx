'use client'
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
interface DropdownMenuProps {
  open: boolean;
  width: string;
  label: string;
  options: { label: string; onClick: () => void }[];
}

const DropdownMenu = ({ open, width, label, options }: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(open);
  const [optionLabel, setOptionLabel] = useState(label);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleOptionClick = (onClick: () => void) => {
    onClick(); // Execute the onClick function of the option
    setIsOpen(false); // Close the dropdown after the option is clicked
  };

  return (
    <div className={` w-full max-w-[165px] w-${width} `} ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white w-full h-[47px] rounded-[5px] px-[20px] items-center flex justify-between font-bold text-[15px] text-[#191D23] text-opacity-60 shadow-sm"
      >
        {optionLabel}
        <ChevronDown width={18} height={18} />
      </button>

      {isOpen && (
        <div className=" bg-white w-[165px] flex flex-col absolute mt-2 rounded-md p-4 shadow-xl cursor-pointer text-[15px]">
          {options.map((option, index) => (
            <div
              key={index}
              className="flex flex-row gap-2 "
              onClick={() => {
                handleOptionClick(option.onClick);
                setOptionLabel(option.label);
              }}
            >
              {option.label === "Ascending" || option.label === "Descending" ? (
                <Image
                  width={20}
                  height={20}
                  className=""
                  src={`/icons/${
                    option.label === "Ascending" ? "orderByAsc.svg" : ""
                  }${option.label === "Descending" ? "orderByDesc.svg" : ""}`}
                  alt="orderBy"
                />
              ) : (
                <div></div>
              )}
              <p className="hover:text-[#007C85] font-semibold" key={index}>
                {option.label}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
