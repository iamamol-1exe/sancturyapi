import { NextFunction, Request, Response } from "express";

class AuthController {
  oauthCallback(req: Request, res: Response) {
    return res.status(200).json({ user: req.user ?? null });
  }

  oauthFailed(_req: Request, res: Response) {
    return res.status(401).json({ message: "OAuth authentication failed" });
  }

  getCurrentUser(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    return res.status(200).json({ user: req.user });
  }

  logout(req: Request, res: Response, next: NextFunction) {
    req.logout((err) => {
      if (err) {
        return next(err);
      }

      req.session?.destroy(() => {
        res.clearCookie("connect.sid");
        return res.status(204).send();
      });
    });
  }
}

export default new AuthController();
