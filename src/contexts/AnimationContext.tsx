import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AnimationContextProps {
    animationOn: boolean;
    setAnimationOn: React.Dispatch<React.SetStateAction<boolean>>;
}

const AnimationContext = createContext<AnimationContextProps | undefined>(undefined);

export const AnimaitonProvider = ({ children }: { children: ReactNode }) => {
    const [animationOn, setAnimationOn] = useState(true);

    return (
        <AnimationContext.Provider value={{ animationOn, setAnimationOn }}>
            {children}
        </AnimationContext.Provider>
    );
};

export const useAnimation = () => {
    const context = useContext(AnimationContext);
    if (!context) {
        throw new Error('useAnimation must be used within a AnimaitonProvider');
    }
    return context;
};
