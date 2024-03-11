import React from "react";

  const PatientDemographic = () => {
    return (
      <div className="mx-auto w-full max-w-7xl px-5 py-16 md:px-10 md:py-24 lg:py-32">
        <div className="">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold md:text-5xl tl">
              Patient Demographic
            </h2>
            <p className="mx-auto mb-12 mt-4 max-w-xl text-[#647084]"></p>
          </div>

          <form className="ring-1 ring-gray-300 mb-4 text-left sm:px-4 md:px-20" name="wf-form-name" method="get">
            <div className="mb-4 grid grid-cols-2 gap-6">
              
              <div>
                <label className="mb-1 font-medium">Full Name</label>
                <input
                  type="text"
                  className="h-9 w-full bg-[#f2f2f7] px-3 py-6 text-sm text-[#333333]"
                  placeholder="Input name"
                />
              </div>
              <div>
                <label className="mb-1 font-medium">Gender</label>
                <input
                  type="text"
                  className="h-9 w-full bg-[#f2f2f7] px-3 py-6 text-sm text-[#333333]"
                  placeholder="Input Gender"
                />
              </div>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-6">
              <div>
                <label className="mb-1 font-medium">Age</label>
                <input
                  type="text"
                  className="h-9 w-full bg-[#f2f2f7] px-3 py-6 text-sm text-[#333333]"
                  placeholder="Input Age"
                />
              </div>
              <div>
                <label className="mb-1 font-medium">Date of Birth</label>
                <input
                  type="text"
                  className="h-9 w-full bg-[#f2f2f7] px-3 py-6 text-sm text-[#333333]"
                  placeholder="Input date of birth"
                />
              </div>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-6">
              <div>
                <label className="mb-1 font-medium">Contact Phone</label>
                <input
                  type="text"
                  className="h-9 w-full bg-[#f2f2f7] px-3 py-6 text-sm text-[#333333]"
                  placeholder="Input contact phone"
                />
              </div>
              <div>
                <label className="mb-1 font-medium">Address1</label>
                <input
                  type="text"
                  className="h-9 w-full bg-[#f2f2f7] px-3 py-6 text-sm text-[#333333]"
                  placeholder="Input Address"
                />
              </div>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-6">
              <div>
                <label className="mb-1 font-medium">City</label>
                <input
                  type="text"
                  className="h-9 w-full bg-[#f2f2f7] px-3 py-6 text-sm text-[#333333]"
                  placeholder="Input city"
                />
              </div>
              <div>
                <label className="mb-1 font-medium">Address2</label>
                <input
                  type="text"
                  className="h-9 w-full bg-[#f2f2f7] px-3 py-6 text-sm text-[#333333]"
                  placeholder="Input Addres2"
                />
              </div>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-6">
              <div> 
                <label className="mb-1 font-medium">State</label>
                <input
                  type="text"
                  className="h-9 w-full bg-[#f2f2f7] px-3 py-6 text-sm text-[#333333]"
                  placeholder="Input state"
                />
              </div>
              <div>
                <label className="mb-1 font-medium">Country</label>
                <input
                  type="text"
                  className="h-9 w-full bg-[#f2f2f7] px-3 py-6 text-sm text-[#333333]"
                  placeholder="Input country"
                />
              </div>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-6">
              <div> 
                <label className="mb-1 font-medium">Allergies</label>
                <input
                  type="text"
                  className="h-9 w-full bg-[#f2f2f7] px-3 py-6 text-sm text-[#333333]"
                  placeholder="Input allergies"
                />
              </div>
              <div>
                <label className="mb-1 font-medium">Zip</label>
                <input
                  type="text"
                  className="h-9 w-full bg-[#f2f2f7] px-3 py-6 text-sm text-[#333333]"
                  placeholder="Input zip"
                />
              </div>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-6">
              <div> 
                <label className="mb-1 font-medium">Admission Date</label>
                <input
                  type="text"
                  className="h-9 w-full bg-[#f2f2f7] px-3 py-6 text-sm text-[#333333]"
                  placeholder="Input admission date"
                />
              </div>
              <div>
                <label className="mb-1 font-medium">Zip</label>
                <input
                  type="text"
                  className="h-9 w-full bg-[#f2f2f7] px-3 py-6 text-sm text-[#333333]"
                  placeholder="Input zip"
                />
              </div>
            </div>  

            <div className="mb-4 grid grid-cols-2 gap-6">
              <div> 
                <label className="mb-1 font-medium">Email</label>
                <input
                  type="text"
                  className="h-9 w-full bg-[#f2f2f7] px-3 py-6 text-sm text-[#333333]"
                  placeholder="Input email"
                />
              </div>
              <div className="mt-4 pr-10 justify-end">
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
          </form>
        </div>
      </div>
    );
  };

  export default PatientDemographic;