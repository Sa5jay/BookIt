import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md border-t-4 border-purple-600">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="shrink-0 flex items-center">
            {/* You can replace this text with your actual logo */}
            <span className="font-bold text-2xl text-gray-800">
              Highway
              <span className="text-gray-500">delite</span>
            </span>
          </div>

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
                  className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  placeholder="Search experiences"
                  type="search"
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  <span className="sr-only">Search</span>
                </button>
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 flex items-center justify-center w-16 bg-yellow-400 text-gray-900 font-bold rounded-r-md hover:bg-yellow-500"
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