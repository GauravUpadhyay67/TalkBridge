import express from 'express';
import { protectRoute } from '../middleware/authMiddleware.js';
import { acceptFriendRequest, getFriendRequests, getMyFriends, getOutgoingFriendReqs, getRecomendedUsers, sendFriendRequest } from '../controllers/userController.js';

const userRouter = express.Router();

// Apply auth middleware to all routes
userRouter.use(protectRoute)

userRouter.get('/', getRecomendedUsers)
userRouter.get('/friends', getMyFriends)
userRouter.post('/friend-request/:id', sendFriendRequest)
userRouter.put('/friend-request/:id/accept', acceptFriendRequest)
userRouter.get('/friend-requests', getFriendRequests)
userRouter.get('/outgoing-friend-requests', getOutgoingFriendReqs)


export default userRouter;