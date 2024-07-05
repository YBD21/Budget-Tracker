// Route
export const DASHBOARD = '/';
export const LOGIN = '/login';
export const FORGOTPASSWORD = '/forget-password';
export const SIGNUP = '/signup';
export const HISTORY = '/history';
export const CUSTOMIZATION = '/customization';

// Routes Collection
export const ACCESS_ONCE_ROUTES = [LOGIN, SIGNUP, FORGOTPASSWORD];
export const PROTECTED_CLIENT_ROUTES = [DASHBOARD, HISTORY, CUSTOMIZATION];
