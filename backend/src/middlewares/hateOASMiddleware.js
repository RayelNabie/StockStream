export const HalMiddleware = (baseUrl) => (req, res, next) => {
  const originalJson = res.json;

  res.json = function (data) {
    if (Array.isArray(data.items)) {
      // Verwerk collectie-items
      const sanitizedItems = data.items.map((item) => {
        const itemData = item.toObject ? item.toObject() : item; // Verwijder Mongoose-specifieke velden

        return {
          ...itemData,
          _links: {
            self: { href: `${req.protocol}://${req.get("host")}${baseUrl}/${itemData._id || itemData.id}` },
            collection: { href: `${req.protocol}://${req.get("host")}${baseUrl}` },
          },
        };
      });

      const { page = 1, limit = 10, totalItems = sanitizedItems.length } = data;

      const pagination = {
        currentPage: parseInt(page, 10),
        currentItems: sanitizedItems.length,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
        _links: {
          self: { href: `${req.protocol}://${req.get("host")}${baseUrl}?page=${page}&limit=${limit}` },
          first: { href: `${req.protocol}://${req.get("host")}${baseUrl}?page=1&limit=${limit}` },
          last: { href: `${req.protocol}://${req.get("host")}${baseUrl}?page=${Math.ceil(totalItems / limit)}&limit=${limit}` },
          next:
            page < Math.ceil(totalItems / limit)
              ? { href: `${req.protocol}://${req.get("host")}${baseUrl}?page=${parseInt(page, 10) + 1}&limit=${limit}` }
              : null,
          prev:
            page > 1
              ? { href: `${req.protocol}://${req.get("host")}${baseUrl}?page=${parseInt(page, 10) - 1}&limit=${limit}` }
              : null,
        },
      };

      return originalJson.call(this, {
        items: sanitizedItems,
        _links: { self: { href: `${req.protocol}://${req.get("host")}${baseUrl}?page=${page}&limit=${limit}` } },
        pagination,
      });
    }

    if (data._id || data.id) {
      // Verwerk een enkele resource
      const itemData = data.toObject ? data.toObject() : data;

      const item = {
        ...itemData,
        _links: {
          self: { href: `${req.protocol}://${req.get("host")}${baseUrl}/${itemData._id || itemData.id}` },
          collection: { href: `${req.protocol}://${req.get("host")}${baseUrl}` },
        },
      };

      return originalJson.call(this, item);
    }

    // Standaard JSON-respons (geen HAL)
    return originalJson.call(this, data);
  };

  next();
};