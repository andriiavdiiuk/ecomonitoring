import {createContext, useContext, useState, type ReactNode, useEffect} from 'react';
import userService, {decodeJwt, type JwtPayload} from 'frontend/services/UserService';

class User {
    public readonly token: string;
    public readonly jwtPayload: JwtPayload|null
    constructor(token:string) {
        this.token = token;
        this.jwtPayload = decodeJwt(token);
    }

    public isRole(role:string):boolean {
        return !!this.jwtPayload?.roles.includes(role);
    }
}

interface UserContextType {
    loggedIn: boolean;
    setLoggedIn: (value: boolean) => void;
    user: User | null;
}

const UserContext = createContext<UserContextType>({
    loggedIn: false,
    setLoggedIn: () => {
    },
    user: null,
});

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => useContext(UserContext);

export const UserProvider = ({children}: { children: ReactNode }) => {
    const [loggedIn, _setLoggedIn] = useState<boolean>(userService.isLoggedIn());

    const setLoggedIn = (value: boolean) => {
        if (!value) {
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

    const user = new User(userService.getToken());

    return (
        <UserContext.Provider value={{loggedIn, setLoggedIn, user}}>
            {children}
        </UserContext.Provider>
    );
};
