import React from 'react';
import { Link } from 'react-router-dom';

// Define the props our component will accept
type HeaderProps = {
  searchQuery?: string;
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const Header: React.FC<HeaderProps> = ({ searchQuery, onSearchChange }) => {
  // Check if the search props are provided.
  // This lets us reuse the header on other pages (like checkout)
  // without passing these props, and the search bar won't be interactive.
  const isSearchable = searchQuery !== undefined && onSearchChange !== undefined;

  return (
    <header className="bg-white shadow-md border-t-4 border-purple-600">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="shrink-0 flex items-center">
            <span className="font-bold text-xl sm:text-2xl text-gray-800">
              Highway
              <span className="text-gray-500">delite</span>
            </span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 flex justify-center px-2 lg:ml-6 lg:justify-end">
            <div className="max-w-lg w-full lg:max-w-xs">
              <label htmlFor="search" className="sr-only">
                Search
              </label>
              <div className="relative">
                <input
                  id="search"
                  name="search"
                  className="block w-full pl-3 pr-20 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  placeholder="Search experiences"
                  type="search"
                  // Wire up the input to our new props
                  value={isSearchable ? searchQuery : undefined}
                  onChange={isSearchable ? onSearchChange : undefined}
                  disabled={!isSearchable}
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 flex items-center justify-center w-16 bg-yellow-400 text-gray-900 font-bold rounded-r-md hover:bg-yellow-500"
                  disabled={!isSearchable}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;