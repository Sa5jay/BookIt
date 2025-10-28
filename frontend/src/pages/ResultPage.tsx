import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import Header from '../components/Header';

const ResultPage: React.FC = () => {
  const location = useLocation();
  const { status, refId, message } = location.state || {};

  const isSuccess = status === 'success';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {isSuccess ? (
            <>
              <CheckCircle className="text-green-500 h-20 w-20" />
              <h1 className="mt-6 text-4xl font-extrabold text-gray-900">
                Booking Confirmed
              </h1>
              <p className="mt-2 text-lg text-gray-500">
                Ref ID: <span className="font-medium text-gray-900">{refId}</span>
              </p>
            </>
          ) : (
            <>
              <XCircle className="text-red-500 h-20 w-20" />
              <h1 className="mt-6 text-4xl font-extrabold text-gray-900">
                Booking Failed
              </h1>
              <p className="mt-2 text-lg text-gray-500">
                {message || 'An unexpected error occurred. Please try again.'}
              </p>
            </>
          )}

          <Link
            to="/"
            className="mt-8 inline-flex items-center rounded-md border border-transparent bg-gray-200 px-6 py-3 text-base font-medium text-gray-800 shadow-sm hover:bg-gray-300"
          >
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
};

export default ResultPage;