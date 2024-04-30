"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";

interface TableProps<T> {
  data: T[];
  columnLabels: string[];
  columns: string;
  rows: number;
  component: React.ReactNode;
  pageData: (data: T[]) => void;
}

export default function Table<T>({
  data,
  columnLabels,
  columns,
  component,
  pageData,
  rows,
}: TableProps<T>) {
  const ITEMS_PER_PAGE = rows;
  const [currentPage, setCurrentPage] = useState(1);
  const [inputPage, setInputPage] = useState("");
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const currentPageData = data.slice(startIndex, endIndex);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  const pagesToShow = [];

  if (totalPages <= 3) {
    for (let i = 1; i <= totalPages; i++) {
      pagesToShow.push(i);
    }
  } else if (currentPage <= 2) {
    pagesToShow.push(1, 2, 3);
  } else if (currentPage >= totalPages - 1) {
    pagesToShow.push(totalPages - 2, totalPages - 1, totalPages);
  } else {
    pagesToShow.push(currentPage - 1, currentPage, currentPage + 1);
  }

  const handleInputChange = (event: any) => {
    setInputPage(event.target.value);
  };

  const goToPage = () => {
    const pageNumber = parseInt(inputPage, 10);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setInputPage("");
    }
  };

  useEffect(() => {
    pageData(currentPageData);
  }, [currentPage]);

  return (
    <div>
      <div className="bg-[#F4F4F4] p-[15px] flex justify-between w-full">
        <div className="flex items-center gap-[10px] px-[15px] py-[10px] bg-white ring-[1px] ring-[#E7EAEE] rounded-[5px]">
          <Search width={20} height={20} />
          <input
            className="outline-none w-[573px] text-[15px] "
            type="text"
            placeholder="Search by reference no. or name..."
          />
        </div>

        <div className="flex items-center gap-5">
          <div className="flex items-center gap-[10px]">
            <p className="text-[#191D23] opacity-[60%] text-[15px]">Order by</p>
            <button className="bg-[#FFFFFF] w-[165px] rounded-[5px] px-[20px] py-[10px] items-center flex justify-between text-[15px]">
              Select
              <img src="/imgs/dropdown.svg" alt="" />
            </button>
          </div>
          <div className="flex items-center gap-[10px]">
            <p className="text-[#191D23] opacity-[60%] text-[15px]">Sort by</p>
            <button className="bg-[#FFFFFF] w-[165px] rounded-[5px] px-[20px] py-[10px] items-center flex justify-between text-[15px]">
              Choose
              <img src="/imgs/dropdown.svg" alt="" />
            </button>
          </div>
        </div>
      </div>
      <div className="text-[15px] flex flex-col gap-[20px]">
        <div className="">
          <div
            className={`grid grid-cols-${columns} grid-rows-1 border-b border-[#E7EAEE] py-[12px] px-[24px] flex font-semibold gap-20 justify-between`}
          >
            {columnLabels.map((column, index) => (
              <div
                key={index}
                className={column === "ACTIONS" ? "flex justify-center" : ""}
              >
                {column}
              </div>
            ))}
          </div>
          {component}
        </div>
        <div className="flex justify-between items-center">
          <p className="font-medium text-[15px]">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-[20px] items-center">
            <div className="flex">
              <button
                className="border border-[#E7EAEE99] py-[5px] px-[25px]"
                onClick={() => {
                  setCurrentPage(currentPage - 1);
                }}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              {pagesToShow.map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`border border-[#E7EAEE99] py-[5px] px-[15px] ${
                    currentPage === pageNumber ? "bg-[#007C85] text-white" : ""
                  }`}
                >
                  {pageNumber}
                </button>
              ))}
              <button
                className="border border-[#E7EAEE99] py-[5px] px-[25px]"
                onClick={() => {
                  setCurrentPage(currentPage + 1);
                }}
                disabled={endIndex >= data.length}
              >
                Next
              </button>
            </div>
            <div className="flex">
              <input
                className="border border-[#E7EAEE99] text-center max-w-[50px]"
                type="text"
                placeholder="-"
                value={inputPage}
                onChange={handleInputChange}
              />
              <button
                className="bg-[#007C85] text-white py-[5px] px-[10px]"
                onClick={goToPage}
              >
                Go
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
