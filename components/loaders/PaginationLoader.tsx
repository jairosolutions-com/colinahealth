import React from "react";

const PaginationLoader = () => {
  return (
    <div className=" w-full max-w-[1618px] my-5">
      <div className="flex justify-between">
        <p className="font-medium size-[18px] text-[15px] w-[138px] items-center">
          Page 1 of 1
        </p>
        <div>
          <nav>
            <div className="flex text-[15px] ">
              <div className="flex">
                <button
                  className={`cursor-not-allowed flex ring-1 text-[15px] ring-gray-300 items-center justify-center  w-[77px] h-full`}
                >
                  Prev
                </button>
                <p
                  className={`flex border border-px items-center justify-center h-full w-[49px] ring-1 ring-gray-300
                 btn-pagination 
                `}
                >
                  1
                </p>
                <button
                  className={`cursor-not-allowed flex ring-1 text-[15px] ring-gray-300 items-center justify-center  w-[77px] h-full`}
                >
                  Next
                </button>
              </div>
              <form>
                <div className="flex pl-4 ">
                  <input
                    className={`ipt-pagination appearance-none  text-center ring-1 ring-gray-300 border-gray-100`}
                    type="text"
                    placeholder="-"
                    pattern="\d*"
                  />
                  <div className="">
                    <button
                      type="submit"
                      className="btn-pagination ring-1 ring-[#007C85]"
                    >
                      Go{" "}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default PaginationLoader;
