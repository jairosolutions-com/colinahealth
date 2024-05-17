"use client";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "./ui/button";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useRef, useState } from "react";
import { searchPatientList } from "@/app/api/patients-api/patientList.api";
import { useRouter } from "next/navigation";

import Image from "next/image";
import { createNotesOfPatient } from "@/app/api/notes-api/notes-api";
import { toast } from "./ui/use-toast";
import { ToastAction } from "./ui/toast";
import { selectPatient } from "@/app/api/patients-api/patientSelect.api";

const NurseDrawer = ({ setIsSuccessOpen }: any) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [patientId, setPatientId] = React.useState("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState("");
  const [patientList, setPatientList] = useState([
    {
      uuid: "",
      lastName: "",
      firstName: "",
      values: "",
    },
  ]);

  const [formData, setFormData] = useState({
    subject: "",
    notes: "",
    type: "nn",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log("sub");
    if (patientId) {
      setIsSubmitted(true);
      try {
        const notes = await createNotesOfPatient(patientId, formData, router);
        if (notes) {
          setIsSuccess(true);
          console.log(isSuccess, "issuccess");
        }

        setFormData({
          subject: "",
          notes: "",
          type: "nn",
        });
        setIsSuccessOpen(true);
        setOpen(false);
        setPatientId("");
      } catch (error: any) {
        if (error.message == "Network Error") {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: error.message,
            action: (
              <ToastAction
                altText="Try again"
                onClick={() => {
                  window.location.reload();
                }}
              >
                Try again
              </ToastAction>
            ),
          });
        }
        console.error("Error adding note:", error);
        setError("Failed to add note");
      }
    } else {
      setError("no patient id");
    }
    setIsSubmitted(false);
  };

  console.log(error, "errrrorr");

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

  const ref = useRef<HTMLTextAreaElement>(null);
  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = `${e.currentTarget.scrollHeight}px`;
    }
  };
  console.log(formData, "formData");
  console.log(isSuccess, "isSUccess");

  useEffect(() => {
    if (isSuccess) {
      const cancelButton = document.querySelector(
        ".cancel-button"
      ) as HTMLButtonElement;
      const clickEvent = new MouseEvent("click", { bubbles: true });
      cancelButton.dispatchEvent(clickEvent);
      setIsSuccess(false);
    }
  }, [isSuccess]);

  return (
    <>
      {" "}
      <Drawer direction="right">
        <DrawerTrigger className="font-semibold">
          <div className="w-[180px] justify-center rounded-sm cursor-pointer  border-[1px] p-2 border-[#D0D5DD] flex">
            <Image
              src="/icons/plus-icon.svg"
              alt="add"
              width={15}
              height={15}
            />
            Nurse's Note
          </div>
        </DrawerTrigger>
        <DrawerContent className="top-0 right-0 left-auto mt-0 w-[500px] rounded-none">
          <DrawerHeader className="bg-[#007C85]">
            <DrawerTitle className="text-white w-full flex justify-between items-center">
              <p className="ml-1">Nurse's Notes</p>
              <p>
                <DrawerClose>
                  <X />
                </DrawerClose>
              </p>
            </DrawerTitle>
          </DrawerHeader>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col h-full justify-between"
          >
            <div className="w-full h-full">
              <div className="w-full px-[20px] mt-3">
                <h1 className="text-md font-bold leading-6 text-gray-900 mb-2">
                  PATIENT
                </h1>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between mb-5 h-12 rounded-md shadow-sm"
                    >
                      {patientId
                        ? patientList.find(
                            (patientList) => patientList.uuid === patientId
                          )?.lastName
                          ? `${
                              patientList.find(
                                (patientList) => patientList.uuid === patientId
                              )?.lastName
                            }, ${
                              patientList.find(
                                (patientList) => patientList.uuid === patientId
                              )?.firstName
                            }`
                          : patientList.find(
                              (patientList) => patientList.uuid === patientId
                            )?.lastName
                        : "Select patient..."}
                      <Image
                        src="/icons/arrow-down-gray.svg"
                        width={15}
                        height={15}
                        alt="arrow-down"
                        className={`${
                          open ? "rotate-180" : ""
                        } ml-2 h-4 w-4 shrink-0 opacity-50 transition duration-300`}
                      />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[458px] p-0 overflow-y-auto">
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
                                  patientId === patient.uuid
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {patient.lastName}, {patient.firstName}
                            </CommandItem>
                          ))}
                        </CommandList>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                {error && (
                  <p className="-mt-3 text-red-500 text-sm  mb-1">
                    Select a patient!
                  </p>
                )}
              </div>
              <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 px-[20px]">
                <div className="flex flex-col gap-1">
                  <h1 className="font-semibold text-lg">
                    Add Note and Compose
                  </h1>
                  <p className="text-sm text-[#667085]">
                    Submit your log details.
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="company"
                    className="block text-md font-bold leading-6 text-gray-900 required-field"
                  >
                    SUBJECT
                  </label>
                  <div className="mt-2.5">
                    <input
                      type="text"
                      className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      placeholder="input subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="message"
                    className="block text-md font-bold leading-6 text-gray-900 required-field"
                  >
                    NOTES
                  </label>
                  <div className="mt-2.5">
                    <textarea
                      ref={ref}
                      className="resize-y block w-full rounded-md max-h-[400px] h-[150px] min-h-[50px] border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      placeholder="input notes"
                      onInput={handleInput}
                      name="notes"
                      value={formData.notes}
                      onChange={handleTextChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <DrawerFooter className="flex flex-row justify-end gap-1 mb-2">
              <DrawerClose>
                <Button
                  type="button"
                  disabled={isSubmitted}
                  variant="outline"
                  className={` cancel-button
                  ${isSubmitted && " cursor-not-allowed"}
                  w-[150px] h-[45px]  bg-[#F3F3F3] hover:bg-[#D9D9D9] font-medium text-black  mr-4 rounded-sm`}
                >
                  Cancel
                </Button>
              </DrawerClose>
              <Button
                disabled={isSubmitted}
                type="submit"
                className={`
                ${isSubmitted && " cursor-not-allowed"}
                       w-[150px] h-[45px] px-3 py-2 bg-[#007C85] hover:bg-[#03595B]  text-[#ffff] font-medium  rounded-sm`}
              >
                Submit
              </Button>
            </DrawerFooter>
          </form>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default NurseDrawer;
