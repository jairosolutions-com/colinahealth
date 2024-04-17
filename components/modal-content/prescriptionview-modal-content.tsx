import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import Image from "next/image";

interface ModalProps {
  isModalOpen: (isOpen: boolean) => void;
}

export const PrescriptionviewModalContent = ({ isModalOpen }: ModalProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [toast, setToast] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const closeModal = () => {
    setModalOpen(false);
  };
  const toggleDeleteModal = () => {
    setDeleteModalOpen(!deleteModalOpen);
  };

  const EditModeComponent = () => {
    const [editMode, setEditMode] = useState(false);

    const toggleEditMode = () => {
      setEditMode(!editMode);
      setShowCheckboxes(false);
    };
    const toggleCheckboxes = () => {
      setShowCheckboxes(!showCheckboxes);
    };

    const selectAll = () => {
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach((checkbox) => {
        (checkbox as HTMLInputElement).checked = true;
      });
    };
    const handleDeleteConfirmation = () => {
      // Perform delete action here
      // Show toast message
      setToastVisible(true);
      // Close delete modal
      setDeleteModalOpen(false);
    };

    useEffect(() => {
      let timeoutId: NodeJS.Timeout;
      if (toastVisible) {
        timeoutId = setTimeout(() => {
          setToastVisible(false);
        }, 2000); // Hide toast after 4 seconds
      }

      return () => clearTimeout(timeoutId);
    }, [toastVisible]);

    return (
      <>
        <div className="w-[676px] h-[590px]">
          <div className="bg-[#ffffff] w-full h-[70px] flex flex-col justify-start rounded-md">
            <div className="items-center flex justify-between">
              <h2 className="p-title text-left text-[#071437] pl-10 mt-7">
                View Prescription
              </h2>
              <X
                onClick={() => isModalOpen(false)}
                className="w-7 h-7 text-black flex items-center mt-2 mr-4"
              />
            </div>
            <p className="text-sm pl-10 text-gray-600 pb-10 pt-2">
              Document Files
            </p>
          </div>
          <div className=" mb-9 pt-4">
            <div className="max-h-[400px] md:px-8 mt-5">
              <div className="even:bg-gray-50 cursor-pointer">
                <div className="w-full max-w-xl flex justify-between gap-6">
                  <div
                    style={{
                      overflow: "scroll",
                      width: "400px",
                      height: "350px",
                    }}
                  >
                    <Image
                      src="/imgs/docs.png"
                      alt="Document"
                      width={400}
                      height={800}
                      className=""
                      onClick={toggleModal}
                    />
                  </div>
                  <div className={`w-[190px] ${editMode ? "edit-mode" : ""}`}>
                    <div className="flex justify-end text-[12px] font-bold">
                      <button
                        className={
                          !editMode ? "delete-btn" : "delete-btn hidden"
                        }
                        onClick={toggleEditMode}
                      >
                        Delete
                      </button>
                      <button
                        className={
                          editMode ? "select-all-btn" : "select-all-btn hidden"
                        }
                        onClick={selectAll}
                      >
                        Select All
                      </button>
                    </div>

                    <div className=" h-[40px] flex justify-between bg-white shadow-md mt-2">
                      {editMode && (
                        <input
                          type="checkbox"
                          className="h-[15px] mt-3 bg-white w-full flex justify-between"
                          placeholder="labresult.jpg"
                        />
                      )}
                      <p className=" bg-white shadow-sm ">
                        <span className="ml-4 mr-10 mt-2 flex items-center text-[15px]  ">
                          labresult.jpg
                        </span>
                      </p>
                    </div>
                    <div className=" h-[40px] flex justify-between bg-white shadow-md mt-2">
                      {editMode && (
                        <input
                          type="checkbox"
                          className="h-[15px] mt-3 bg-white w-full flex justify-between"
                          placeholder="labresult.jpg"
                        />
                      )}
                      <p className=" bg-white shadow-sm ">
                        <span className="ml-4 mr-10 mt-2 flex items-center text-[15px]  ">
                          labresult.jpg
                        </span>
                      </p>
                    </div>
                    <div className=" h-[40px] flex justify-between bg-white shadow-md mt-2">
                      {editMode && (
                        <input
                          type="checkbox"
                          className="h-[15px] mt-3 bg-white w-full flex justify-between"
                          placeholder="labresult.jpg"
                        />
                      )}
                      <p className=" bg-white shadow-sm ">
                        <span className="ml-4 mr-10 mt-2 flex items-center text-[15px]  ">
                          labresult.jpg
                        </span>
                      </p>
                    </div>
                    <div className="mt-4 ml-[100px]">
                      {editMode && (
                        <button
                          className="w-[80px] h-[30px] text-white bg-blue-500 hover:bg-blue-700"
                          onClick={toggleDeleteModal}
                        >
                          <label className="">delete</label>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal */}
              {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black ">
                  <div className="bg-white p-6 max-w-lg rounded-lg">
                    <button
                      type="button"
                      className="absolute top-0 left-0 m-4 ml-10 text-white hover:underline flex text-[20px] "
                    >
                      <Image
                        className="mr-2"
                        src="/svgs/print.svg"
                        alt="Icon"
                        width={30}
                        height={30}
                      />
                      Print
                    </button>
                    <button
                      type="button"
                      className="absolute top-0 left-0 m-4 ml-36 text-white hover:underline flex text-[20px] "
                    >
                      <Image
                        className="mr-2"
                        src="/svgs/downlod.svg"
                        alt="Icon"
                        width={30}
                        height={30}
                      />
                      Download
                    </button>
                    <button
                      className="absolute top-0 right-0 m-4 text-white hover:underline text-[20px]"
                      onClick={toggleModal}
                    >
                      Close
                    </button>
                    <Image
                      src="/imgs/docs.png"
                      alt="Document"
                      width={700}
                      height={500}
                      className=""
                    />
                  </div>
                </div>
              )}
              {deleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#76898A99]">
                  <div className="bg-white max-w-lg rounded-lg w-[700px] h-[146px]">
                    <div className="flex justify-center items-center pt-6 pb-6">
                      <h2 className="font-semibold text-[20px] text-[#667085]">
                        Are you sure to delete this?
                      </h2>
                    </div>
                    <div className=" flex border-t-4 ">
                      <button
                        onClick={() => setDeleteModalOpen(false)}
                        type="button"
                        className="w-[600px] h-[50px] px-3 py-2 bg-[#BCBCBC] hover:bg-[#D9D9D9] font-medium text-white mt-4 mr-[3px] rounded-bl-md"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          setDeleteModalOpen(false);
                          setToastVisible(true);
                        }}
                        type="button"
                        className="w-[600px] px-3 py-2 bg-[#1B84FF] hover:bg-[#2765AE]  text-[#ffff] font-medium mt-4 rounded-br-md"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {toastVisible && (
                <div className="flex absolute top-0 right-0 pr-[120px] pt-[200px]">
                  <div className="flex w-full p-1 gap-5 pl-8 bg-[#F0F0F0]">
                    <div className="flex w-[50px] h-[50px] ">
                      <Image
                        src="/svgs/checked.svg"
                        alt={"image"}
                        width={50}
                        height={50}
                        className="pt-6"
                      />
                    </div>
                    <div className="text-[20px] flex justify-center items-center font-medium pr-20 ">
                      Successfully Deleted!
                    </div>
                  </div>
                  <div className="bg-[#63b84d] w-[17px] h-[79px]"></div>
                </div>
              )}

              <div className="flex space-x-4 mt-4 ml-[115px] text-[15px]">
                <button className=" w-[80px] h-[30px] text-blue-500 bg-white-500 border-2 border-blue-500 ">
                  Previous
                </button>

                <button className=" w-[80px] h-[30px] text-white bg-blue-500 hover:bg-blue-700 ">
                  Next
                </button>
              </div>
            </div>
          </div>
          <div className="">
            <div className="justify-center flex border-t-4 ">
              <button
                onClick={() => isModalOpen(false)}
                type="button"
                className="w-[600px] h-[50px] px-3 py-2 bg-[#BCBCBC] hover:bg-[#D9D9D9] font-medium text-white mt-4 mr-[3px] rounded-bl-md"
              >
                Cancel
              </button>
              <button
                type="button"
                className="w-[600px] px-3 py-2 bg-[#1B84FF] hover:bg-[#2765AE]  text-[#ffff] font-medium mt-4 rounded-br-md"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
        {toast}
      </>
    );
  };

  return <EditModeComponent />;
};
