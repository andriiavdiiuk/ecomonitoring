type AppRoutes = {
    Home: string,
    Register: string,
    Login: string,
    Logout: string,
}
const AppRoutes:AppRoutes = {
    Home: '/',
    Register: '/register',
    Login: '/login',
    Logout: '/logout'
} as const;

Object.freeze(AppRoutes);

export default AppRoutes;