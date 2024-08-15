export type ThemeState = {
  theme: string;
  updateTheme: (newTheme: string) => void;
};

export type UserState = {
  userData: any;
  setUserData: (newData: any) => void;
};
