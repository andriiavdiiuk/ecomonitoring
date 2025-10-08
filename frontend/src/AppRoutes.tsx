
const AppRoutes = {
    Home: '/',
    Register: '/register',
    Login: '/login',
    Logout: '/logout',
    Stations: '/stations',
    Station: '/station/:id',
    NewStation: "/station",
    EditStation: "/station/:id/edit"
} as const;

Object.freeze(AppRoutes);

export default AppRoutes;