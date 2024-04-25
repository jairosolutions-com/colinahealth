import React from "react";

const Pagination = () => {
  return (
    <div className="mx-3 mt-5">
      <div className="flex justify-between">
        <p className="font-medium size-[18px] w-[138px] items-center">
          Page 1 of 10
        </p>
        <div>
          <nav>
            <div className="flex -space-x-px text-sm">
              <div>
                <a
                  href="#"
                  className="flex border border-px items-center justify-center  w-[77px] h-full"
                >
                  Prev
                </a>
              </div>
              <div>
                {/* wala pay active function */}
                <a
                  href="#"
                  className="flex items-center justify-center  w-[49px] h-full"
                >
                  1
                </a>
              </div>
              <div>
                <a
                  href="#"
                  className="flex border border-px items-center justify-center  w-[49px] h-full"
                >
                  2
                </a>
              </div>
              <div>
                <a
                  href="#"
                  aria-current="page"
                  className="flex border border-px items-center justify-center  w-[49px] h-full"
                >
                  3
                </a>
              </div>

              <div className="ml-5">
                <a
                  href="#"
                  className="flex border border-px items-center justify-center  w-[77px] h-full"
                >
                  Next
                </a>
              </div>
              <div className="flex   ">
                <input
                  className="ipt-pagination text-center border ring-1 ring-gray-300 border-gray-100"
                  type="text"
                  placeholder="-"
                />
                <div className="">
                  <button className="btn-pagination  ">Go </button>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
