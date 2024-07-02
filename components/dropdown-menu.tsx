"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import ResuableTooltip from "./reusable/tooltip";
interface DropdownMenuProps {
  open: boolean;
  width: string;
  label: string;
  checkBox?: boolean;
  options: { label: string; onClick: () => void }[];
  statusUpdate?: (checkedFilters: string[]) => void; // Make statusUpdate optional

  // statusUpdate: { status: string[] }; // Define sta
}

const DropdownMenu = ({
  open,
  width,
  label,
  options,
  checkBox,
  statusUpdate,
}: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(open);
  const [optionLabel, setOptionLabel] = useState(label);
  const [isCheckBox, setIsCheckBox] = useState(checkBox);

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

  const [checkedStatuses, setCheckedStatuses] = useState<{
    [key: string]: boolean;
  }>(() => {
    // Initialize checkedStatuses based on options
    const initialState: { [key: string]: boolean } = {};
    options.forEach((option) => {
      initialState[option.label] = false; // Initialize all options with true initially
    });
    return initialState;
  });
  const [showClearButton, setShowClearButton] = useState(false);
  // const [checkedStatuses, setCheckedStatuses] = useState({});
  // const [filterStatusToParent, setFilterStatusToParent] = useState<string[]>(
  //   [],
  // );

  const handleCheckboxChange = (label: string) => {
    setCheckedStatuses((prevStatuses) => {
      // Toggle the checked state for the given label
      const updatedStatuses = {
        ...prevStatuses,
        [label]: !prevStatuses[label],
      };
      //update checkbox status
      const anyChecked = Object.values(updatedStatuses).some(
        (status) => status,
      );
      setShowClearButton(anyChecked);

      // Collect all checked options and send to the parent component for filtering
      const checkedFilters = Object.keys(updatedStatuses).filter(
        (key) => updatedStatuses[key],
      );
      // conditional since not all dropdown uses checkbox or statusUpdate
      if (statusUpdate) {
        statusUpdate(checkedFilters);
        // const newLabel =
        //   checkedFilters.length > 0 ? checkedFilters.join(", ") : "Status";
        const newLabel = checkedFilters.length > 0 ? `${checkedFilters.length} Status Selected` : "Status";

        setOptionLabel(newLabel);
      }
      console.log(checkedFilters, "child to parent");
      // setFilterStatusToParent(checkedFilters);
      // statusUpdate(checkedFilters); // Send the checked filters to the parent component
      return updatedStatuses;
    });
  };

  const clearCheckedStatuses = () => {
    setCheckedStatuses((prevStatuses) => {
      // Toggle the checked state for the given label
      const updatedStatuses = Object.keys(prevStatuses).reduce(
        (acc, key) => {
          acc[key] = false;
          return acc;
        },
        {} as { [key: string]: boolean },
      );

      // Collect all checked options and send to the parent component for filtering
      const checkedFilters = Object.keys(updatedStatuses).filter(
        (key) => updatedStatuses[key],
      );
      if (statusUpdate) {
        statusUpdate(checkedFilters);
        setOptionLabel("Status");
      }
      console.log(checkedFilters, "child to parent");
      // setFilterStatusToParent(checkedFilters);
      // Update the visibility of the "Clear" button

      return updatedStatuses;
    });
    setShowClearButton(false);
  };

  return (
    <div className={`w-full max-w-[166px] w-${width} `} ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex h-[47px] items-center justify-between rounded-[5px] bg-white  text-[15px] font-bold text-[#191D23] ${!isCheckBox ? "w-full text-opacity-60 shadow-sm" : "uppercase text-[#64748B]"}`}
      >
        {optionLabel}
        <Image
          src={"/icons/dropdown.svg"}
          width={18}
          height={18}
          alt="dropdown"
          className={`h-[7px] w-[8px] transition duration-300 ${!isCheckBox ? "" : "ml-2"} ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && !isCheckBox ? (
        <div className="absolute mt-2 flex w-[165px] cursor-pointer flex-col rounded-md bg-white p-4 text-[15px] shadow-xl">
          {options.map((option, index) => (
            <div
              key={index}
              className="flex flex-row gap-2"
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
              <p className="font-semibold hover:text-[#007C85]">
                {option.label}
              </p>
            </div>
          ))}
        </div>
      ) : (
        isOpen && (
          <div className="absolute -mt-2 flex w-[165px] cursor-pointer flex-col rounded-md bg-white px-4 pt-4 pb-2  normal-case text-[#020817] drop-shadow-md shadow-xl">
            {options.map((option, index) => (
              <div key={index} className="flex flex-row gap-2">
                <label className="flex items-center  mb-1 ">
                  <input
                    type="checkbox"
                    checked={checkedStatuses[option.label]} // Bind to checked status from state
                    onChange={() => handleCheckboxChange(option.label)}
                    className="h-3 w-3 rounded  border-gray-300 bg-gray-100 accent-[#007C85] focus:ring-[#007C85]"
                  />
                  <p className="ml-3 font-semibold  text-[15px] hover:text-[#007C85]">
                    {option.label}
                  </p>
                </label>
              </div>
            ))}
            {showClearButton && (
              <p
                className="flex justify-end font-semibold text-[12px] hover:text-[#007C85]"
                onClick={clearCheckedStatuses}
              >
                Clear
              </p>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default DropdownMenu;
