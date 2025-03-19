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
      const response = await axios.get('https://hirely-78iq.onrender.com/api/admin/users', {
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
      const response = await axios.get('https://hirely-78iq.onrender.com/api/admin/resumes', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('API Response:', response);
      console.log('Resumes Data:', response.data);
      
      // Check if the data is in the expected format
      if (response.data && Array.isArray(response.data.data)) {
        setResumes(response.data.data);
        console.log('Set Resumes:', response.data.data);
      } else {
        console.error('Unexpected data format:', response.data);
        setResumes([]);
        toast.error('Invalid resume data format received');
      }
    } catch (error) {
      console.error('Error fetching resumes:', error);
      setResumes([]);
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
      await axios.delete(`https://hirely-78iq.onrender.com/api/admin/users/${userId}`, {
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
        'https://hirely-78iq.onrender.com/api/admin/users',
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

  const handleDeleteResume = async (resumeId) => {
    try {
      const token = await getToken();
      await axios.delete(`https://hirely-78iq.onrender.com/api/admin/resumes/${resumeId}`, {
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
        'https://hirely-78iq.onrender.com/api/admin/resumes/bulk-delete',
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
    // Log each resume being filtered
    console.log('Filtering resume:', resume);
    
    // Basic validation of resume object
    if (!resume || typeof resume !== 'object') {
      console.log('Invalid resume object:', resume);
      return false;
    }

    const matchesSearch = !searchQuery || 
      (resume.title && resume.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (resume.userName && resume.userName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesUser = !resumeFilters.user || 
      (resume.userName && resume.userName === resumeFilters.user);
    
    const matchesUploadDate = !resumeFilters.uploadDate || 
      (resume.uploadDate && resume.uploadDate === resumeFilters.uploadDate);
    
    const matchesStatus = !resumeFilters.status || 
      (resume.status && resume.status === resumeFilters.status);
    
    const matchesAtsScore = !resume.atsScore || 
      (resume.atsScore >= resumeFilters.atsScoreRange.min &&
       resume.atsScore <= resumeFilters.atsScoreRange.max);

    const shouldInclude = matchesSearch && matchesUser && matchesUploadDate && matchesStatus && matchesAtsScore;
    console.log('Resume included:', shouldInclude, 'for resume:', resume.title);
    
    return shouldInclude;
  });

  // Add useEffect to log state changes
  useEffect(() => {
    console.log('Current resumes state:', resumes);
    console.log('Current filtered resumes:', filteredResumes);
    console.log('Current filters:', resumeFilters);
    console.log('Current search query:', searchQuery);
  }, [resumes, filteredResumes, resumeFilters, searchQuery]);

  console.log('Filtered Resumes:', filteredResumes);

  return (
    <div className="font-roboto min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 overflow-hidden">
      <div className="relative w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        {/* Background decorative elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Admin Dashboard
          </h1>
          
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Welcome, {user?.fullName}</h2>
            <p className="text-gray-600 mb-8">You have access to admin-specific features.</p>

            {/* Tabs */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={() => setActiveTab('users')}
                className={`px-6 py-2.5 rounded-full transition-all duration-200 ${
                  activeTab === 'users' 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                Users
              </button>
              <button
                onClick={() => setActiveTab('resumes')}
                className={`px-6 py-2.5 rounded-full transition-all duration-200 ${
                  activeTab === 'resumes' 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                Resume Management
              </button>
            </div>

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Users</h3>

                {/* Search Bar and Filters */}
                <div className="flex flex-wrap gap-4 mb-6">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                    style={{ maxWidth: '300px' }}
                  />
                  <select
                    value={filters.role}
                    onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                    className="p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="all">All Roles</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button
                    onClick={() => setShowCreateUserModal(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/20 ml-auto"
                  >
                    Add User
                  </button>
                </div>

                {/* Display Users */}
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : filteredUsers.length > 0 ? (
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="p-4 text-left text-sm font-medium text-gray-600">Name</th>
                          <th className="p-4 text-left text-sm font-medium text-gray-600">Email</th>
                          <th className="p-4 text-left text-sm font-medium text-gray-600">Role</th>
                          <th className="p-4 text-left text-sm font-medium text-gray-600">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user) => (
                          <tr key={user.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                            <td className="p-4">{user.fullName}</td>
                            <td className="p-4">{user.email}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                user.role === 'admin' 
                                  ? 'bg-purple-100 text-purple-700' 
                                  : 'bg-blue-100 text-blue-700'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="p-4">
                              <button
                                onClick={() => handleEditUser(user.id)}
                                className="bg-blue-500 text-white px-4 py-1.5 rounded-lg mr-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="bg-red-500 text-white px-4 py-1.5 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No users found.</p>
                  </div>
                )}
              </div>
            )}

            {/* Resume Management Tab */}
            {activeTab === 'resumes' && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Resume Management</h3>

                {/* Search Bar and Filters */}
                <div className="flex flex-wrap gap-4 mb-6">
                  <input
                    type="text"
                    placeholder="Search resumes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                    style={{ maxWidth: '300px' }}
                  />
                  <select
                    value={resumeFilters.user}
                    onChange={(e) => setResumeFilters({ ...resumeFilters, user: e.target.value })}
                    className="p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="">All Users</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.fullName}>
                        {user.fullName}
                      </option>
                    ))}
                  </select>
                  <input
                    type="date"
                    value={resumeFilters.uploadDate}
                    onChange={(e) => setResumeFilters({ ...resumeFilters, uploadDate: e.target.value })}
                    className="p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                  />
                  <select
                    value={resumeFilters.status}
                    onChange={(e) => setResumeFilters({ ...resumeFilters, status: e.target.value })}
                    className="p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min ATS Score"
                      value={resumeFilters.atsScoreRange.min}
                      onChange={(e) =>
                        setResumeFilters({
                          ...resumeFilters,
                          atsScoreRange: { ...resumeFilters.atsScoreRange, min: e.target.value },
                        })
                      }
                      className="p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 w-32"
                    />
                    <input
                      type="number"
                      placeholder="Max ATS Score"
                      value={resumeFilters.atsScoreRange.max}
                      onChange={(e) =>
                        setResumeFilters({
                          ...resumeFilters,
                          atsScoreRange: { ...resumeFilters.atsScoreRange, max: e.target.value },
                        })
                      }
                      className="p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 w-32"
                    />
                  </div>
                </div>

                {/* Bulk Actions */}
                <div className="flex gap-4 mb-6">
                  <button
                    onClick={handleBulkDelete}
                    className="bg-red-500 text-white px-6 py-2.5 rounded-full hover:bg-red-600 transition-all duration-200 shadow-lg shadow-red-500/20"
                  >
                    Bulk Delete
                  </button>
                </div>

                {/* Display Resumes */}
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : filteredResumes.length > 0 ? (
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="p-4 text-left">
                            <input
                              type="checkbox"
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedResumes(filteredResumes.map((resume) => resume._id));
                                } else {
                                  setSelectedResumes([]);
                                }
                              }}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500/20"
                            />
                          </th>
                          <th className="p-4 text-left text-sm font-medium text-gray-600">Title</th>
                          <th className="p-4 text-left text-sm font-medium text-gray-600">User Name</th>
                          <th className="p-4 text-left text-sm font-medium text-gray-600">Upload Date</th>
                          <th className="p-4 text-left text-sm font-medium text-gray-600">Status</th>
                          <th className="p-4 text-left text-sm font-medium text-gray-600">ATS Score</th>
                          <th className="p-4 text-left text-sm font-medium text-gray-600">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredResumes.map((resume) => (
                          <tr key={resume._id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                            <td className="p-4">
                              <input
                                type="checkbox"
                                checked={selectedResumes.includes(resume._id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedResumes([...selectedResumes, resume._id]);
                                  } else {
                                    setSelectedResumes(selectedResumes.filter((id) => id !== resume._id));
                                  }
                                }}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500/20"
                              />
                            </td>
                            <td className="p-4">{resume.title}</td>
                            <td className="p-4">{resume.userName}</td>
                            <td className="p-4">{resume.uploadDate}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                resume.status === 'approved' 
                                  ? 'bg-green-100 text-green-700'
                                  : resume.status === 'rejected'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                {resume.status}
                              </span>
                            </td>
                            <td className="p-4">{resume.atsScore}</td>
                            <td className="p-4">
                              <button
                                onClick={() => handleDeleteResume(resume.id)}
                                className="bg-red-500 text-white px-4 py-1.5 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No resumes found.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateUserModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Create User</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateUser();
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={newUser.fullName}
                    onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                    required
                  />
                  {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                    required
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                    required
                  />
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                  {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateUserModal(false)}
                  className="px-6 py-2.5 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/20"
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