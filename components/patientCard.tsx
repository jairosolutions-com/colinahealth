import React from "react";

const PatientCard = ({
  patientWithMedicationLogsToday,
}: {
  patientWithMedicationLogsToday: any;
}) => {
  console.log(patientWithMedicationLogsToday, "patientCard");
  return (
    <div>
      <div className="flex w-full h-full flex-col items-center gap-5 pt-12 pb-10  right-0 justify-end">
        {patientWithMedicationLogsToday.map((patient: any, index: number) => (
          <div className="flex flex-col items-center bg-white py-10 rounded-lg shadow-lg border-2 border-solid justify-end right-0">
            <img
              className="w-24 h-24 rounded-full"
              src="https://randomuser.me/api/portraits"
              alt="Patient"
            />
            <p>
              {patient.firstName} {patient.lastName}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientCard;
