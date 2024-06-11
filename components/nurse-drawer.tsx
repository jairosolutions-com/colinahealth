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
import { SuccessModal } from "./shared/success";

const NurseDrawer = () => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [patientId, setPatientId] = React.useState("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState("");
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [patientList, setPatientList] = useState([
    {
      uuid: "",
      lastName: "",
      firstName: "",
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

  const handleOnClose = () => {
    setFormData({
      subject: "",
      notes: "",
      type: "nn",
    });
    setPatientId("");
    setError("");
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log("sub");
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
      onSuccess();
      setOpen(false);
      setPatientId("");
    } catch (error: any) {
      console.log(error, "errrorr1");
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

  const onSuccess = () => {
    setIsSuccessOpen(true);
    setOpen(false);
  };

  return (
    <>
      {" "}
      <Drawer direction="right">
        <DrawerTrigger className="font-semibold">
          <div className="w-[195px] h-[52px] justify-center rounded-[5px] cursor-pointer hover:text-white border-[1.76px] p-2 border-[#D0D5DD] hover:bg-[#007C85] group hover:border-[#007C85] flex items-center text-[15px] font-bold gap-[4px]">
            <div className="group invert">
            <Image
              src="/icons/plus-icon-white.svg"
              alt="add"
              width={18}
              height={18}
              className="h-[18px] w-[18px] group-hover:invert"
            />
            </div>
            Nurse's Note
          </div>
        </DrawerTrigger>
        <DrawerContent className="top-0 right-0 left-auto mt-0 w-[500px] rounded-none">
          <DrawerHeader className="bg-[#007C85] h-[71px]">
            <DrawerTitle className="text-white w-full flex justify-between items-center">
              <p className="ml-1 text-[20px] font-semibold">Nurse's Notes</p>
              <p>
                <DrawerClose>
                  <X onClick={handleOnClose} />
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
                <h1 className="text-md font-medium text-[20px] leading-6   mb-2">
                  Patient
                </h1>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className={`${
                        error && "error"
                      } w-full justify-between mb-5 h-12 rounded-[3px] sub-title`}
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
                        : "Select patient........."}
                      <Image
                        src={
                          error
                            ? "/icons/arrow-down-red.svg"
                            : "/icons/arrow-down-gray-nn.svg"
                        }
                        width={15}
                        height={15}
                        alt="arrow-down"
                        className={`${
                          open ? "rotate-180" : ""
                        } ml-2 w-[8px] h-[5px] shrink-0 opacity-50 transition duration-300`}
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
                              {patient.firstName} {patient.lastName}
                            </CommandItem>
                          ))}
                        </CommandList>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 px-[20px]">
                <div className="flex flex-col gap-1">
                  <h1 className=" font-medium text-[20px]">
                    Add Note and Compose
                  </h1>
                  <p className="sub-title">Submit your log details.</p>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="company"
                    className="block text-md leading-6 font-medium text-[20px] required-field"
                  >
                    Subject
                  </label>
                  <div className="mt-2.5">
                    <input
                      type="text"
                      className="block w-full h-12 rounded-[3px] px-3.5 py-2 border-[1px] border-[#D0D5DD]  placeholder:text-[#64748B] placeholder:text-[15px] text-[15px] sm:text-sm sm:leading-6"
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
                    className="block text-md leading-6 font-medium text-[20px] required-field"
                  >
                    Notes
                  </label>
                  <div className="mt-2.5">
                    <textarea
                      ref={ref}
                      className="resize-y block w-full rounded-[3px] max-h-[400px] h-[150px] min-h-[50px] border-[1px] border-[#D0D5DD] px-3.5 py-2 placeholder:text-[#64748B] placeholder:text-[15px] text-[15px]  sm:text-sm sm:leading-6"
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
                <button
                  type="button"
                  disabled={isSubmitted}
                  onClick={handleOnClose}
                  className={` cancel-button
                  ${isSubmitted && " cursor-not-allowed"}
                  w-[150px] h-[45px]  bg-[#F3F3F3] hover:bg-[#D9D9D9] font-medium  mr-4 rounded-sm`}
                >
                  Cancel
                </button>
              </DrawerClose>
              <button
                disabled={isSubmitted}
                type="submit"
                className={`
                ${isSubmitted && " cursor-not-allowed"}
                       w-[150px] h-[45px] px-3 py-2 bg-[#007C85] hover:bg-[#03595B]  text-[#ffff] font-medium  rounded-sm`}
              >
                Submit
              </button>
            </DrawerFooter>
          </form>
        </DrawerContent>
        {isSuccessOpen && (
          <DrawerClose>
            <SuccessModal
              label="Success"
              isAlertOpen={isSuccessOpen}
              toggleModal={setIsSuccessOpen}
              isUpdated={""}
              setIsUpdated={""}
            />
          </DrawerClose>
        )}
      </Drawer>
    </>
  );
};

export default NurseDrawer;
