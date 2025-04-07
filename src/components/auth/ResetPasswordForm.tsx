import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';


interface ResetPasswordProps {
  onSubmit: (newPassword: string) => void;
}

const ResetPasswordForm: React.FC<ResetPasswordProps> = ({ onSubmit }) => {
 
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [validations, setValidations] = useState({
    minLength: false,
    hasNumber: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasSpecialChar: false,
    passwordsMatch: false
  });

  useEffect(() => {
    setValidations({
      minLength: newPassword.length >= 6,
      hasNumber: /\d/.test(newPassword),
      hasUpperCase: /[A-Z]/.test(newPassword),
      hasLowerCase: /[a-z]/.test(newPassword),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
      passwordsMatch: newPassword === confirmPassword && newPassword !== ''
    });
  }, [newPassword, confirmPassword]);

  const isPasswordValid = Object.values(validations).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPasswordValid) {
      alert('Please meet all password requirements');
      return;
    }
    setIsLoading(true);
    try {
       onSubmit(newPassword);
    } finally {
      setIsLoading(false);
    }
  };

  const ValidationItem = ({ checked, text }: { checked: boolean; text: string }) => (
    <div className="flex items-center gap-2 text-sm">
      {checked ? 
        <Check className="w-4 h-4 text-green-500" /> : 
        <X className="w-4 h-4 text-red-500" />}
      <span className={checked ? "text-green-700" : "text-red-700"}>
        {text}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Set New Password</h2>
          <p className="text-slate-600 mt-2">
            Create a strong password that meets all requirements
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 
                  focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 
                  transition-all duration-300"
                placeholder="Enter new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl space-y-2">
            <ValidationItem checked={validations.minLength} text="Minimum 6 characters" />
            <ValidationItem checked={validations.hasUpperCase} text="At least one uppercase letter" />
            <ValidationItem checked={validations.hasLowerCase} text="At least one lowercase letter" />
            <ValidationItem checked={validations.hasNumber} text="At least one number" />
            <ValidationItem checked={validations.hasSpecialChar} text="At least one special character" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 
                  focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 
                  transition-all duration-300"
                placeholder="Confirm new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className="mt-2">
              <ValidationItem checked={validations.passwordsMatch} text="Passwords match" />
            </div>
          </div>

          <button
            type="submit"
            disabled={!isPasswordValid || isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 
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
                Updating...
              </span>
            ) : (
              'Reset Password'
            )}
          </button>

          <div className="text-center mt-6">
            <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
              Back to Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;