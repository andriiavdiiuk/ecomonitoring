import {useUser} from "frontend/components/auth/UserContext.tsx";
import {type JSX} from "react";
import { Navigate } from 'react-router-dom';
import AppRoutes from "frontend/AppRoutes.tsx";

type RequireAuthProps = {
    role?: string,
    children: JSX.Element,
}

export default function RequireAuth({role, children}: RequireAuthProps): JSX.Element {
    const { user } = useUser()
    
    if (!user?.token || ( role !== undefined && !user.isRole(role)) )
    {
        return <Navigate to={AppRoutes.Login}/>
    }
    
    return children
}