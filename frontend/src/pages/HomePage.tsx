import React, { useState, useEffect } from 'react';
// Use built-in fetch to avoid adding axios as a dependency
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        // Fetch data from your backend
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/experiences`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as Experience[];
        setExperiences(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching experiences:', err);
        setError((err as Error)?.message ?? 'Failed to fetch experiences');
      } finally {
        setLoading(false);
      }
    };
    fetchExperiences();
  }, []); // Empty dependency array means this runs once on mount

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto py-8 px-4 text-center">
          <p className="text-lg">Loading experiences...</p>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto py-8 px-4 text-center">
          <h1 className="text-2xl font-bold">Unable to load experiences</h1>
          <p className="mt-4 text-gray-600">{error}</p>
          <div className="mt-6">
            <button
              onClick={() => {
                setLoading(true);
                setError(null);
                // Retry fetch
                (async () => {
                  try {
                    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/experiences`);
                    if (!res.ok) throw new Error(`HTTP ${res.status}`);
                    const data = (await res.json()) as Experience[];
                    setExperiences(data);
                  } catch (e) {
                    setError((e as Error)?.message ?? 'Failed to fetch experiences');
                  } finally {
                    setLoading(false);
                  }
                })();
              }}
              className="mt-2 inline-flex items-center bg-yellow-400 text-gray-900 font-bold py-2 px-4 rounded"
            >
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {experiences.map((exp) => (
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
      </main>
    </div>
  );
};

export default HomePage;