'use client';

import { useRef } from 'react';
import { useSearchStore } from '@/context/Store';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = () => {
  const { searchData, setSearchData } = useSearchStore();
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trimStart();

    // Immediately update the input field with the latest value
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Set the search data with a delay (debounce)
    debounceTimeout.current = setTimeout(() => {
      setSearchData(value);
    }, 1500); // 1.5s delay
  };

  return (
    <div className="relative flex items-center mb-8 mx-1.5">
      <input
        type="text"
        placeholder="Search by title"
        className="pl-10 pr-3 py-2 w-full border border-gray-800 rounded-lg focus:border-black focus:ring-black focus:outline-none focus:ring focus:ring-opacity-40 dark:border-neutral-400 dark:focus:border-neutral-500 dark:focus:ring-neutral-400 dark:bg-neutral-700 dark:placeholder:text-gray-50"
        defaultValue={searchData}
        onChange={handleChange}
      />
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none scale-110" />
    </div>
  );
};

export default SearchBar;
