import React from "react";

export const Labresult = () => {
  return (
    <div className="w-full h-full px-10">
      <div className="w-full h-full flex flex-col py-5 gap-2 justify-between">
        <div className="w-full flex justify-between gap-5">
          <div className="w-1/2">
            <div>Hemoglobin A1c</div>
            <div className="mb-2">Range</div>
            <div className="flex gap-2 items-center mb-5">
              <input
                className="outline-none h-[38px] w-1/2 px-5 rounded-md bg-[#F6F6F6]"
                type="number"
              />
              <p className="text-[20px]"> -</p>
              <input
                className="outline-none h-[38px] w-1/2 px-5 rounded-md bg-[#F6F6F6]"
                type="number"
              />
            </div>
            <div>Total Cholesterol</div>
            <div className="mb-2">Range</div>
            <div className="flex gap-2 mb-5">
              <input
                className="outline-none h-[38px] w-1/2 px-5 rounded-md bg-[#F6F6F6]"
                type="number"
              />
              <p className="text-[20px]"> -</p>
              <input
                className="outline-none h-[38px] w-1/2 px-5 rounded-md bg-[#F6F6F6]"
                type="number"
              />
            </div>
            <div>HDL Cholesterol</div>
            <div className="mb-2">Range</div>
            <div className="flex gap-2 mb-5">
              <input
                className="outline-none h-[38px] w-1/2 px-5 rounded-md bg-[#F6F6F6]"
                type="number"
              />
              <p className="text-[20px]"> -</p>
              <input
                className="outline-none h-[38px] w-1/2 px-5 rounded-md bg-[#F6F6F6]"
                type="number"
              />
            </div>
          </div>
          <div className="w-1/2">
            <div>Fasting Glucose Cholesterol</div>
            <div className="mb-2">Range</div>
            <div className="flex gap-2 mb-5">
              <input
                className="outline-none h-[38px] w-1/2 px-5 rounded-md bg-[#F6F6F6]"
                type="number"
              />
              <p className="text-[20px]"> -</p>
              <input
                className="outline-none h-[38px] w-1/2 px-5 rounded-md bg-[#F6F6F6]"
                type="number"
              />
            </div>
            <div>LDL Cholesterol</div>
            <div className="mb-2">Range</div>
            <div className="flex gap-2 mb-5">
              <input
                className="outline-none h-[38px] w-1/2 px-5 rounded-md bg-[#F6F6F6]"
                type="number"
              />
              <p className="text-[20px]"> -</p>
              <input
                className="outline-none h-[38px] w-1/2 px-5 rounded-md bg-[#F6F6F6]"
                type="number"
              />
            </div>
            <div>Triglycerides</div>
            <div className="mb-2">Range</div>
            <div className="flex gap-2 mb-5">
              <input
                className="outline-none h-[38px] w-1/2 px-5 rounded-md bg-[#F6F6F6]"
                type="number"
              />
              <p className="text-[20px]"> -</p>
              <input
                className="outline-none h-[38px] w-1/2 px-5 rounded-md bg-[#F6F6F6]"
                type="number"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            className="w-[150px] h-[45px]  bg-[#F3F3F3] hover:bg-[#D9D9D9] font-medium text-black mr-4 rounded-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-[150px] h-[45px] bg-[#007C85] hover:bg-[#03595B] flex justify-center items-center  text-[#ffff]  font-medium rounded-sm"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
