import {StrictMode} from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'frontend/index.css'
import MainPage from "frontend/components/homepage/MainPage.tsx";
import RegisterUserPage from "frontend/components/auth/RegisterUserPage.tsx";
import AppRoutes from "frontend/AppRoutes.tsx";
import LoginUserPage from "frontend/components/auth/LoginUserPage.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <BrowserRouter>
            <Routes>
                <Route index element={ <MainPage/> }/>
                <Route path={AppRoutes.Register} element={ <RegisterUserPage/> } />
                <Route path={AppRoutes.Login} element={ <LoginUserPage/> } />
            </Routes>
      </BrowserRouter>
  </StrictMode>,
)
