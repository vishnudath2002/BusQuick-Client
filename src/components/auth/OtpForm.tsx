import React, { useState, useEffect } from 'react';
import OtpInput from 'react-otp-input';

interface OtpFormProps {
  onSubmit: (otp: string) => void;
  onResend: () => void;
}

const OtpForm: React.FC<OtpFormProps> = ({ onSubmit, onResend }) => {
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(() => {
    const savedTime = localStorage.getItem('otpTimer');
    const savedTimestamp = localStorage.getItem('otpTimestamp');

    if (savedTime && savedTimestamp) {
      const elapsedTime = Math.floor((Date.now() - Number(savedTimestamp)) / 1000);
      const remainingTime = Math.max(0, Number(savedTime) - elapsedTime);
      return remainingTime;
    }
    return 60; 
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1;
          localStorage.setItem('otpTimer', newTime.toString());
          localStorage.setItem('otpTimestamp', Date.now().toString());
          return newTime;
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^\d{6}$/.test(otp)) {
      setError('OTP must be exactly 6 digits.');
      return;
    }

    setError(null);
    onSubmit(otp);
  };

  const handleResend = () => {
    localStorage.setItem("newOtpRequest", "true");
    onResend();
    setTimeLeft(60);
    localStorage.setItem('otpTimer', '60');
    localStorage.setItem('otpTimestamp', Date.now().toString());
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Verify Your Email</h2>
              <p className="mt-2 text-sm text-gray-600">
                We've sent a code to your email. Please enter it below.
              </p>
            </div>

            <div className="mt-8 space-y-6">
              <div className="flex justify-center items-center">
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={6}
                  renderSeparator={<span className="w-6"></span>}
                  renderInput={(props) => (
                    <input
                      {...props}
                      className="w-[70px] h-[70px] border-2 border-gray-300 rounded-lg text-center text-3xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                  )}
                  containerStyle="flex justify-center gap-3"
                />
              </div>

              {/* Error Message */}
              {error && <div className="text-red-500 text-center text-sm mt-2">{error}</div>}

              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  Time left:{' '}
                  <span className="text-red-500 font-bold">
                    {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? '0' : ''}
                    {timeLeft % 60}
                  </span>
                </p>
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  disabled={timeLeft === 0}
                >
                  Verify
                </button>
              </div>

              {/* Resend Code */}
              <div className="text-center">
                {timeLeft === 0 && (
                  <p className="text-sm text-gray-600">
                    Didn't receive the code?{' '}
                    <button
                      type="button"
                      className="text-indigo-600 hover:text-indigo-500 font-medium"
                      onClick={handleResend}
                    >
                      Resend
                    </button>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Illustration */}
        <div className="hidden lg:flex lg:w-1/2 bg-indigo-50 items-center justify-center">
          <svg className="w-3/4 h-auto" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="200" cy="200" r="180" fill="#EEF2FF" />
            <path d="M100 140H300V280H100V140Z" fill="#C7D2FE" stroke="#4F46E5" strokeWidth="4" />
            <path d="M100 140L200 200L300 140" stroke="#4F46E5" strokeWidth="4" fill="#DDD6FE" />
            <rect x="180" y="190" width="40" height="50" rx="4" fill="#4F46E5" />
            <circle cx="200" cy="210" r="8" fill="#EEF2FF" />
            <rect x="196" y="215" width="8" height="15" fill="#EEF2FF" />
            <text x="130" y="320" fill="#4F46E5" fontSize="24" fontWeight="bold">#</text>
            <text x="190" y="320" fill="#4F46E5" fontSize="24" fontWeight="bold">*</text>
            <text x="250" y="320" fill="#4F46E5" fontSize="24" fontWeight="bold">#</text>
          </svg>
        </div>
      </div>
    </form>
  );
};

export default OtpForm;
