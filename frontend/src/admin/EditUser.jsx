import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { toast } from 'sonner';

function EditUser() {
  const { userId } = useParams(); // Get the user ID from the URL
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  // Fetch the user details
  const fetchUser = async () => {
    try {
      const token = await getToken();
      const response = await axios.get(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setUser(response.data.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      toast.error('Failed to fetch user details');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await getToken();
      await axios.put(
        `http://localhost:5000/api/admin/users/${userId}`,
        { ...user }, // Send updated user data
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      toast.success('User updated successfully');
      navigate('/admin/dashboard'); // Redirect to the admin dashboard
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className='p-8 bg-gray-50 min-h-screen'>
      <div className='max-w-7xl mx-auto'>
        <h1 className='text-3xl font-bold text-gray-900 mb-8'>Edit User</h1>
        <form onSubmit={handleSubmit} className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
          <div className='mb-4'>
            <label className='block text-gray-700'>Name</label>
            <input
              type='text'
              value={user.fullName || ''}
              onChange={(e) => setUser({ ...user, fullName: e.target.value })}
              className='w-full p-2 border rounded-md'
            />
          </div>
          <div className='mb-4'>
            <label className='block text-gray-700'>Email</label>
            <input
              type='email'
              value={user.email || ''}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className='w-full p-2 border rounded-md'
            />
          </div>
          <div className='mb-4'>
            <label className='block text-gray-700'>Role</label>
            <select
              value={user.role || 'user'}
              onChange={(e) => setUser({ ...user, role: e.target.value })}
              className='w-full p-2 border rounded-md'
            >
              <option value='user'>User</option>
              <option value='admin'>Admin</option>
            </select>
          </div>
          <button type='submit' className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'>
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditUser;