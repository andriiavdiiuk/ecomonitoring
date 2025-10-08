import {useUser} from "frontend/components/auth/UserContext.tsx";
import {useNavigate} from "react-router-dom";
import AppRoutes from "frontend/AppRoutes.tsx";

export default function LogoutUserPage(): (null) {
    const {setLoggedIn} = useUser();
    const navigate = useNavigate();

    void (async () => {
        setLoggedIn(false);
        await navigate(AppRoutes.Home);
    })();

    return (null);
}