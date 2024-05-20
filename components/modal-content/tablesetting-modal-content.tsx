"use client";
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Account } from "@/components/settings/account";
import { Vitalsign } from "@/components/settings/vitalsign";
import { Labresult } from "../settings/labresult";

interface Modalprops {
  isModalOpen: (isOpen: boolean) => void;
}

export const TabbleSettingsModal = ({ isModalOpen }: Modalprops) => {
  const [isVitalSign, setVitalSign] = useState(false);
  const [isLabResult, setLabResult] = useState(false);
  const OnTabClick = (isClick: string) => {
    if (isClick === "Vital Sign") {
      setVitalSign(true);
      setLabResult(false);
    } else if (isClick === "Lab Result") {
      setLabResult(true);
      setVitalSign(false);
    }
  };
  return (
    <div className="w-[1200px] h-[641px]">
      <div className="flex justify-between h-[48px] bg-[#D9D9D94D] border-b items-center">
        <div className="flex gap-2 items-center pl-10">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20.1 9.21945C18.29 9.21945 17.55 7.93945 18.45 6.36945C18.97 5.45945 18.66 4.29945 17.75 3.77945L16.02 2.78945C15.23 2.31945 14.21 2.59945 13.74 3.38945L13.63 3.57945C12.73 5.14945 11.25 5.14945 10.34 3.57945L10.23 3.38945C9.78 2.59945 8.76 2.31945 7.97 2.78945L6.24 3.77945C5.33 4.29945 5.02 5.46945 5.54 6.37945C6.45 7.93945 5.71 9.21945 3.9 9.21945C2.86 9.21945 2 10.0694 2 11.1194V12.8794C2 13.9194 2.85 14.7794 3.9 14.7794C5.71 14.7794 6.45 16.0594 5.54 17.6294C5.02 18.5394 5.33 19.6994 6.24 20.2194L7.97 21.2094C8.76 21.6794 9.78 21.3995 10.25 20.6094L10.36 20.4194C11.26 18.8494 12.74 18.8494 13.65 20.4194L13.76 20.6094C14.23 21.3995 15.25 21.6794 16.04 21.2094L17.77 20.2194C18.68 19.6994 18.99 18.5294 18.47 17.6294C17.56 16.0594 18.3 14.7794 20.11 14.7794C21.15 14.7794 22.01 13.9294 22.01 12.8794V11.1194C22 10.0794 21.15 9.21945 20.1 9.21945ZM12 15.2494C10.21 15.2494 8.75 13.7894 8.75 11.9994C8.75 10.2094 10.21 8.74945 12 8.74945C13.79 8.74945 15.25 10.2094 15.25 11.9994C15.25 13.7894 13.79 15.2494 12 15.2494Z"
              fill="#171717"
            />
          </svg>
          <p className="font-semibold">Settings</p>
        </div>
        <div>
          <X
            onClick={() => isModalOpen(false)}
            className="w-5 h-5 cursor-pointer mr-5 text-black flex hover:text-red-600"
          />
        </div>
      </div>
      <div className="flex h-[593px] w-full">
        {/* SideNav */}
        <div className="w-[350px] pl-5 flex flex-col bg-[#D9D9D94D] h-[595px] rounded-">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <div className="flex gap-2 items-center">
                  <span>
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                        fill="#171717"
                      />
                      <path
                        d="M12.0002 14.5C6.99016 14.5 2.91016 17.86 2.91016 22C2.91016 22.28 3.13016 22.5 3.41016 22.5H20.5902C20.8702 22.5 21.0902 22.28 21.0902 22C21.0902 17.86 17.0102 14.5 12.0002 14.5Z"
                        fill="#171717"
                      />
                    </svg>
                  </span>
                  <span className="font-semibold">Account</span>
                </div>
              </AccordionTrigger>
            </AccordionItem>
          </Accordion>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <div className="flex gap-2 items-center">
                  <span>
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M14.3498 2H9.64977C8.60977 2 7.75977 2.84 7.75977 3.88V4.82C7.75977 5.86 8.59977 6.7 9.63977 6.7H14.3498C15.3898 6.7 16.2298 5.86 16.2298 4.82V3.88C16.2398 2.84 15.3898 2 14.3498 2Z"
                        fill="#171717"
                      />
                      <path
                        d="M17.2391 4.81949C17.2391 6.40949 15.9391 7.70949 14.3491 7.70949H9.64906C8.05906 7.70949 6.75906 6.40949 6.75906 4.81949C6.75906 4.25949 6.15906 3.90949 5.65906 4.16949C4.24906 4.91949 3.28906 6.40949 3.28906 8.11949V17.5295C3.28906 19.9895 5.29906 21.9995 7.75906 21.9995H16.2391C18.6991 21.9995 20.7091 19.9895 20.7091 17.5295V8.11949C20.7091 6.40949 19.7491 4.91949 18.3391 4.16949C17.8391 3.90949 17.2391 4.25949 17.2391 4.81949ZM12.3791 16.9495H7.99906C7.58906 16.9495 7.24906 16.6095 7.24906 16.1995C7.24906 15.7895 7.58906 15.4495 7.99906 15.4495H12.3791C12.7891 15.4495 13.1291 15.7895 13.1291 16.1995C13.1291 16.6095 12.7891 16.9495 12.3791 16.9495ZM14.9991 12.9495H7.99906C7.58906 12.9495 7.24906 12.6095 7.24906 12.1995C7.24906 11.7895 7.58906 11.4495 7.99906 11.4495H14.9991C15.4091 11.4495 15.7491 11.7895 15.7491 12.1995C15.7491 12.6095 15.4091 12.9495 14.9991 12.9495Z"
                        fill="#171717"
                      />
                    </svg>
                  </span>
                  <span>Table</span>
                </div>
              </AccordionTrigger>
              <AccordionContent onClick={() => OnTabClick("Vital Sign")}>
                Vital Sign
              </AccordionContent>
              <AccordionContent onClick={() => OnTabClick("Lab Result")}>
                Lab Result
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        {/* SideNav */}

        <div className="w-full h-full rounded-br-lg ">
          {isVitalSign && <Vitalsign />}
          {isLabResult && <Labresult />}
        </div>
      </div>
    </div>
  );
};
