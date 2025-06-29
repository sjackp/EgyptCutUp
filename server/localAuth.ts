import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import bcrypt from "bcrypt";

// Simple admin credentials - in production, this would be from database
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "$2b$10$8K1p/a4l5N3/y4x7FVgUDeZOGfhCv9d0Q1xz2Y/ZhOL4FnQWJ1.6u" // hashed "admin123"
};

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET || "egcu-racing-secret-key",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      maxAge: sessionTtl,
    },
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure local strategy
  passport.use(new LocalStrategy(
    async (username: string, password: string, done) => {
      try {
        if (username === ADMIN_CREDENTIALS.username) {
          const isValid = await bcrypt.compare(password, ADMIN_CREDENTIALS.password);
          if (isValid) {
            return done(null, { id: 1, username: "admin", role: "admin" });
          }
        }
        return done(null, false, { message: "Invalid credentials" });
      } catch (error) {
        return done(error);
      }
    }
  ));

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id: number, done) => {
    // Simple user object for admin
    done(null, { id: 1, username: "admin", role: "admin" });
  });

  // Login route
  app.post("/api/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login?error=invalid",
  }));

  // Logout route
  app.post("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.redirect("/");
    });
  });

  // Check auth status
  app.get("/api/auth/user", (req, res) => {
    if (req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  });
}

export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};