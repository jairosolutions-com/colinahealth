import {
  createScheduledMedOfPatient,
  fetchPrescriptionsOfPatient,
  updateScheduledMedOfPatient,
} from "@/app/api/medication-logs-api/scheduled-med-api";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface ModalProps {
  uuid: string;
  name: string;
  isEdit: boolean;
  aschData: any;
  scheduledMedData: any;
  setIsUpdated: any;
  label: string;
  isOpen: boolean;
  setErrorMessage: any;
  isModalOpen: (isOpen: boolean) => void;
  onSuccess: () => void;
  onFailed: () => void;
}

export const ScheduledMedModal = ({
  uuid,
  name,
  isEdit,
  aschData,
  scheduledMedData,
  setIsUpdated,
  label,
  isOpen,
  setErrorMessage,
  isModalOpen,
  onSuccess,
  onFailed,
}: ModalProps) => {
  const params = useParams<{
    id: any;
    tag: string;
    item: string;
  }>();
  const patientId = params.id ? params.id.toUpperCase() : uuid.toUpperCase();
  console.log(patientId, "patientId");
  console.log(aschData, "aschData");
  const router = useRouter();
  const [prescriptionList, setPrescriptionList] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    prescriptionUuid: scheduledMedData.medicationlogs_prescriptionUuid || "",
    medicationLogsName:
      scheduledMedData.medicationlogs_medicationLogsName || "",
    medicationLogsDate:
      scheduledMedData.medicationlogs_medicationLogsDate || "",
    medicationLogsTime:
      scheduledMedData.medicationlogs_medicationLogsTime || "",
    notes: scheduledMedData.medicationlogs_notes || "",
    medicationType: "ASCH",
    medicationLogStatus:
      scheduledMedData.medicationlogs_medicationLogStatus || "",
  });
  console.log(label, "label");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateScheduledMedOfPatient(
          scheduledMedData.medicationlogs_uuid,
          formData,
          router
        );
        setIsUpdated(true);
        onSuccess();
        isModalOpen(false);
        return;
      } else {
        await updateScheduledMedOfPatient(
          formData.prescriptionUuid,
          formData,
          router
        );

        // Reset the form data after successful submission
        setFormData({
          prescriptionUuid: "",
          medicationLogsName: "",
          medicationLogsDate: "",
          medicationLogsTime: "",
          notes: "",
          medicationType: "ASCH",
          medicationLogStatus: "",
        });
        onSuccess();
      }
    } catch (error: any) {
      if (error.message === "Request failed with status code 409") {
        setErrorMessage("Scheduled Med already exist");
        onFailed();
        isModalOpen(false);
        console.log("conflict error");
      }
      setError("Failed to add Scheduled Med");
    }
  };
  console.log(formData, "formData");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prescriptionList = await fetchPrescriptionsOfPatient(
          patientId,
          router
        );
        setPrescriptionList(prescriptionList.data);
      } catch (error) {
        console.error("Error fetching prescription list:");
      }
    };

    fetchData();
  }, []);

  const handleMedicationChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedOption = event.target.selectedOptions[0];
    const prescriptions_name = selectedOption.value;
    const prescriptions_uuid = selectedOption.getAttribute("data-uuid");

    if (prescriptions_uuid) {
      setFormData((prevData) => ({
        ...prevData,
        medicationLogsName: prescriptions_name,
        prescriptionUuid: prescriptions_uuid,
      }));
    }
  };

  console.log(prescriptionList, "prescriptionList");

  const formatTime = (timeString: string) => {
    // Split the time string into hours and minutes
    const [hours, minutes] = timeString.split(":").map(Number);

    // Format the hours part into 12-hour format
    let formattedHours = hours % 12 || 12; // Convert 0 to 12
    const ampm = hours < 12 ? "am" : "pm"; // Determine if it's AM or PM

    // If minutes is undefined or null, set it to 0
    const formattedMinutes =
      minutes !== undefined ? minutes.toString().padStart(2, "0") : "00";

    // Return the formatted time string
    return `${formattedHours}:${formattedMinutes}${ampm}`;
  };
  console.log(isEdit, "isEdit")
  console.log(scheduledMedData, "scheduledMedData");
  console.log(scheduledMedData.length, "scheduledMedData length");
  console.log(formData, "formData");
  return (
    <div
      className={`fixed inset-[-100px]  z-[9999] bg-[#76898A99] flex items-center justify-center pb-[150px]`}
    >
      <div className="w-[676px] h-[660px] bg-[#FFFFFF] rounded-md">
        <div className="bg-[#ffffff] w-full h-[70px] flex flex-col justify-start rounded-md">
          <h2 className="p-title text-left text-[#071437] pl-9 mt-7">
            {isEdit ? "Update" : "Add"} Scheduled Medication Log{" "}
            {name ? "for" : ""}{" "}
            <span className="text-[#007C85]">{name ? name : ""}</span>
          </h2>
          <p className="text-sm text-start pl-9 text-gray-600 pb-10 pt-2">
            Submit your log details.
          </p>
        </div>
        <div className=" mb-9 pt-4">
          <div className="w-full max-h-[300px] md:px-10 mt-5">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="company"
                    className="block text-start text-sm font-semibold leading-6 text-gray-900 required-field"
                  >
                    MEDICATION
                  </label>
                  <div className="mt-2.5">
                    <select
                      name="medicationLogsName"
                      className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      onChange={handleMedicationChange}
                      required
                    >
                      {scheduledMedData.length !== 0 ||
                        (prescriptionList.length !== 0 && (
                          <option value="">Select Prescription</option>
                        ))}

                      {aschData.length !== 0 && (
                        <>
                          <option value="">Select Prescription</option>
                          <option
                            value={aschData.medicationLogsName}
                            data-uuid={aschData.uuid}
                          >
                            {aschData.medicationLogsName} @{" "}
                            {aschData.medicationLogsTime}
                          </option>
                        </>
                      )}

                      {prescriptionList.length === 0 &&
                      scheduledMedData.length === 0 &&
                      aschData.length === 0 ? (
                        <option value="">No Prescription</option>
                      ) : (
                        isEdit && (
                          <option
                            value={
                              scheduledMedData.medicationlogs_medicationLogsName
                            }
                            data-uuid={scheduledMedData.medicationlogs_uuid}
                          >
                            {scheduledMedData.medicationlogs_medicationLogsName}{" "}
                            @{" "}
                            {scheduledMedData.medicationlogs_medicationLogsDate}
                          </option>
                        )
                      )}

                      {prescriptionList.map((prescription, index) => (
                        <option
                          key={index}
                          value={prescription.prescriptions_name}
                          data-uuid={prescription.medicationlogs_uuid}
                        >
                          {prescription.prescriptions_name} @{" "}
                          {formatTime(
                            prescription.medicationlogs_medicationLogsTime
                          )}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="message"
                    className="block text-sm text-start font-semibold leading-6 text-gray-900 required-field"
                  >
                    NOTES
                  </label>
                  <div className="mt-2.5">
                    <textarea
                      rows={4}
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      placeholder="Input notes"
                      style={{ resize: "none" }}
                      required
                      name="notes"
                      value={formData.notes}
                      onChange={handleTextChange}
                    />
                  </div>
                </div>
                <div className="flex-grow md:mr-8 mb-4 md:mb-0">
                  <label
                    htmlFor="date"
                    className="block text-sm text-start font-semibold leading-6 text-gray-900 required-field"
                  >
                    DATE
                  </label>
                  <div className="mt-2.5">
                    <input
                      type="date"
                      className="block w-[290px] h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      placeholder="Input medication"
                      name="medicationLogsDate"
                      value={formData.medicationLogsDate}
                      onChange={handleChange}
                      required
                      disabled={isEdit}
                    />
                  </div>
                </div>
                <div className="flex-grow md:mr-8 mb-4 md:mb-0">
                  <label
                    htmlFor="date"
                    className="block text-sm text-start font-semibold leading-6 text-gray-900 required-field"
                  >
                    TIME
                  </label>
                  <div className="mt-2.5">
                    <input
                      type="time"
                      className="block w-[290px] h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      placeholder="Input medication"
                      name="medicationLogsTime"
                      value={formData.medicationLogsTime}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm text-start font-semibold leading-6 text-gray-900 required-field"
                  >
                    STATUS
                  </label>
                  <div className="mt-2.5">
                    <select
                      id="status"
                      className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      name="medicationLogStatus"
                      value={formData.medicationLogStatus}
                      onChange={handleStatusChange}
                      required
                    >
                      <option value="">Select status</option>
                      <option value="Held">HELD</option>
                      <option value="Given">GIVEN</option>
                      <option value="Refused">REFUSED</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="mt-8 pb-3 flex grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                <button
                  onClick={() => isModalOpen(false)}
                  type="button"
                  className="w-[290px] h-12  hover:bg-[#D9D9D9] font-medium rounded-[7px] text-[#000] ring-1 ring-gray-200 mr-8"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-[290px] h-12 bg-[#1B84FF] hover:bg-[#2765AE] rounded-[7px] text-[#ffff] font-medium"
                >
                  {isEdit ? "Update" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
