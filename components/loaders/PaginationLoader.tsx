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
                  className={`cursor-not-allowed flex text-[15px] border-[0.9px] border-[#E7EAEE99]  items-center justify-center  w-[77px] h-full`}
                >
                  Prev
                </button>
                <p
                  className={`flex  border-px items-center justify-center h-full w-[49px] border-[0.9px] border-[#E7EAEE99] 
                 btn-pagination 
                `}
                >
                  1
                </p>
                <button
                  className={`cursor-not-allowed flex text-[15px] border-[0.9px] border-[#E7EAEE99]  items-center justify-center  w-[77px] h-full`}
                >
                  Next
                </button>
              </div>
              <form>
                <div className="flex pl-4 ">
                  <input
                    className={`ipt-pagination appearance-none  text-center border-[0.9px] border-[#E7EAEE99]`}
                    type="text"
                    placeholder="-"
                    pattern="\d*"
                  />
                  <div className="">
                    <button
                      type="submit"
                      className="btn-pagination border-[0.9px] border-[#007C85]"
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
