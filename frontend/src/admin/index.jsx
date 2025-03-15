import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('users'); // Tabs: 'users' or 'resumes'
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'user',
  });
  const [errors, setErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    role: 'all', // 'all', 'user', 'admin'
  });
  const [resumeFilters, setResumeFilters] = useState({
    user: '',
    uploadDate: '',
    status: '',
    atsScoreRange: { min: 0, max: 100 },
  });
  const [selectedResumes, setSelectedResumes] = useState([]);

  useEffect(() => {
    if (user) {
      fetchUsers();
      fetchResumes();
    }
  }, [user]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const response = await axios.get('http://localhost:5000/api/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setUsers(response.data.data);
      console.log('CheckUsers:', user);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const response = await axios.get('http://localhost:5000/api/admin/resumes', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('Resumes:', response.data.data);
      setResumes(response.data.data);
      // console.log('Resumes:', response.data.data);
      
    } catch (error) {
      console.error('Error fetching resumes:', error);
      toast.error('Failed to fetch resumes');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (userId) => {
    navigate(`/admin/users/${userId}/edit`);
  };

  const handleDeleteUser = async (userId) => {
    try {
      const token = await getToken();
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const handleCreateUser = async () => {
    setErrors({});

    if (!newUser.email) setErrors((prev) => ({ ...prev, email: 'Email is required' }));
    if (!newUser.password) setErrors((prev) => ({ ...prev, password: 'Password is required' }));
    if (!newUser.fullName) setErrors((prev) => ({ ...prev, fullName: 'Full name is required' }));
    if (!newUser.role) setErrors((prev) => ({ ...prev, role: 'Role is required' }));

    if (Object.keys(errors).length > 0) return;

    try {
      const token = await getToken();
      const response = await axios.post(
        'http://localhost:5000/api/admin/users',
        { ...newUser },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 201) {
        toast.success('User created successfully');
        setShowCreateUserModal(false);
        setNewUser({ email: '', password: '', fullName: '', role: 'user' });
        fetchUsers();
      } else {
        toast.error(response.data.message || 'Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to create user. Please try again.');
      }
    }
  };

  const handleDownloadResume = (resumeId, format) => {
    // Implement download logic here
    toast.success(`Downloading resume ${resumeId} in ${format} format`);
  };

  const handleBulkDownload = () => {
    if (selectedResumes.length === 0) {
      toast.error('No resumes selected for download');
      return;
    }
    // Implement bulk download logic here
    toast.success(`Downloading ${selectedResumes.length} resumes`);
  };

  const handleDeleteResume = async (resumeId) => {
    try {
      const token = await getToken();
      await axios.delete(`http://localhost:5000/api/admin/resumes/${resumeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Resume deleted successfully');
      fetchResumes();
    } catch (error) {
      console.error('Error deleting resume:', error);
      toast.error('Failed to delete resume');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedResumes.length === 0) {
      toast.error('No resumes selected for deletion');
      return;
    }
    try {
      const token = await getToken();
      await axios.post(
        'http://localhost:5000/api/admin/resumes/bulk-delete',
        { resumeIds: selectedResumes },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(`${selectedResumes.length} resumes deleted successfully`);
      fetchResumes();
      setSelectedResumes([]);
    } catch (error) {
      console.error('Error deleting resumes:', error);
      toast.error('Failed to delete resumes');
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = filters.role === 'all' || user.role === filters.role;

    return matchesSearch && matchesRole;
  });

  const filteredResumes = resumes.filter((resume) => {
    const matchesSearch = resume.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          resume.userName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesUser = !resumeFilters.user || resume.userName === resumeFilters.user;
    const matchesUploadDate = !resumeFilters.uploadDate || resume.uploadDate === resumeFilters.uploadDate;
    const matchesStatus = !resumeFilters.status || resume.status === resumeFilters.status;
    const matchesAtsScore = resume.atsScore >= resumeFilters.atsScoreRange.min &&
                            resume.atsScore <= resumeFilters.atsScoreRange.max;

    return matchesSearch && matchesUser && matchesUploadDate && matchesStatus && matchesAtsScore;
  });

  return (
    <div className='p-8 bg-gray-50 min-h-screen'>
      <div className='max-w-7xl mx-auto'>
        <h1 className='text-3xl font-bold text-gray-900 mb-8'>Admin Dashboard</h1>
        <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
          <h2 className='text-xl font-semibold text-gray-900 mb-4'>Welcome, {user?.fullName}</h2>
          <p className='text-gray-600'>You have access to admin-specific features.</p>

          {/* Tabs */}
          <div className='flex gap-4 mb-6'>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-md ${activeTab === 'users' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('resumes')}
              className={`px-4 py-2 rounded-md ${activeTab === 'resumes' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Resume Management
            </button>
          </div>

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className='mt-6'>
              <div className='flex justify-between items-center mb-4'>
                <h3 className='text-xl font-semibold text-gray-900'>Users</h3>
                <button
                  onClick={() => setShowCreateUserModal(true)}
                  className='bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500'
                >
                  Add User
                </button>
              </div>

              {/* Search Bar and Filters */}
              <div className='flex gap-4 mb-6'>
                <input
                  type='text'
                  placeholder='Search users...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  style={{ maxWidth: '300px' }}
                />
                <select
                  value={filters.role}
                  onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                  className='p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value='all'>All Roles</option>
                  <option value='user'>User</option>
                  <option value='admin'>Admin</option>
                </select>
              </div>

              {/* Display Users */}
              {loading ? (
                <p>Loading...</p>
              ) : filteredUsers.length > 0 ? (
                <table className='w-full border-collapse'>
                  <thead>
                    <tr className='bg-gray-100'>
                      <th className='p-3 text-left'>Name</th>
                      <th className='p-3 text-left'>Email</th>
                      <th className='p-3 text-left'>Role</th>
                      <th className='p-3 text-left'>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className='border-b'>
                        <td className='p-3'>{user.fullName}</td>
                        <td className='p-3'>{user.email}</td>
                        <td className='p-3'>{user.role}</td>
                        <td className='p-3'>
                          <button
                            onClick={() => handleEditUser(user.id)}
                            className='bg-blue-500 text-white px-3 py-1 rounded-md mr-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className='bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500'
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No users found.</p>
              )}
            </div>
          )}

          {/* Resume Management Tab */}
          {activeTab === 'resumes' && (
            <div className='mt-6'>
              <h3 className='text-xl font-semibold text-gray-900 mb-4'>Resume Management</h3>

              {/* Search Bar and Filters */}
              <div className='flex gap-4 mb-6'>
                <input
                  type='text'
                  placeholder='Search resumes...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  style={{ maxWidth: '300px' }}
                />
                <select
                  value={resumeFilters.user}
                  onChange={(e) => setResumeFilters({ ...resumeFilters, user: e.target.value })}
                  className='p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value=''>All Users</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.fullName}>
                      {user.fullName}
                    </option>
                  ))}
                </select>
                <input
                  type='date'
                  value={resumeFilters.uploadDate}
                  onChange={(e) => setResumeFilters({ ...resumeFilters, uploadDate: e.target.value })}
                  className='p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
                <select
                  value={resumeFilters.status}
                  onChange={(e) => setResumeFilters({ ...resumeFilters, status: e.target.value })}
                  className='p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value=''>All Statuses</option>
                  <option value='pending'>Pending</option>
                  <option value='approved'>Approved</option>
                  <option value='rejected'>Rejected</option>
                </select>
                <input
                  type='number'
                  placeholder='Min ATS Score'
                  value={resumeFilters.atsScoreRange.min}
                  onChange={(e) =>
                    setResumeFilters({
                      ...resumeFilters,
                      atsScoreRange: { ...resumeFilters.atsScoreRange, min: e.target.value },
                    })
                  }
                  className='p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
                <input
                  type='number'
                  placeholder='Max ATS Score'
                  value={resumeFilters.atsScoreRange.max}
                  onChange={(e) =>
                    setResumeFilters({
                      ...resumeFilters,
                      atsScoreRange: { ...resumeFilters.atsScoreRange, max: e.target.value },
                    })
                  }
                  className='p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>

              {/* Bulk Actions */}
              <div className='flex gap-4 mb-6'>
                <button
                  onClick={handleBulkDownload}
                  className='bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500'
                >
                  Bulk Download
                </button>
                <button
                  onClick={handleBulkDelete}
                  className='bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500'
                >
                  Bulk Delete
                </button>
              </div>

              {/* Display Resumes */}
              {loading ? (
                <p>Loading...</p>
              ) : filteredResumes.length > 0 ? (
                <table className='w-full border-collapse'>
                  <thead>
                    <tr className='bg-gray-100'>
                      <th className='p-3 text-left'>
                        <input
                          type='checkbox'
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedResumes(filteredResumes.map((resume) => resume.id));
                            } else {
                              setSelectedResumes([]);
                            }
                          }}
                        />
                      </th>
                      <th className='p-3 text-left'>Title</th>
                      <th className='p-3 text-left'>User Name</th>
                      <th className='p-3 text-left'>Upload Date</th>
                      <th className='p-3 text-left'>Status</th>
                      <th className='p-3 text-left'>ATS Score</th>
                      <th className='p-3 text-left'>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredResumes.map((resume) => (
                      <tr key={resume.id} className='border-b'>
                        <td className='p-3'>
                          <input
                            type='checkbox'
                            checked={selectedResumes.includes(resume.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedResumes([...selectedResumes, resume.id]);
                              } else {
                                setSelectedResumes(selectedResumes.filter((id) => id !== resume.id));
                              }
                            }}
                          />
                        </td>
                        <td className='p-3'>{resume.title}</td>
                        <td className='p-3'>{resume.userName}</td>
                        <td className='p-3'>{resume.uploadDate}</td>
                        <td className='p-3'>{resume.status}</td>
                        <td className='p-3'>{resume.atsScore}</td>
                        <td className='p-3'>
                          <button
                            onClick={() => handleDownloadResume(resume.id, 'PDF')}
                            className='bg-blue-500 text-white px-3 py-1 rounded-md mr-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
                          >
                            Download PDF
                          </button>
                          <button
                            onClick={() => handleDeleteResume(resume.id)}
                            className='bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500'
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No resumes found.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateUserModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'>
          <div className='bg-white p-6 rounded-xl w-96'>
            <h2 className='text-xl font-semibold mb-4'>Create User</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateUser();
              }}
            >
              <div className='mb-4'>
                <label className='block text-gray-700'>Full Name</label>
                <input
                  type='text'
                  value={newUser.fullName}
                  onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                  className='w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  required
                />
                {errors.fullName && <p className='text-red-500 text-sm'>{errors.fullName}</p>}
              </div>
              <div className='mb-4'>
                <label className='block text-gray-700'>Email</label>
                <input
                  type='email'
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className='w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  required
                />
                {errors.email && <p className='text-red-500 text-sm'>{errors.email}</p>}
              </div>
              <div className='mb-4'>
                <label className='block text-gray-700'>Password</label>
                <input
                  type='password'
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className='w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  required
                />
                {errors.password && <p className='text-red-500 text-sm'>{errors.password}</p>}
              </div>
              <div className='mb-4'>
                <label className='block text-gray-700'>Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className='w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value='user'>User</option>
                  <option value='admin'>Admin</option>
                </select>
                {errors.role && <p className='text-red-500 text-sm'>{errors.role}</p>}
              </div>
              <div className='flex justify-end'>
                <button
                  type='button'
                  onClick={() => setShowCreateUserModal(false)}
                  className='bg-gray-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500'
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;