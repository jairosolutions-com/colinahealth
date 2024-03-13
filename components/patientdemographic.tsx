import React from "react";

const PatientDemographic = () => {
  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-16 md:px-10 md:py-24 lg:py-32">
      <div className="ring-1  ring-gray-300 fixed">
        <div className=" w-full max-w-3xl text-left pl-8 pt-8 ml-10">
          <h2 className="text-3xl font-medium md:text-5xl text-left text-[#071437] ">
            Patient Demographic
          </h2>
          <p className="mx-auto mb-12 mt-4 max-w-xl text-[#647084]"></p>
        </div>

        <form className="ring-1 ring-gray-300 mb-4 text-left sm:px-4 md:px-20 relative" name="wf-form-name" method="get">
          <div className="pt-8 pb-8 " > 
          <div className="mb-4 grid grid-cols-2 gap-6 ">
            <div className="flex flex-row gap-x-[75px]">
              <label className="mb-1 font-medium font-manrope text-nowrap mt-2">Full Name</label>
              <input
                type="text"
                className="h-10 w-96 bg-[#FCFCFC]  px-3 py-2 text-sm text-[#333333] opacity-60  rounded border border-gray-200"
                placeholder="input full name"
              />
            </div>
              <div className="flex flex-row gap-x-[80px]">  
              <label className="mb-1 font-medium font-manrope mt-2">Gender</label>
              <input
                type="text"
                className="h-10 w-96 bg-[#FCFCFC]  px-3 py-2 text-sm text-[#333333] opacity-60 text-normal rounded border border-gray-200"
                placeholder="input gender"
              />
            </div>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-6">
          <div className="flex flex-row gap-x-[120px]">
              <label className="mb-1 font-medium font-manrope text-nowrap mt-2">Age</label>
              <input
                type="text"
                className="h-10 w-96 bg-[#FCFCFC]  px-3 py-2 text-sm text-[#333333] opacity-60 text-normal rounded border border-gray-200"
                placeholder="input age"
              />
            </div>
            <div className="flex flex-row gap-x-[40px]">
              <label className="mb-1 font-medium font-manrope text-nowrap mt-2">Date of Birth</label>
              <input
                type="text"
                className="h-10 w-96 bg-[#FCFCFC]  px-3 py-2 text-sm text-[#333333]  opacity-60 text-normal rounded border border-gray-200"
                placeholder="input date of birth"
              />
            </div>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-6">
          <div className="flex flex-row gap-x-[35px]">
              <label className="mb-1 font-medium font-manrope text-nowrap mt-2">Contact Phone</label>
              <input
                type="text"
                className="h-10 w-96 bg-[#FCFCFC]  px-3 py-2 text-sm text-[#333333] opacity-60 text-normal rounded border border-gray-200"
                placeholder="input contact phone"
              />
            </div>
            <div className="flex flex-row gap-x-[65px]">
              <label className="mb-1 font-medium font-manrope mt-2">Address1</label>
              <input
                type="text"
                className="h-10 w-96 bg-[#FCFCFC]  px-3 py-2 text-sm text-[#333333] opacity-60 text-normal rounded border border-gray-200"
                placeholder="input Address"
              />
            </div>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-6">
          <div className="flex flex-row gap-x-[116px]">
              <label className="mb-1 font-medium font-manrope mt-2">City</label>
              <input
                type="text"
                className="h-10 w-96 bg-[#FCFCFC]  px-3 py-2 text-sm text-[#333333] opacity-60 text-normal rounded border border-gray-200" 
                placeholder="input city"
              />
            </div>
            <div className="flex flex-row gap-x-[64px]">
              <label className="mb-1 font-medium font-manrope mt-2">Address2</label>
              <input
                type="text"
                className="h-10 w-96 bg-[#FCFCFC]  px-3 py-2 text-sm text-[#333333] opacity-60 text-normal rounded border border-gray-200"
                placeholder="input Addres2"
              />
            </div>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-6">
          <div className="flex flex-row gap-x-[107px]">
              <label className="mb-1 font-medium font-manrope mt-2">State</label>
              <input
                type="text"
                className="h-10 w-96 bg-[#FCFCFC]  px-3 py-2 text-sm text-[#333333] opacity-60 text-normal rounded border border-gray-200"
                placeholder="input state"
              />
            </div>
            <div className="flex flex-row gap-x-[76px]">
              <label className="mb-1 font-medium font-manrope mt-2">Country</label>
              <input
                type="text"
                className="h-10 w-96 bg-[#FCFCFC]  px-3 py-2 text-sm text-[#333333] opacity-60 text-normal rounded border border-gray-200"
                placeholder="input country"
              />
            </div>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-6">
          <div className="flex flex-row gap-x-[79px]">
              <label className="mb-1 font-medium font-manrope mt-2">Allergies</label>
              <input
                type="text"
                className="h-10 w-96 bg-[#FCFCFC]  px-3 py-2 text-sm text-[#333333] opacity-60 text-normal rounded border border-gray-200"
                placeholder="input allergies"
              />
            </div>
            <div className="flex flex-row gap-x-[115px]">
              <label className="mb-1 font-medium font-manrope mt-2">Zip</label>
              <input
                type="text"
                className="h-10 w-96 bg-[#FCFCFC]  px-3 py-2 text-sm text-[#333333] opacity-60 text-normal rounded border border-gray-200"
                placeholder="input zip"
              />
            </div>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-6">
          <div className="flex flex-row gap-x-[27px]">
              <label className="mb-1 font-medium font-manrope text-nowrap mt-2">Admission Date</label>
              <input
                type="text"
                className="h-10 w-96 bg-[#FCFCFC]  px-3 py-2 text-sm text-[#333333] opacity-60 text-normal rounded border border-gray-200"
                placeholder="input admission date"
              />
            </div>
            <div className="flex flex-row gap-x-[45px]">
              <label className="mb-1 font-medium font-manrope text-nowrap mt-2">Code Status</label>
              <input
                type="text"
                className="h-10 w-96 bg-[#FCFCFC]  px-3 py-2 text-sm text-[#333333] opacity-60 text-normal rounded border border-gray-200"
                placeholder="input code status"
              />
            </div>
          </div>  

          <div className="mb-4 grid grid-cols-2 gap-6">
          <div className="flex flex-row gap-x-[105px]">
              <label className="mb-1 font-medium font-manrope  mt-2">Email</label>
              <input
                type="text"
                className="h-10 w-96 bg-[#FCFCFC]  px-3 py-2 text-sm text-[#333333] opacity-60 text-normal rounded border border-gray-200"
                placeholder="input email"
              />
            </div>
            <div className="mt-4  justify-end flex  ">
              <button
                type="button"
                className="px-3 py-2 bg-[#D9D9D9] bg-opacity-30 hover:bg-[#D9D9D9] font-medium rounded-[7px] text-[#000] mt-2 mr-3"
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-3 py-2 bg-[#1B84FF] hover:bg-[#2765AE] rounded-[7px] text-[#ffff] font-medium mt-2"
              >
                Submit
              </button>
            </div>
          </div>
          </div>
        </form>

      </div>
    </div>
  );
};

export default PatientDemographic;