type AppRoutes = {
    Home: string,
    Register: string,
    Login: string,
}
const AppRoutes:AppRoutes = {
    Home: '/',
    Register: '/register',
    Login: '/login',
} as const;

Object.freeze(AppRoutes);

export default AppRoutes;