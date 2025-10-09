import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import 'frontend/index.css'
import MainPage from "frontend/components/homepage/MainPage.tsx";
import RegisterUserPage from "frontend/components/auth/RegisterUserPage.tsx";
import AppRoutes from "frontend/AppRoutes.tsx";
import LoginUserPage from "frontend/components/auth/LoginUserPage.tsx";
import Header from "frontend/components/miscellaneous/Header.tsx";
// import Footer from "frontend/components/miscellaneous/Footer.tsx";
import {UserProvider} from "frontend/components/auth/UserContext.tsx";
import LogoutUserPage from "frontend/components/auth/LogoutUserPage.tsx";
import StationsTablePage from "frontend/components/stations/StationsTablePage.tsx";
import StationPage from "frontend/components/stations/StationPage.tsx";
import EditStationPage from "frontend/components/stations/EditStationPage.tsx";
import EditMeasurementPage from "frontend/components/stations/EditMeasurementPage.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <UserProvider>
            <BrowserRouter>
                <Header/>
                <Routes>
                    <Route index element={<MainPage/>}/>
                    <Route path={AppRoutes.Register} element={<RegisterUserPage/>}/>
                    <Route path={AppRoutes.Login} element={<LoginUserPage/>}/>
                    <Route path={AppRoutes.Logout} element={<LogoutUserPage />} />
                    <Route path={AppRoutes.Stations} element={<StationsTablePage />} />
                    <Route path={AppRoutes.Station} element={<StationPage/>} />
                    <Route path={AppRoutes.NewStation} element={<EditStationPage />} />
                    <Route path={AppRoutes.EditStation} element={<EditStationPage />} />
                    <Route path={AppRoutes.NewMeasurement} element={<EditMeasurementPage />} />
                    <Route path={AppRoutes.EditMeasurement} element={<EditMeasurementPage />} />
                </Routes>
                {/*<Footer/>*/}
            </BrowserRouter>
        </UserProvider>
    </StrictMode>,
)
