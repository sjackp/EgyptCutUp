import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import express, { type Express, type RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import bcrypt from "bcrypt";
import { storage } from "./storage";

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: sessionTtl / 1000, // Convert to seconds for pg store
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET || "egcu-racing-secret-key",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: sessionTtl,
      sameSite: 'lax',
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
        console.log("Auth strategy - username:", username);
        console.log("Auth strategy - password:", password);
        const admin = await storage.getAdminByUsername(username);
        console.log("Found admin:", admin ? 'yes' : 'no');
        if (admin) {
          console.log("Stored hash:", admin.password);
          const isValid = await bcrypt.compare(password, admin.password);
          console.log("Password valid:", isValid);
          if (isValid) {
            return done(null, { id: admin.id, username: admin.username, role: "admin" });
          }
        }
        return done(null, false, { message: "Invalid credentials" });
      } catch (error) {
        console.error("Auth strategy error:", error);
        return done(error);
      }
    }
  ));

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      // Return basic admin object - could fetch from DB if needed
      done(null, { id, username: "admin", role: "admin" });
    } catch (error) {
      done(error);
    }
  });

  // Login route
  app.post("/api/login", (req, res, next) => {
    console.log("Login attempt - raw body:", req.body);
    console.log("Content-Type:", req.headers['content-type']);
    console.log("Request method:", req.method);
    
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        console.error("Login error:", err);
        return res.status(500).json({ error: "Authentication failed" });
      }
      if (!user) {
        console.log("Login failed:", info?.message);
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      req.logIn(user, (err) => {
        if (err) {
          console.error("Session login error:", err);
          return res.status(500).json({ error: "Session failed" });
        }
        console.log("Login successful for user:", user.username);
        return res.json({ success: true, user: { id: user.id, username: user.username } });
      });
    })(req, res, next);
  });

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
    console.log("Auth check - isAuthenticated:", req.isAuthenticated(), "user:", req.user);
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