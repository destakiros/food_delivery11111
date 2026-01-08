
import React, { useState } from 'react';

interface AuthProps {
  mode: 'login' | 'register';
  setMode: (mode: 'login' | 'register') => void;
  onLogin: (email: string, pass: string) => void;
  onRegister: (name: string, email: string, phone: string, pass: string) => void;
  onBack?: () => void;
  // Fixed: Added loginError prop
  loginError?: string;
}

const Auth: React.FC<AuthProps> = ({ mode, setMode, onLogin, onRegister, onBack, loginError }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      onLogin(formData.email, formData.password);
    } else {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords don't match");
        return;
      }
      onRegister(formData.name, formData.email, formData.phone, formData.password);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex justify-center items-center py-16 px-4 bg-gray-50 min-h-[80vh]">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>

        {/* Display login error if present */}
        {loginError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl text-sm font-bold text-center">
            {loginError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
              <input 
                required
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition"
                placeholder="John Doe"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
            <input 
              required
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition"
              placeholder="name@example.com"
            />
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
              <input 
                required
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition"
                placeholder="000-000-0000"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input 
              required
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition"
              placeholder="••••••••"
            />
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm Password</label>
              <input 
                required
                type="password" 
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition"
                placeholder="••••••••"
              />
            </div>
          )}

          <button 
            type="submit"
            className="w-full bg-red-600 text-white py-3.5 rounded-xl font-bold hover:bg-red-700 transition transform hover:scale-[1.01] shadow-lg shadow-red-200"
          >
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t text-center space-y-4">
          <p className="text-gray-500">
            {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
            <button 
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="ml-2 text-red-600 font-bold hover:underline"
            >
              {mode === 'login' ? 'Register Now' : 'Login Here'}
            </button>
          </p>
          {onBack && (
            <button 
              onClick={onBack}
              className="text-gray-400 hover:text-gray-600 text-sm font-medium transition block w-full text-center"
            >
              ← Back to Home
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;