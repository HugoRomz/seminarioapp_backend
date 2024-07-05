import { Router } from "express";
import {
  googleAuth,
  googleAuthCallback,
  getEvents,
  createEvent,
  deleteEvent,
} from "../controllers/googleController.js";

const router = Router();

// Rutas de autenticación y manejo de eventos
router.get("/auth/google", googleAuth);
router.get("/auth/google/callback", googleAuthCallback);
router.get("/events", getEvents);
router.post("/create-event", createEvent);
router.delete("/delete-event/:eventId", deleteEvent);

export default router;
