import { Router } from "express";
import passport from "passport";
import authController from "./auth.controller";

const authRouter = Router();

authRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
    session: true,
  }),
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/v1/auth/failed",
    session: true,
    accessType: "offline",
    prompt: "consent",
  }),
  authController.oauthCallback,
);

authRouter.get("/me", authController.getCurrentUser);
authRouter.post("/logout", authController.logout);
authRouter.get("/failed", authController.oauthFailed);

export default authRouter;
