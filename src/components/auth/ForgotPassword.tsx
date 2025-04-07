import React, { useState } from 'react';

interface ForgotPasswordProps {
  onSubmit: (email: string) => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
       onSubmit(email);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Reset Password</h2>
          <p className="text-slate-600 mt-2">
            Enter your email to receive password reset instructions
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 
                focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 
                transition-all duration-300"
              placeholder="Enter your email"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full  bg-[#007074] from-blue-500 to-blue-600 
              text-white py-3 px-6 rounded-xl font-semibold
              hover:-translate-y-0.5 hover:shadow-lg 
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-300"
          >
            {isLoading ? (
              <span className="inline-flex items-center">
                <svg className="w-5 h-5 mr-2 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Processing...
              </span>
            ) : (
              'Send Reset Instructions'
            )}
          </button>

          <div className="text-center mt-6">
            <a href="/login" className="text-sm text-blue-600 hover:text-blue-700">
              Back to Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;