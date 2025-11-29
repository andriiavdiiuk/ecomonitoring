
const AppRoutes = {
    Home: '/',
    Register: '/register',
    Login: '/login',
    Logout: '/logout',
    Stations: '/stations',
    Station: '/station/:id',
    NewStation: "/station",
    EditStation: "/station/:id/edit",
    NewMeasurement: "/station/:station_id/measurement",
    EditMeasurement: "/station/:station_id/measurement/:measurement_id/edit",
    HealthRiskCalculator: "/health-risk-calculator",
} as const;

Object.freeze(AppRoutes);

export default AppRoutes;