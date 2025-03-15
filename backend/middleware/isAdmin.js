import { clerkClient, getAuth } from '@clerk/express';

export const isAdmin = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);

    // Fetch the user details from Clerk
    const user = await clerkClient.users.getUser(userId);

    // Check if the user has the 'admin' role in public metadata
    if (user.publicMetadata.role === 'admin') {
      next(); // User is an admin, proceed to the next middleware/route
    } else {
      res.status(403).json({ message: 'Access denied. Admin role required.' });
    }
  } catch (error) {
    console.error('Error checking admin role:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};