import { info, error } from "../utils/logger.js";

// Middleware voor CORS en header-validatie
export const corsMiddleware = (req, res, next) => {
  // Stel CORS-headers in
  res.header("Access-Control-Allow-Origin", "*"); // Toegestaan voor alle origins
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.header("Access-Control-Expose-Headers", "Authorization, Link");

  // Log verzoek
  info(
    `[CORS Middleware] Verzoek ontvangen: [${req.method}] ${req.originalUrl}`
  );

  // OPTIONS-verzoeken direct afhandelen (preflight)
  if (req.method === "OPTIONS") {
    res.set("Allow", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    return res.status(204).end();
  }

  // Controleer op een correcte Accept-header (alleen JSON)
  const acceptHeader = req.headers.accept || "";
  if (!acceptHeader.includes("application/json")) {
    error(
      `[CORS Middleware] Ongeldige Accept-header: Verwacht 'application/json', ontvangen '${acceptHeader}'`
    );
    return res.status(406).json({
      ERROR: "Unsupported Accept header. Only 'application/json' is allowed.",
    });
  }

  // Controleer Content-Type voor POST, PUT en PATCH
  const contentTypeHeader = req.headers["content-type"] || "";
  if (
    ["POST", "PUT", "PATCH"].includes(req.method) &&
    !(
      contentTypeHeader.includes("application/json") ||
      contentTypeHeader.includes("application/x-www-form-urlencoded")
    )
  ) {
    error(
      `[CORS Middleware] Ongeldige Content-Type-header: Verwacht 'application/json' of 'application/x-www-form-urlencoded', ontvangen '${contentTypeHeader}'`
    );
    return res.status(415).json({
      ERROR:
        "Unsupported Content-Type header. Only 'application/json' or 'application/x-www-form-urlencoded' is allowed.",
    });
  }

  next();
};
