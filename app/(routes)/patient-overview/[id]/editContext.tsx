import { useEffect } from "react";
import { createContext, useContext, useState } from "react";

interface EditContextType {
  isEdit: boolean;
  toggleEdit: () => void;
  saveClicked: () => void;
  isSave: boolean; // Define toggleEdit as a function that takes no arguments and returns void
}

const defaultValue: EditContextType = {
  isEdit: false,
  toggleEdit: () => {},
  isSave: false,
  saveClicked: () => {},
  // Set the default value of isEdit to false
};
//create the context first
export const EditContext = createContext(defaultValue);
// use the context passing the context as an argument
export const useEditContext = () => useContext(EditContext);
// create the provider to wrap the components that will use the context
export const EditProvider = ({ children }: { children: React.ReactNode }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [isSave, setIsSave] = useState(false);

  const toggleEdit = () => {
    setIsEdit((prev) => !prev);
    console.log("editcontext", isEdit);
    setIsSave(false)
  };

  const saveClicked = () => {
    setIsSave(true);
    setIsEdit((prev) => !prev);

    console.log("setIsSave", isSave);
  };

  useEffect(() => {
    setIsSave(isSave);
    setIsEdit(isEdit);
    console.log("isEdit changed context:", isEdit);
    console.log("isSave changed context:", isSave);
  }, [isEdit, isSave]); // Include isEdit in the dependency array to ensure that the effect runs whenever the isEdit state changes

  return (
    //values to pass in the children when using the provider
    <EditContext.Provider value={{ isEdit, toggleEdit, isSave, saveClicked }}>
      {children}
    </EditContext.Provider>
  );
};
