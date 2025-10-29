import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import ExperienceCard from '../components/ExperienceCard';

// Define the Experience type
type Experience = {
  _id: string; // MongoDB uses _id
  title: string;
  location: string;
  description: string;
  basePrice: number;
  imageUrl: string;
};

const HomePage: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  
  // --- NEW: State for the search query ---
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/experiences`);
        setExperiences(res.data);
      } catch (err) {
        console.error('Error fetching experiences:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchExperiences();
  }, []);

  // --- NEW: Filter logic ---
  // This calculates the filtered list every time 'experiences' or 'searchQuery' changes
  const filteredExperiences = useMemo(() => {
    if (!searchQuery) {
      return experiences; // If search is empty, return all
    }
    
    return experiences.filter(exp => 
      exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [experiences, searchQuery]);

  // --- NEW: Handler for the search input ---
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Pass empty state to header on loading page */}
        <Header searchQuery="" onSearchChange={() => {}} />
        <main className="max-w-7xl mx-auto py-8 px-4 text-center">
          <p className="text-lg">Loading experiences...</p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* --- UPDATED: Pass state and handler to Header --- */}
      <Header 
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* --- UPDATED: Map over the filtered list --- */}
          {filteredExperiences.map((exp) => (
            <Link to={`/details/${exp._id}`} key={exp._id}>
              <ExperienceCard
                title={exp.title}
                location={exp.location}
                description={exp.description}
                price={exp.basePrice} // Match the model
                imageUrl={exp.imageUrl}
              />
            </Link>
          ))}
        </div>

        {/* --- NEW: Show a message if no results are found --- */}
        {!loading && filteredExperiences.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-700">No experiences found</h2>
            <p className="text-gray-500 mt-2">Try adjusting your search terms.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;