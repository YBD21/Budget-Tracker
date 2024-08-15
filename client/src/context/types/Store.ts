export type ThemeState = {
  theme: string;
  updateTheme: (newTheme: string) => void;
};

export type UserState = {
  userData: any;
  setUserData: (newData: any) => void;
};

export type SearchState = {
  searchData: any;
  setSearchData: (newData: string) => void;
};
