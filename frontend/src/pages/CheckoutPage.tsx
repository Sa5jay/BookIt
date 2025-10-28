import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
// Use built-in fetch to avoid adding axios as a dependency
import { ArrowLeft } from 'lucide-react';
import Header from '../components/Header';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get booking details from the navigation state
  const {
    experienceTitle,
    date,
    time,
    quantity,
    subtotal,
    taxes,
    total,
    experienceId,
  } = location.state || {};

  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper to extract message from unknown errors (avoid using `any`)
  const getErrorMessage = (e: unknown, fallback: string) => {
    if (typeof e === 'object' && e !== null) {
      const obj = e as Record<string, unknown>;
      const resp = obj.response;
      if (typeof resp === 'object' && resp !== null) {
        const respObj = resp as Record<string, unknown>;
        const data = respObj.data;
        if (typeof data === 'object' && data !== null) {
          const dataObj = data as Record<string, unknown>;
          const msg = dataObj.message;
          if (typeof msg === 'string') return msg;
        }
      }
    }
    return fallback;
  };
  
  const handlePayAndConfirm = async () => {
    // 1. --- Frontend Validation ---
    if (!fullName || !email || !agreedToTerms) {
      alert('Please fill in all required fields and agree to the terms.');
      return;
    }
    
    setIsSubmitting(true);

    // 2. --- Prepare Backend Data ---
    const bookingDetails = {
      experienceId: experienceId,
      date: date,
      time: time,
      quantity: quantity,
      totalPrice: total,
      user: {
        fullName,
        email,
      },
    };
    
    // 3. --- Call API (POST /bookings) ---
    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingDetails),
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw errData ?? new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      const { refId } = data;
      navigate('/result', { state: { status: 'success', refId } });
    } catch (error: unknown) {
      const message = getErrorMessage(error, 'Booking failed. Please try again.');
      navigate('/result', { state: { status: 'failure', message } });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleApplyPromo = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/promo/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promoCode }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw errData ?? new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      if (data.valid) {
        alert('Promo code applied!'); // In a real app, you'd update the price
      }
    } catch (err: unknown) {
      alert(getErrorMessage(err, 'Invalid promo code'));
    }
  };

  if (!experienceTitle) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto py-8 px-4 text-center">
          <h1 className="text-2xl font-bold">Invalid Checkout Session</h1>
          <p className="mt-4">Please start your booking from the details page.</p>
          <Link to="/" className="mt-4 inline-block text-purple-600 hover:underline">
            Go to Home
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={18} />
          Checkout
        </button>

        {/* Main Grid: Form on left, Summary on right */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column: Form */}
          <div className="md:col-span-2 bg-gray-100 p-8 rounded-lg shadow-sm">
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                    Full name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-3"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-3"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="promoCode" className="block text-sm font-medium text-gray-700">
                  Promo code
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    id="promoCode"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 block w-full rounded-none rounded-l-md border-gray-300 focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-3"
                    placeholder="e.g. SAVE10"
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-800 px-4 py-2 text-sm font-bold text-white hover:bg-gray-700"
                  >
                    Apply
                  </button>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="font-medium text-gray-700">
                    I agree to the terms and safety policy
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Summary */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-4">Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Experience</span>
                  <span className="font-semibold">{experienceTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date</span>
                  <span className="font-semibold">{date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time</span>
                  <span className="font-semibold">{time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Qty</span>
                  <span className="font-semibold">{quantity}</span>
                </div>
                
                <hr className="my-2" />
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes</span>
                  <span className="font-semibold">₹{taxes}</span>
                </div>
                
                <hr className="my-2" />
                
                <div className="flex justify-between text-2xl font-bold">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <button
                onClick={handlePayAndConfirm}
                disabled={!agreedToTerms || !fullName || !email || isSubmitting}
                className="mt-6 w-full bg-yellow-400 text-gray-900 font-bold py-3 rounded-lg transition-colors hover:bg-yellow-500
                           disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Processing...' : 'Pay and Confirm'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;