import { info, debug, error } from "../utils/logger.js";

/**
 * Genereert HATEOAS-links voor een collectie.
 * @param {Object} req - Express request object.
 * @param {string} baseUrl - De basis-URL van de collectie (bijv. /inventory).
 * @param {Array} items - De items in de collectie.
 * @param {number} totalItems - Het totale aantal items.
 * @param {number} limit - Aantal items per pagina.
 * @param {number} page - Huidige pagina.
 * @returns {Object} De collectie met HATEOAS-links.
 */
export const generateCollectionHateoas = (req, baseUrl, items, totalItems, limit, page) => {
  debug("[HATEOAS Helper] Start genereren van collectie HATEOAS-links");
  const protocol = req.protocol;
  const host = req.get("host");

  // Links voor de collectie (self, next, prev)
  const links = {
    self: {
      href: `${protocol}://${host}${baseUrl}?page=${page}&limit=${limit}`,
    },
    next:
      page * limit < totalItems
        ? {
            href: `${protocol}://${host}${baseUrl}?page=${
              page + 1
            }&limit=${limit}`,
          }
        : null,
    prev:
      page > 1
        ? {
            href: `${protocol}://${host}${baseUrl}?page=${
              page - 1
            }&limit=${limit}`,
          }
        : null,
  };

  debug("[HATEOAS Helper] Collectie links gegenereerd:", links);

  // Voeg links toe aan elk item
  const itemsWithLinks = items.map((item) => {
    const itemWithLinks = {
      ...item,
      _id: item._id.toString(), // ObjectId omzetten naar string
      _links: {
        self: { href: `${protocol}://${host}${baseUrl}/${item._id}` },
      },
    };

    debug("[HATEOAS Helper] Links toegevoegd aan item:", itemWithLinks);
    return itemWithLinks;
  });

  const result = {
    items: itemsWithLinks,
    _links: links,
    totalItems,
    limit,
    page,
  };

  debug("[HATEOAS Helper] Resultaat collectie met links:", result);
  return result;
};

/**
 * Genereert HATEOAS-links voor een enkel item.
 * @param {Object} req - Express request object.
 * @param {string} baseUrl - De basis-URL van de collectie (bijv. /inventory).
 * @param {Object} item - Het item waarvoor de links gegenereerd worden.
 * @returns {Object} Het item met HATEOAS-links.
 */
export const generateItemHateoas = (req, baseUrl, item) => {
  debug("[HATEOAS Helper] Start genereren van HATEOAS-links voor item");
  const protocol = req.protocol;
  const host = req.get("host");

  const result = {
    ...item,
    _id: item._id.toString(), // ObjectId omzetten naar string
    _links: {
      self: { href: `${protocol}://${host}${baseUrl}/${item._id}` },
      collection: { href: `${protocol}://${host}${baseUrl}` },
    },
  };

  debug("[HATEOAS Helper] Resultaat item met links:", result);
  return result;
};

/**
 * Middleware voor HATEOAS-links.
 * @param {string} baseUrl - De basis-URL van de collectie.
 * @returns {Function} Middleware-functie.
 */
export const hateoasMiddleware = (baseUrl) => (req, res, next) => {
  const originalJson = res.json;

  res.json = function (data) {
    debug("[HATEOAS Middleware] Start verwerking van JSON-response");

    // HATEOAS voor een collectie
    if (Array.isArray(data.items)) {
      debug("[HATEOAS Middleware] Ontvangen collectie-items:", data.items);

      const { limit = 10, page = 1 } = req.query;
      const totalItems = data.totalItems || data.items.length;

      const result = generateCollectionHateoas(
        req,
        baseUrl,
        data.items,
        totalItems,
        parseInt(limit, 10),
        parseInt(page, 10)
      );

      debug("[HATEOAS Middleware] Verwerkte collectie met links:", result);
      return originalJson.call(this, result);
    }

    // HATEOAS voor een detailresource
    if (data._id) {
      debug("[HATEOAS Middleware] Ontvangen detailresource:", data);

      const result = generateItemHateoas(req, baseUrl, data);

      debug("[HATEOAS Middleware] Verwerkte detailresource met links:", result);
      return originalJson.call(this, result);
    }

    // Standaard gedrag als geen collectie of detailresource
    debug("[HATEOAS Middleware] Standaard JSON-response:", data);
    return originalJson.call(this, data);
  };

  next();
};