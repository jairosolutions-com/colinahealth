import React from "react";
import Image from "next/image";

const DownloadPDF = () => {
  return (
    <button className="btn-pdfs hover:bg-[#007C85] h-[42px] hover:border-[#007C85] hover:text-white flex items-center justify-center rounded-lg font-manrope text-black text-lg px-8 py-4 border-2 border-gray-300 text-center w-64 relative ">
      <Image
        src="/imgs/downloadpdf.svg"
        alt="Custom Icon"
        className="w-5 h-5 mr-2"
        width={22}
        height={22}
      />
      Download PDF
    </button>
  );
};

export default DownloadPDF;
