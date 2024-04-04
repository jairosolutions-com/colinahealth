import React from "react";

const PatientCard = () => {
  return (
    <div>
      <div className="flex w-full flex-col items-center pt-5">
        <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-lg">
          <img
            className="w-24 h-24 rounded-full"
            src="https://randomuser.me/api/portraits"
            alt="Patient"
          />
        </div>
      </div>
    </div>
  );
};

export default PatientCard;
