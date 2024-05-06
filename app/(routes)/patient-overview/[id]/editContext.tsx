import { useEffect } from "react";
import { createContext, useContext, useState } from "react";

interface EditContextType {
  isEdit: boolean;
  toggleEdit: () => void; // Define toggleEdit as a function that takes no arguments and returns void
}

const defaultValue: EditContextType = {
  isEdit: false,
  toggleEdit: () => {},
};

export const EditContext = createContext(defaultValue);

export const useEditContext = () => useContext(EditContext);

export const EditProvider = ({ children }: { children: React.ReactNode }) => {
  const [isEdit, setIsEdit] = useState(false);

  const toggleEdit = () => {
    setIsEdit((prev) => !prev);
    console.log("editcontext", isEdit);
  };

  useEffect(() => {
    // Perform some action whenever the isEdit state changes
    setIsEdit(isEdit);
    console.log("isEdit changed context:", isEdit);
  }, [isEdit]); // Include isEdit in the dependency array to ensure that the effect runs whenever the isEdit state changes

  return (
    <EditContext.Provider value={{ isEdit, toggleEdit }}>
      {children}
    </EditContext.Provider>
  );
};
