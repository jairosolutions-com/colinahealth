import React from "react";

const PatientCard = () => {
  return (
    <div>
      <div className="flex w-full h-full flex-col items-center pt-5 gap-3 right-0 justify-end">
        <div className="flex flex-col items-center bg-white py-6 rounded-lg shadow-lg border-2 border-solid justify-end right-0">
          <img
            className="w-24 h-24 rounded-full"
            src="https://randomuser.me/api/portraits"
            alt="Patient"
          />
        </div>
        <div className="flex flex-col items-center bg-white py-6 rounded-lg shadow-lg border-2 border-solid">
          <img
            className="w-24 h-24 rounded-full"
            src="https://randomuser.me/api/portraits"
            alt="Patient"
          />
        </div>
        <div className="flex flex-col items-center bg-white py-6 rounded-lg shadow-lg border-2 border-solid">
          <img
            className="w-24 h-24 rounded-full"
            src="https://randomuser.me/api/portraits"
            alt="Patient"
          />
        </div>
        <div className="flex flex-col items-center bg-white py-6 rounded-lg shadow-lg border-2 border-solid">
          <img
            className="w-24 h-24 rounded-full"
            src="https://randomuser.me/api/portraits"
            alt="Patient"
          />
        </div>
        <div className="flex flex-col items-center bg-white py-6 rounded-lg shadow-lg border-2 border-solid">
          <img
            className="w-24 h-24 rounded-full"
            src="https://randomuser.me/api/portraits"
            alt="Patient"
          />
        </div>
        <div className="flex flex-col items-center bg-white py-6 rounded-lg shadow-lg border-2 border-solid">
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
