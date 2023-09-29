import React, { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [activeComponent, setActiveComponent] = useState("Tasks");

  return (
    <AppContext.Provider value={{ activeComponent, setActiveComponent }}>
      {children}
    </AppContext.Provider>
  );
};
