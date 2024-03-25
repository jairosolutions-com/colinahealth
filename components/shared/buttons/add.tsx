import React from "react";

const Add = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="mr-2 btn-add text-[#000000] w-[109px] h-[42px] radiu"
    >
      <img src="/imgs/add.svg" alt="Custom Icon" className="w-5 h-5 mr-2" />
      Add
    </button>
  );
};

export default Add;
