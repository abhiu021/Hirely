// src/pages/ProfilePage.jsx
import React from "react";

const ProfilePage = () => {
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    linkedIn: "https://linkedin.com/in/johndoe",
    github: "https://github.com/johndoe",
  };

  return (
    <div className="container mx-auto py-10 px-6">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">{user.name}</h2>
        <p className="text-gray-600 mb-4">{user.email}</p>
        <div className="flex space-x-4">
          <a
            href={user.linkedIn}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            LinkedIn Profile
          </a>
          <a
            href={user.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:underline"
          >
            GitHub Profile
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
