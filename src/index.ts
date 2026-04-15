import express, { Express } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import dotenv from "dotenv";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRouter from "./modules/auth/auth.routes";
import session from "express-session";
import passport from "passport";
import cors from "cors";

import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { config } from "./config";
import authService from "./modules/auth/auth.service";

const app: Express = express();

dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
});
app.use(limiter);
app.use(helmet());

app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));

app.use(morgan("dev"));

app.use(
  session({
    secret: config.base.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: config.base.enviroment === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user as any);
});

const googleVerify: any = async (
  _issuer: any,
  profile: any,
  _context: any,
  _idToken: any,
  accessToken: string,
  refreshToken: string,
  params: any,
  done: any,
) => {
  try {
    console.log("profile from google", profile);
    const email = profile?.emails?.[0]?.value ?? null;
    const displayName = profile?.displayName ?? null;
    const user = await authService.upsertOAuthUser({
      provider: "google",
      providerAccountId: profile?.id,
      email,
      displayName,
      accessToken,
      refreshToken,
      expiresIn: params?.expires_in ?? null,
    });

    return done(null, user);
  } catch (error) {
    return done(error);
  }
};

passport.use(
  new GoogleStrategy(
    {
      clientID: config.oauth.clientId!,
      clientSecret: config.oauth.clientSecret!,
      callbackURL: config.oauth.callback,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("ACCESS:", profile);

        const user = await authService.upsertOAuthUser({
          provider: "google",
          providerAccountId: profile.id,
          email: profile.emails?.[0]?.value ?? "abc@gmail.com ",
          displayName: profile.displayName,
          accessToken,
          refreshToken,
        });

        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    },
  ),
);

app.use(compression());
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong" });
});
app.use(cookieParser());

const port = process.env.PORT || 4001;

app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));

app.use("/api/v1/auth", authRouter);

export default app;
