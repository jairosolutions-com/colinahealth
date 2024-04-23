import React from "react";

const Footer = () => {
  return (
    <div className="flex w-full items-center justify-between h-[50px] bg-[#FAFAFA] px-[155px] text-[15px] font-semibold min-h-[50px]">
      <div className="text-[#191D2399] cursor-pointer">
        Powered by Jairosoft Inc.
      </div>
      <div className="text-[#191D23] ">© All Copyright 2024 ColinaHealth </div>
      <div className="flex gap-2 text-[#191D2399] ">
        <p className="cursor-pointer">Terms of Use</p>
        <span>|</span>
        <span className="cursor-pointer">Privacy Policy</span>
      </div>
    </div>
  );
};

export default Footer;
