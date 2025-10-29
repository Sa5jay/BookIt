import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
// Use built-in fetch instead of axios to avoid adding a new dependency
import { ArrowLeft } from 'lucide-react';

import Header from '../components/Header';
import BookingCard from '../components/BookingCard';
import SlotSelector, { type Slot } from '../components/SlotSelector'; // Import Slot type

// Define the shape of the full experience object
type Experience = {
  _id: string;
  title: string;
  imageUrl: string;
  description: string;
  about: string;
  basePrice: number;
  slots: Slot[];
};

const DetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get ID from URL
  const navigate = useNavigate();

  // State for the page
  const [experience, setExperience] = useState<Experience | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/experiences/${id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as Experience;
        setExperience(data);

        // Set default selected date if slots are available
        if (data.slots && data.slots.length > 0) {
          const uniqueDates = [...new Set(data.slots.map((s: Slot) => s.date))];
          setSelectedDate(uniqueDates[0]);
        }
      } catch (err) {
        console.error('Error fetching details:', err);
      }
    };
    void fetchExperience();
  }, [id]);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime(null); // Reset time when date changes
  };
  
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleConfirmBooking = () => {
    const subtotal = (experience?.basePrice || 0) * quantity;
    const taxes = 50 * quantity; // Assuming 50 per person
    const total = subtotal + taxes;

    // Navigate to checkout, passing all necessary data in the 'state' object
    navigate('/checkout', {
      state: {
        experienceTitle: experience?.title,
        date: selectedDate,
        time: selectedTime,
        quantity: quantity,
        subtotal: subtotal,
        taxes: taxes,
        total: total,
        experienceId: experience?._id
      },
    });
  };

  if (!experience) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto py-8 px-4 text-center">
          <p className="text-lg">Loading details...</p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={18} />
          Details
        </Link>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-6">
            <img
              src={experience.imageUrl}
              alt={experience.title}
              className="w-full h-96 object-cover rounded-lg shadow-md"
            />
            <h1 className="text-4xl font-bold">{experience.title}</h1>
            <p className="text-gray-700 text-lg">{experience.description}</p>
            
            <hr />

            <SlotSelector
              slots={experience.slots}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onDateSelect={handleDateSelect}
              onTimeSelect={handleTimeSelect}
            />
            
            <hr />

            <div>
              <h3 className="text-lg font-semibold mb-3">About</h3>
              <p className="text-gray-700">{experience.about}</p>
            </div>
          </div>

          {/* Right Column: Booking Card */}
          <div className="lg:col-span-1 mt-8 lg:mt-0">
            <BookingCard
              basePrice={experience.basePrice}
              quantity={quantity}
              onQuantityChange={setQuantity}
              onSubmit={handleConfirmBooking}
              isSlotSelected={!!selectedDate && !!selectedTime}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DetailsPage;