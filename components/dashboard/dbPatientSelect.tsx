"use client";
import React, { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import Image from "next/image";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { selectPatient } from "@/app/api/patients-api/patientSelect.api";
interface DBPatientSelectProps {
  patientId: string;
  setPatientId: (patientId: string) => void;
}
const DBPatientSelect = ({patientId,setPatientId}:DBPatientSelectProps) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
 
  const [isSubmitted, setIsSubmitted] = useState<boolean>(true);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState("");
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [patientList, setPatientList] = useState([
    {
      uuid: "",
      firstName: "",
      lastName: "",
    },
  ]);

  const [formData, setFormData] = useState({
    subject: "",
    notes: "",
    type: "nn",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await selectPatient(router);
        setPatientList(response.data);
      } catch (error: any) {
        console.log(error);
      }
    };

    fetchData();
  }, []);
  

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={`${
              error ? "text-[#DB3956] border-[#DB3956]": "sub-title"
            } w-full justify-between mb-5 h-12 rounded-md shadow-sm`}
          >
            {patientId
              ? patientList.find(
                  (patientList) => patientList.uuid === patientId
                )?.lastName
                ? `${
                    patientList.find(
                      (patientList) => patientList.uuid === patientId
                    )?.firstName
                  } ${
                    patientList.find(
                      (patientList) => patientList.uuid === patientId
                    )?.lastName
                  }`
                : patientList.find(
                    (patientList) => patientList.uuid === patientId
                  )?.lastName
              : "Select patient"}
            <Image
              src={
                error
                  ? "/icons/arrow-down-red.svg"
                  : "/icons/arrow-down-gray.svg"
              }
              width={15}
              height={15}
              alt="arrow-down"
              className={`${
                open ? "rotate-180" : ""
              } ml-2 h-4 w-4 shrink-0 opacity-50 transition duration-300`}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[522px] p-0 overflow-y-auto">
          <Command
            className="w-full"
            onClick={() => {
              setError("");
            }}
          >
            <CommandInput placeholder="Search patient..." />
            <CommandEmpty>No patient found.</CommandEmpty>
            <CommandGroup>
              <CommandList className=" z-[9999] ">
                {patientList.map((patient) => (
                  <CommandItem
                    key={patient.uuid}
                    onSelect={(currentUuid) => {
                      setPatientId(
                        patient.uuid === patientId ? "" : patient.uuid
                      );
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        patientId === patient.uuid ? "opacity-100" : "opacity-0"
                      )}
                    />
                     {patient.firstName} {patient.lastName}
                  </CommandItem>
                ))}
              </CommandList>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DBPatientSelect;
