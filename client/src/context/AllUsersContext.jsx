import React, { createContext, useContext, useState } from "react";

const AllUsersContext = createContext();

export const useAllUsersContext = () => useContext(AllUsersContext);

export const AllUsersProvider = ({ children }) => {
  const [allUsers, setAllUsers] = useState();

  return (
    <AllUsersContext.Provider value={{ allUsers, setAllUsers }}>
      {children}
    </AllUsersContext.Provider>
  );
};
