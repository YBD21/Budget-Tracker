'use client';

import SearchIcon from '@mui/icons-material/Search';

const SearchBar = () => {
  return (
    <div className="relative flex items-center mb-10 mx-3">
      <input
        type="text"
        placeholder="Search by title"
        className="pl-10 pr-3 py-2 w-full border border-gray-800 rounded-lg focus:border-black focus:ring-black focus:outline-none focus:ring focus:ring-opacity-40 dark:border-neutral-400 dark:focus:border-neutral-500 dark:focus:ring-neutral-400 dark:bg-neutral-700 dark:placeholder:text-gray-50"
        // value={search}
        // onChange={(e) => setSearch(e.target.value.trimStart())}
      />
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none scale-110" />
    </div>
  );
};

export default SearchBar;
