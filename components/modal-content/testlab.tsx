<div className="h-full grid grid-cols-1 md:grid-cols-10 gap-4">
  <div className="md:px-10 mt-5 md:col-span-3 grid grid-rows-12">
    <div className="grid grid-cols-1 row-span-3 gap-x-4 ">
      <div className="even:bg-gray-50 border-b cursor-pointer">
        <div className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
          TESTNAME
        </div>
      </div>
    </div>
    <div className="flex flex-col  row-span-7 items-center justify-end mt-5">
      <div className="mt-5">
        <button
          type="button"
          className="w-48 px-3 py-2 hover:bg-[#D9D9D9] font-medium rounded-[7px] text-[#000] ring-1 ring-gray-200"
        >
          Cancel
        </button>
      </div>

      <div className="mt-2">
        <button className="w-48 px-3 py-2 bg-[#1B84FF] hover:bg-[#2765AE] rounded-[7px] text-[#ffff] font-medium">
          OK
        </button>
      </div>
    </div>
  </div>

  <div className="md:col-span-7 items-center justify-center">
    <div className="w-full mb-4"></div>

    <div className="w-full max-w-xl">
      <iframe
        width="600px"
        height="550px"
        className="shadow-md rounded-lg"
      ></iframe>

      <iframe width="600px" height="550px"></iframe>
    </div>

    <div className="flex justify-center space-x-4 mt-4">
      <button className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-700 rounded-md">
        Previous
      </button>

      <button className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-700 rounded-md">
        Next
      </button>
    </div>
  </div>
</div>;
