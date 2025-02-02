import { info, error, debug } from "../utils/logger.js";

export const corsMiddleware = (req, res, next) => {
  info(
    `[CORS Middleware] Verzoek ontvangen: [${req.method}] ${req.originalUrl}`
  );

  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.header("Access-Control-Expose-Headers", "Authorization, Link");

  let allowedMethods;
  if (req.originalUrl === "/inventory") {
    allowedMethods = "GET, POST, OPTIONS";
  } else if (req.originalUrl.startsWith("/inventory/")) {
    allowedMethods = "GET, PUT, PATCH, DELETE, OPTIONS";
  } else {
    allowedMethods = "OPTIONS";
  }

  if (req.method === "OPTIONS") {
    debug(
      `[CORS Middleware] OPTIONS-verzoek ontvangen voor ${req.originalUrl}, toestaan: ${allowedMethods}`
    );
    res.set("Allow", allowedMethods);
    return res.status(204).end();
  }

  const acceptHeader = req.headers.accept || "";
  if (!acceptHeader.includes("application/json")) {
    error(
      `[CORS Middleware] Ongeldige Accept-header ontvangen: '${acceptHeader}'`
    );
    return res.status(406).json({
      ERROR: "Unsupported Accept header. Only 'application/json' is allowed.",
    });
  }

  const contentTypeHeader = req.headers["content-type"] || "";
  if (
    ["POST", "PUT", "PATCH"].includes(req.method) &&
    !contentTypeHeader.includes("application/json") &&
    !contentTypeHeader.includes("application/x-www-form-urlencoded")
  ) {
    error(
      `[CORS Middleware] Ongeldige Content-Type-header ontvangen: '${contentTypeHeader}'`
    );
    return res.status(415).json({
      ERROR:
        "Unsupported Content-Type header. Only 'application/json' or 'application/x-www-form-urlencoded' is allowed.",
    });
  }

  debug(
    `[CORS Middleware] Verzoek toegestaan: [${req.method}] ${req.originalUrl}`
  );
  next();
};
