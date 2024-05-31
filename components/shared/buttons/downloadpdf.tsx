import React from "react";
import Image from "next/image";

const DownloadPDF = () => {
  return (
    <button className="w-[227.72px] text-[15px] font-bold  h-[52px] hover:bg-[#007C85] group hover:border-[#007C85] hover:text-white flex items-center justify-center border-[1.76px] border-[#D0D5DD] rounded-[5px] text-center gap-[10px] ">
      <div className=" group invert">
        <Image
          src="/imgs/downloadpdf-white.svg"
          alt="Custom Icon"
          className="w-[18.75px] group-hover:invert"
          width={18.75}
          height={18.75}
        />
      </div>
      Download PDF
    </button>
  );
};

export default DownloadPDF;
