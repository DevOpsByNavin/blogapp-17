import { Router } from "express";
import * as userController from "../controllers/userController";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

const router = Router();

// Protect user creation route with Clerk middleware
router.post("/", ClerkExpressRequireAuth(), userController.addUser);
router.get("/", ClerkExpressRequireAuth(), userController.getUserById);

export default router;
