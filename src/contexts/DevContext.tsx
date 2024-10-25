import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DevContextProps {
    isDev: boolean;
    setIsDev: React.Dispatch<React.SetStateAction<boolean>>;
}

const DevContext = createContext<DevContextProps | undefined>(undefined);

export const DevProvider = ({ children }: { children: ReactNode }) => {
    const [isDev, setIsDev] = useState(false);

    return (
        <DevContext.Provider value={{ isDev, setIsDev }}>
            {children}
        </DevContext.Provider>
    );
};

export const useDev = () => {
    const context = useContext(DevContext);
    if (!context) {
        throw new Error('useDev must be used within a DevProvider');
    }
    return context;
};
