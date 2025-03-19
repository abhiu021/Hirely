import { getAuth } from '@clerk/express';

/**
 * Middleware to require authentication for protected routes
 * @param {Object} req - Express request object 
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const requireAuth = (req, res, next) => {
  try {
    // Get the authenticated user from Clerk
    const { userId } = getAuth(req);
    
    // If no user, return unauthorized
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required'
      });
    }
    
    // Add userId to request for downstream use if needed
    req.userId = userId;
    
    // Continue to the next middleware/route handler
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication failed', 
      error: error.message 
    });
  }
}; 