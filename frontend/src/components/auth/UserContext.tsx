import {createContext, useContext, useState, type ReactNode, useEffect} from 'react';
import userService from 'frontend/services/UserService';

interface UserContextType {
    loggedIn: boolean;
    setLoggedIn: (value: boolean) => void;
}

const UserContext = createContext<UserContextType>({
    loggedIn: false,
    setLoggedIn: () => {
    }
});

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => useContext(UserContext);

export const UserProvider = ({children}: { children: ReactNode }) => {
    const [loggedIn, _setLoggedIn] = useState(userService.isLoggedIn());

    const setLoggedIn = (value: boolean) => {
        if (!value)
        {
            userService.logout();
        }
        _setLoggedIn(value);
    }

    useEffect(() => {
        const interval = setInterval(() => {
            const current = userService.isLoggedIn();
            setLoggedIn(current);
        }, 60_000);

        return () => {
            clearInterval(interval)
        };
    }, []);


    return (
        <UserContext.Provider value={{loggedIn, setLoggedIn}}>
            {children}
        </UserContext.Provider>
    );
};
