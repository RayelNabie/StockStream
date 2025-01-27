import { Inventory } from "../../models/Inventory.js";
import { envConfig } from "../../config/env.js";

export const getInventoryItemsService = async (query) => {
  const limit = parseInt(query.limit, 10) || 10;
  const page = parseInt(query.page, 10) || 1;
  const skip = (page - 1) * limit;

  const totalItems = await Inventory.countDocuments();
  const totalPages = Math.ceil(totalItems / limit);

  if (page < 1 || page > totalPages) {
    throw new Error("Invalid page number");
  }

  const items = await Inventory.find({}).skip(skip).limit(limit);

  const baseUrl = `${envConfig.serverUrl}/inventory`;

  const paginationLinks = {
    self: { href: `${baseUrl}?page=${page}&limit=${limit}` },
    first: { href: `${baseUrl}?page=1&limit=${limit}` },
    last: { href: `${baseUrl}?page=${totalPages}&limit=${limit}` },
    previous: page > 1 ? { href: `${baseUrl}?page=${page - 1}&limit=${limit}` } : null,
    next: page < totalPages ? { href: `${baseUrl}?page=${page + 1}&limit=${limit}` } : null,
  };

  const mappedItems = items.map((item) => ({
    ...item.toObject(),
    _links: {
      self: { href: `${baseUrl}/${item._id}` },
      collection: { href: baseUrl },
    },
  }));

  return {
    items: mappedItems,
    pagination: {
      currentPage: page,
      currentItems: mappedItems.length,
      totalPages,
      totalItems,
      _links: paginationLinks,
    },
  };
};