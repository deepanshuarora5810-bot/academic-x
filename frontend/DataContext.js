import React, { createContext, useContext, useState } from 'react';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <DataContext.Provider value={{ data, setData, user, setUser, isDarkMode, setIsDarkMode }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
