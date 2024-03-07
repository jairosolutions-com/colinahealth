import React from "react";

const PatientDemographic = () => {
  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-16 md:px-10 md:py-24 lg:py-32">
    
    <div className="">
    
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold md:text-5xl text-left">Patient Demographic</h2>
        <p className="mx-auto mb-12 mt-4 max-w-xl text-[#647084]"></p>
      </div>
     
      <form className="mb-4 text-left sm:px-4 md:px-20" name="wf-form-name" method="get">
        <div className="mb-4 grid grid-cols-2 gap-6">
          <div>
            <label  className="mb-1 font-medium">First Name</label>
            <input type="text" className="h-9 w-full bg-[#f2f2f7] px-3 py-6 text-sm text-[#333333]" placeholder=""  />
          </div>
          <div>
            <label  className="mb-1 font-medium">Last Name</label>
            <input type="text" className="h-9 w-full bg-[#f2f2f7] px-3 py-6 text-sm text-[#333333]" placeholder=""  />
          </div>
        </div>
      </form>
    </div>
  </div>
  );
};

export default PatientDemographic;