import { google } from "googleapis";

import dotenv from "dotenv";
import { handleBadRequestError } from "../Utils/index.js";

// Configuración de OAuth2 para Google Calendar
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const googleAuth = (req, res) => {
  const { usuario_id } = req.query;
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/calendar"],
    state: usuario_id,
  });
  res.redirect(authUrl);
};

const googleAuthCallback = async (req, res) => {
  const { code, state } = req.query;
  const usuario_id = state;

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    res.redirect(process.env.FRONTEND_URL + "/docentes/asesorias");
  } catch (error) {
    res.redirect(process.env.FRONTEND_URL + "/docentes/asesorias");
  }
};

const getEvents = async (req, res) => {
  try {
    if (!oauth2Client.credentials.access_token) {
      throw new Error("No se han configurado tokens de acceso válidos.");
    }

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });

    res.json(response.data.items);
  } catch (error) {
    console.error("Error getting events:", error);
    res.status(500).send("Error getting events.");
  }
};

const createEvent = async (req, res) => {
  const { summary, description, location, start, end, attendees, meetLink } =
    req.body;

  const emailAddresses = attendees.map((attendee) => attendee.name);
  const event = {
    summary: summary,
    description: description,
    location,
    start: {
      dateTime: start,
      timeZone: "America/Mexico_City",
    },
    end: {
      dateTime: end,
      timeZone: "America/Mexico_City",
    },
    attendees: emailAddresses.map((email) => ({ email })),
    reminders: {
      useDefault: true,
    },
  };

  if (meetLink) {
    event.conferenceData = {
      entryPoints: [
        {
          entryPointType: "video",
          uri: `https://meet.google.com/${meetLink}`,
          label: "Google Meet",
        },
      ],
      conferenceSolution: {
        key: {
          type: "hangoutsMeet",
        },
        name: "Google Meet",
        iconUri:
          "https://fonts.gstatic.com/s/i/productlogos/meet_2020q4/v6/web-512dp/logo_meet_2020q4_color_2x_web_512dp.png",
      },
      conferenceId: meetLink.replace(/-/g, ""),
      signature: "sample_signature", // Agrega una firma adecuada si es necesario
    };
  }

  try {
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
      conferenceDataVersion: 1,
    });
    res.json({
      msg: "Evento creado correctamente.",
    });
  } catch (error) {
    console.log("Error creating event:", error);
    return handleBadRequestError("Error al crear el evento.", res);
  }
};

const deleteEvent = async (req, res) => {
  const { eventId } = req.params;

  try {
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    await calendar.events.delete({
      calendarId: "primary",
      eventId,
    });

    res.json({
      msg: "Evento eliminado correctamente.",
    });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).send("Error deleting event.");
  }
};

export { googleAuth, googleAuthCallback, getEvents, createEvent, deleteEvent };
