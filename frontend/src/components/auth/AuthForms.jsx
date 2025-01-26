import React from 'react';

export const LoginForm = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center">Sign In</h2>
        <form className="mt-8 space-y-6">
          <input type="email" placeholder="Email" className="w-full p-3 border rounded" />
          <input type="password" placeholder="Password" className="w-full p-3 border rounded" />
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export const SignupForm = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center">Create Account</h2>
        <form className="mt-8 space-y-6">
          <input type="text" placeholder="Full Name" className="w-full p-3 border rounded" />
          <input type="email" placeholder="Email" className="w-full p-3 border rounded" />
          <input type="password" placeholder="Password" className="w-full p-3 border rounded" />
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};