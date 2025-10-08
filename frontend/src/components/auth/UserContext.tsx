import {createContext, useContext, useState, type ReactNode, useEffect} from 'react';
import userService, {decodeJwt, type JwtPayload} from 'frontend/services/UserService';

interface UserContextType {
    loggedIn: boolean;
    setLoggedIn: (value: boolean) => void;
    token: string|null,
    jwtPayload:JwtPayload|null,
}

const UserContext = createContext<UserContextType>({
    loggedIn: false,
    setLoggedIn: () => {
    },
    token: null,
    jwtPayload:null,
});

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => useContext(UserContext);

export const UserProvider = ({children}: { children: ReactNode }) => {
    const [loggedIn, _setLoggedIn] = useState<boolean>(userService.isLoggedIn());

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

    const token = userService.getToken();
    const jwtPayload = decodeJwt(token);
    return (
        <UserContext.Provider value={{loggedIn, setLoggedIn,token,jwtPayload}}>
            {children}
        </UserContext.Provider>
    );
};
