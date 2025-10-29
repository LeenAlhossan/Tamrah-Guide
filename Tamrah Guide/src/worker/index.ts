import { Hono } from "hono";
import { cors } from "hono/cors";
import { DateTypeSchema, RecommendationRequestSchema } from "@/shared/types";
import {
  exchangeCodeForSessionToken,
  getOAuthRedirectUrl,
  authMiddleware,
  deleteSession,
  MOCHA_SESSION_TOKEN_COOKIE_NAME,
} from "@getmocha/users-service/backend";
import { getCookie, setCookie } from "hono/cookie";
import "./types";

const app = new Hono<{ Bindings: Env }>();

app.use("*", cors());

// Authentication endpoints
app.get('/api/oauth/google/redirect_url', async (c) => {
  const redirectUrl = await getOAuthRedirectUrl('google', {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  return c.json({ redirectUrl }, 200);
});

app.post("/api/sessions", async (c) => {
  const body = await c.req.json();

  if (!body.code) {
    return c.json({ error: "No authorization code provided" }, 400);
  }

  const sessionToken = await exchangeCodeForSessionToken(body.code, {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 60 * 24 * 60 * 60, // 60 days
  });

  return c.json({ success: true }, 200);
});

app.get("/api/users/me", authMiddleware, async (c) => {
  return c.json(c.get("user"));
});

app.get('/api/logout', async (c) => {
  const sessionToken = getCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME);

  if (typeof sessionToken === 'string') {
    await deleteSession(sessionToken, {
      apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
      apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
    });
  }

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, '', {
    httpOnly: true,
    path: '/',
    sameSite: 'none',
    secure: true,
    maxAge: 0,
  });

  return c.json({ success: true }, 200);
});

// Get all date types
app.get("/api/date-types", async (c) => {
  try {
    const { results } = await c.env.DB.prepare(
      `SELECT * FROM date_types ORDER BY is_premium DESC, sweetness_level DESC`
    ).all();

    const dateTypes = results.map(result => DateTypeSchema.parse(result));
    return c.json(dateTypes);
  } catch (error) {
    console.error("Error fetching date types:", error);
    return c.json({ error: "Failed to fetch date types" }, 500);
  }
});

// Get date type by ID
app.get("/api/date-types/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    
    const result = await c.env.DB.prepare(
      `SELECT * FROM date_types WHERE id = ?`
    ).bind(id).first();

    if (!result) {
      return c.json({ error: "Date type not found" }, 404);
    }

    const dateType = DateTypeSchema.parse(result);
    return c.json(dateType);
  } catch (error) {
    console.error("Error fetching date type:", error);
    return c.json({ error: "Failed to fetch date type" }, 500);
  }
});

// Get smart recommendations
app.post("/api/recommendations", async (c) => {
  try {
    const body = await c.req.json();
    const preferences = RecommendationRequestSchema.parse(body);

    let query = `SELECT * FROM date_types WHERE 1=1`;
    const params: any[] = [];

    if (preferences.sweetness_preference) {
      query += ` AND sweetness_level >= ?`;
      params.push(preferences.sweetness_preference - 1);
    }

    if (preferences.budget_max) {
      query += ` AND average_price_per_kg <= ?`;
      params.push(preferences.budget_max);
    }

    if (preferences.is_premium_preferred !== undefined) {
      query += ` AND is_premium = ?`;
      params.push(preferences.is_premium_preferred ? 1 : 0);
    }

    if (preferences.texture_preference && preferences.texture_preference !== 'any') {
      if (preferences.texture_preference === 'soft') {
        query += ` AND (texture_en LIKE '%soft%' OR texture_en LIKE '%tender%')`;
      } else if (preferences.texture_preference === 'firm') {
        query += ` AND (texture_en LIKE '%firm%' OR texture_en LIKE '%chewy%')`;
      }
    }

    query += ` ORDER BY sweetness_level DESC, is_premium DESC LIMIT 3`;

    const { results } = await c.env.DB.prepare(query).bind(...params).all();
    const recommendations = results.map(result => DateTypeSchema.parse(result));

    return c.json(recommendations);
  } catch (error) {
    console.error("Error getting recommendations:", error);
    return c.json({ error: "Failed to get recommendations" }, 500);
  }
});

// Admin endpoints (protected)
app.put("/api/admin/date-types/:id", authMiddleware, async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    const body = await c.req.json();
    
    const updateData = DateTypeSchema.omit({ id: true, created_at: true, updated_at: true }).parse(body);
    
    const fields = Object.keys(updateData);
    const values = Object.values(updateData);
    const placeholders = fields.map(field => `${field} = ?`).join(', ');
    
    await c.env.DB.prepare(
      `UPDATE date_types SET ${placeholders}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
    ).bind(...values, id).run();

    const result = await c.env.DB.prepare(
      `SELECT * FROM date_types WHERE id = ?`
    ).bind(id).first();

    if (!result) {
      return c.json({ error: "Date type not found" }, 404);
    }

    const dateType = DateTypeSchema.parse(result);
    return c.json(dateType);
  } catch (error) {
    console.error("Error updating date type:", error);
    return c.json({ error: "Failed to update date type" }, 500);
  }
});

app.post("/api/admin/date-types", authMiddleware, async (c) => {
  try {
    const body = await c.req.json();
    const dateTypeData = DateTypeSchema.omit({ id: true, created_at: true, updated_at: true }).parse(body);
    
    const fields = Object.keys(dateTypeData);
    const values = Object.values(dateTypeData);
    const placeholders = fields.map(() => '?').join(', ');
    
    const result = await c.env.DB.prepare(
      `INSERT INTO date_types (${fields.join(', ')}) VALUES (${placeholders})`
    ).bind(...values).run();

    const newDateType = await c.env.DB.prepare(
      `SELECT * FROM date_types WHERE id = ?`
    ).bind(result.meta.last_row_id).first();

    return c.json(DateTypeSchema.parse(newDateType));
  } catch (error) {
    console.error("Error creating date type:", error);
    return c.json({ error: "Failed to create date type" }, 500);
  }
});

app.delete("/api/admin/date-types/:id", authMiddleware, async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    
    await c.env.DB.prepare(
      `DELETE FROM date_types WHERE id = ?`
    ).bind(id).run();

    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting date type:", error);
    return c.json({ error: "Failed to delete date type" }, 500);
  }
});

// Image upload endpoint
app.post("/api/admin/upload-image", authMiddleware, async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('image') as File;
    const category = formData.get('category') as string || 'dates';
    
    if (!file) {
      return c.json({ error: "No file provided" }, 400);
    }

    // Generate unique filename
    const timestamp = Date.now();
    const key = `${category}/${timestamp}-${file.name}`;
    
    // Upload to R2
    await c.env.R2_BUCKET.put(key, file.stream(), {
      httpMetadata: {
        contentType: file.type,
      },
    });

    // Return the URL that can be used to access the image
    const imageUrl = `/api/files/${encodeURIComponent(key)}`;
    
    return c.json({ imageUrl, key });
  } catch (error) {
    console.error("Error uploading image:", error);
    return c.json({ error: "Failed to upload image" }, 500);
  }
});

// Serve images from R2
app.get("/api/files/*", async (c) => {
  try {
    const key = c.req.path.replace('/api/files/', '');
    const decodedKey = decodeURIComponent(key);
    
    const object = await c.env.R2_BUCKET.get(decodedKey);
    
    if (!object) {
      return c.json({ error: "File not found" }, 404);
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);
    
    return c.body(object.body, { headers });
  } catch (error) {
    console.error("Error serving file:", error);
    return c.json({ error: "Failed to serve file" }, 500);
  }
});

export default app;
