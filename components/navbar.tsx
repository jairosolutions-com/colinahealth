"use client";

import { onNavigate } from "@/actions/navigation";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import NavBarDropdown from "./shared/navbardropdown";
import { getAccessToken } from "@/app/api/login-api/accessToken";
import Link from "next/link";
import { searchPatientList } from "@/app/api/patients-api/patientList.api";

interface Tabs {
  label: string;
  url: string;
}

export const Navbar = ({
  setIsLoading,
}: {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const [isActive, setIsActive] = useState(false);
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  const [suggestionContainer, setSuggestionContainer] = useState(false);
  const [isAnimate, setIsAnimate] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [tabs, setTabs] = useState<Tabs[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [id, setId] = useState(selectedPatientId);
  const [filteredTabs, setFilteredTabs] = useState<Tabs[]>([]);

  const handleSearchChange = (e: { target: { value: any } }) => {
    const value = e.target.value;
    setSearchValue(value);
    const filteredTabs = tabsUrls.filter((tab) =>
      tab.label.toLowerCase().startsWith(value.toLowerCase())
    );
    setFilteredTabs(filteredTabs);
  };

  const handleTabClick = (url: string, isActive: boolean) => {
    setIsActive(isActive);
    router.replace(url);
  };

  const routes = [
    {
      label: "Dashboard",
      url: "/dashboard",
    },
    {
      label: "Due Medications",
      url: "/due-medications",
    },
    {
      label: "Patients List",
      url: "/patient-list",
    },
    {
      label: "Appointments",
      url: "/appointments",
    },
    {
      label: "Chart",
      url: "/chart",
    },
  ];

  const searchData = [
    {
      name: "Chesky Marga Chesky Marga Marga C. Palma Gil",
      patientId: "PTN-20234A41",
    },
    {
      name: "Daryl Lesiguez Estrada",
      patientId: "PTN-25613682",
    },
  ];

  // useEffect(() => {
  //   const newTabsUrls = [
  //     {
  //       label: "Medical History",
  //       url: `/patient-overview/${selectedPatientId}/medical-history/allergies`,
  //     },
  //     {
  //       label: "Medication Log",
  //       url: `/patient-overview/${selectedPatientId}/medication/scheduled`,
  //     },
  //     {
  //       label: "Prescription",
  //       url: `/patient-overview/${selectedPatientId}/prescription`,
  //     },
  //     {
  //       label: "Vital Signs",
  //       url: `/patient-overview/${selectedPatientId}/vital-signs`,
  //     },
  //     {
  //       label: "Laboratory Results",
  //       url: `/patient-overview/${selectedPatientId}/lab-results`,
  //     },
  //     {
  //       label: "Appointment",
  //       url: `/patient-overview/${selectedPatientId}/patient-appointment`,
  //     },
  //     {
  //       label: "Notes",
  //       url: `/patient-overview/${selectedPatientId}/notes/nurses-notes`,
  //     },
  //     {
  //       label: "Forms",
  //       url: `/patient-overview/${selectedPatientId}/forms`,
  //     },
  //   ];

  //   setTabs(newTabsUrls);
  // }, [selectedPatientId]);

  const onPatientClick = (patientId: string, url: string) => {
    setSelectedPatientId(patientId);
    const urlParts = url.split("/");
    const path = `/${urlParts[urlParts.length - 2]}/${
      urlParts[urlParts.length - 1]
    }`;
    router.push(`/patient-overview/${patientId}${path}`);
  };
  const tabsUrls = [
    {
      label: "Medical History",
      url: `/patient-overview/${selectedPatientId}/medical-history/allergies`,
    },
    {
      label: "Medication Log",
      url: `/patient-overview/${selectedPatientId}/medication/scheduled`,
    },
    {
      label: "Prescription",
      url: `/patient-overview/${selectedPatientId}/prescription`,
    },
    {
      label: "Vital Signs",
      url: `/patient-overview/${selectedPatientId}/vital-signs`,
    },
    {
      label: "Laboratory Results",
      url: `/patient-overview/${selectedPatientId}/lab-results`,
    },
    {
      label: "Appointment",
      url: `/patient-overview/${selectedPatientId}/patient-appointment`,
    },
    {
      label: "Notes",
      url: `/patient-overview/${selectedPatientId}/notes/nurses-notes`,
    },
    {
      label: "Forms",
      url: `/patient-overview/${selectedPatientId}/forms`,
    },
  ];

  const [OpenProfile, setOpenProfile] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLImageElement>(null);

  const handleMouseDownOutside = useCallback(
    (event: MouseEvent) => {
      if (
        dropdownOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !iconRef.current?.contains(event.target as Node)
      ) {
        console.log("Dropdown is being closed");
        setDropdownOpen(false);
      }
    },
    [dropdownOpen]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleMouseDownOutside);

    return () => {
      document.removeEventListener("mousedown", handleMouseDownOutside);
    };
  }, [handleMouseDownOutside]);

  const handleMouseDownOutsideSearch = useCallback(
    (event: MouseEvent) => {
      if (
        showGlobalSearch &&
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        console.log("Dropdown is being closed");
        setIsAnimate(false);
        setSearchValue("");
        setTimeout(() => {
          setShowGlobalSearch(false);
          setSuggestionContainer(false);
        }, 300);
      }
    },
    [showGlobalSearch]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleMouseDownOutsideSearch);

    return () => {
      document.removeEventListener("mousedown", handleMouseDownOutsideSearch);
    };
  }, [handleMouseDownOutsideSearch]);

  useEffect(() => {
    if (
      pathname === "/due-medications" ||
      pathname === "/patient-list" ||
      pathname === "/chart" ||
      pathname === "/appointments" ||
      pathname === "/dashboard"
    ) {
      setIsLoading(false);
    }
  }, [pathname]);

  const handleSearchClick = () => {
    setShowGlobalSearch(true);
    setIsAnimate(true);
  };

  return (
    <div className="fixed bg-[#007C85] w-full h-[70px] flex items-center justify-between px-[145px] z-10 font-medium text-[15px]">
      <Link href="/dashboard" shallow>
        <Image
          src={"/imgs/colina-logo.png"}
          alt={""}
          width={200}
          height={37}
          className="cursor-pointer"
          onClick={(event) => {
            if (pathname === "/dashboard") {
              event.preventDefault();
              setIsLoading(true);
              window.location.reload();
            }
          }}
        />
      </Link>
      <div className="flex gap-[30px] items-center">
        <div className="flex gap-[40px] items-end">
          {routes.map((route, index) => (
            <Link
              key={index}
              href={route.url}
              className={`cursor-pointer text-white relative `}
              onClick={() => {
                setIsLoading(true);
                if (pathname === route.url) {
                  window.location.reload();
                }
              }}
            >
              <p className="hover:text-gray-200">{route.label}</p>
              {pathname === route.url && !showGlobalSearch && (
                <p
                  className={`${"border-b-[3px] border-[#ffffff] w-full absolute bottom-[-20px]"}`}
                ></p>
              )}
            </Link>
          ))}
        </div>
        <div
          className="flex justify-center items-center"
          onClick={handleSearchClick}
          ref={searchRef}
        >
          <Image
            src="/icons/search-icon-white.svg"
            width={15}
            height={15}
            alt="search"
            className="cursor-pointer absolute"
          />
          {showGlobalSearch && (
            <>
              <div
                className={`bg-white flex items-center global-search h-[40px] rounded-lg shadow-md transition duration-300 relative
              ${isAnimate ? "animate " : "animate-close"}`}
              >
                <Image
                  src="/icons/search-icon.svg"
                  width={15}
                  height={15}
                  alt="search"
                  className="cursor-pointer absolute ml-2"
                />
                <input
                  type="text"
                  className="w-full h-full rounded-lg ml-7 appearance-none outline-none"
                  placeholder="Search..."
                  value={searchValue}
                  onChange={(e) => handleSearchChange(e)}
                />
              </div>
              {searchValue && (
                <div
                  className={`bg-white w-full h-[310px]  bottom-[-300px] global-search truncate p-[10px] rounded-sm shadow-md ${
                    isAnimate ? " " : "animate-close"
                  }`}
                >
                  <div className="h-full w-full overflow-y-scroll flex flex-col gap-[8px]">
                    {filteredTabs.map((tab, index) => (
                      <div className="flex flex-col gap-[8px]">
                        <p
                          className="bg-[#007C85] p-[10px] text-white font-bold"
                          key={index}
                        >
                          {tab.label}
                        </p>
                        {searchData.map((patient, index) => (
                          <p
                            onClick={() => {
                              onPatientClick(patient.patientId, tab.url);
                            }}
                            key={index}
                            data-uuid={patient.patientId}
                            className="bg-[#D9D9D933] p-[10px] flex justify-between"
                          >
                            <span>{patient.name}</span>
                            <span>{patient.patientId}</span>
                          </p>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <div className="flex gap-3 items-center mr-2">
          <Image
            src={"/imgs/drake.png"}
            alt={""}
            width={30}
            height={30}
            className="rounded-full"
          />
          <Image
            ref={iconRef}
            className={`cursor-pointer select-none ${
              dropdownOpen ? "rotate-180" : ""
            } duration-300 w-auto h-auto`}
            onClick={() => {
              console.log("Toggling dropdownOpen state");
              setDropdownOpen((prevValue) => !prevValue);
            }}
            src={"/svgs/arrow-down.svg"}
            alt={""}
            width={15}
            height={15}
          />
          {dropdownOpen && (
            <NavBarDropdown
              ref={menuRef as React.RefObject<HTMLInputElement>}
              dropDownOpen={dropdownOpen}
            />
          )}
        </div>
      </div>
    </div>
  );
};
