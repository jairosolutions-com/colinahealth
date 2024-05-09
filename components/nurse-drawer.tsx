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
import { Check, ChevronsUpDown } from "lucide-react";

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
import { useEffect, useState } from "react";
import { searchPatientList } from "@/app/api/patients-api/patientList.api";
import { useRouter } from "next/navigation";
const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];

const NurseDrawer = () => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [patientList, setPatientList] = useState([
    {
      uuid: "waw",
      lastName: "waw",
    },
  ]);
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await searchPatientList(
          "",
          1,
          "lastName",
          "ASC",
          router
        );

        // Update patient list
        setPatientList(response.data);
      } catch (error: any) {
        // setError(error.message);
        // console.log("error", error.message);
        // toast({
        //   variant: "destructive",
        //   title: "Uh oh! Something went wrong.",
        //   description: error.message,
        //   action: (
        //     <ToastAction
        //       altText="Try again"
        //       onClick={() => {
        //         window.location.reload();
        //       }}
        //     >
        //       Try again
        //     </ToastAction>
        //   ),
        // });
        console.log(error);
      }
    };

    fetchData();
  }, []);
  return (
    <>
      <Drawer>
        <DrawerTrigger>Nurse's Note</DrawerTrigger>
        <form action="">
          <DrawerContent className="px-[350px]">
            <DrawerHeader>
              <DrawerTitle className="ml-1">Nurse's Note</DrawerTitle>
              {/* <DrawerDescription>This action cannot be undone.</DrawerDescription> */}
            </DrawerHeader>
            <div className="w-1/2 px-[18px]">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between mb-5"
                  >
                    {value
                      ? frameworks.find(
                          (framework) => framework.value === value
                        )?.label
                      : "Select patient..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0  min-w-0">
                  <Command className="w-full">
                    <CommandInput placeholder="Search patient..." />
                    <CommandEmpty>No patient found.</CommandEmpty>
                    <CommandGroup>
                      <CommandList>
                        {frameworks.map((framework) => (
                          <CommandItem
                            key={framework.value}
                            value={framework.value}
                            onSelect={(currentValue) => {
                              setValue(
                                currentValue === value ? "" : currentValue
                              );
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                value === framework.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {framework.label}
                          </CommandItem>
                        ))}
                      </CommandList>
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 px-[17px]">
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
                    //   value={formData.subject}
                    //   onChange={handleChange}
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
                    rows={4}
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    placeholder="input notes"
                    style={{ resize: "none" }}
                    name="notes"
                    //   value={formData.notes}
                    //   onChange={handleTextChange}
                    required
                  />
                </div>
              </div>
            </div>
            <DrawerFooter>
              <Button>Submit</Button>
              <DrawerClose>
                <Button variant="outline" className="w-full">
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </form>
      </Drawer>
    </>
  );
};

export default NurseDrawer;
