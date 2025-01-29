import { Inventory } from "../../models/Inventory.js";
import { envConfig } from "../../config/env.js";

export const getInventoryItemsService = async (query) => {
  try {
    // Validate and parse query parameters
    const start = parseInt(query.start, 10) || 0;
    const limit = isNaN(parseInt(query.limit, 10))
      ? 10
      : parseInt(query.limit, 10); // Default to 10 if invalid

    // Fetch total items and calculate total pages
    const totalItems = await Inventory.countDocuments({});
    const totalPages = Math.ceil(totalItems / limit);

    // Calculate current page
    const page = Math.floor(start / limit) + 1;

    // Validate the page number
    if (page < 1 || page > totalPages) {
      throw new Error("Invalid page number");
    }

    // Fetch the paginated inventory items
    const items = await Inventory.find({}).skip(start).limit(limit);

    // Construct the base URL dynamically using environment variables
    const baseUrl = `${envConfig.serverUrl}/inventory`;

    // Map each inventory item to include HATEOAS links
    const mappedItems = items.map((item) => ({
      ...item.toObject({ versionKey: false }), // Exclude `__v`
      _links: {
        self: { href: `${baseUrl}/${item._id}` },
        collection: { href: baseUrl },
      },
    }));

    // Construct pagination links
    const paginationLinks = {
      previous:
        start > 0
          ? {
              href: `${baseUrl}?start=${Math.max(
                0,
                start - limit
              )}&limit=${limit}`,
            }
          : null,
      next:
        page < totalPages
          ? { href: `${baseUrl}?start=${start + limit}&limit=${limit}` }
          : null,
      first: { href: `${baseUrl}?start=0&limit=${limit}` },
      last: {
        href: `${baseUrl}?start=${(totalPages - 1) * limit}&limit=${limit}`,
      },
    };

    // Return the paginated response
    return {
      items: mappedItems,
      _links: {
        self: { href: baseUrl },
      },
      pagination: {
        currentPage: page,
        currentItems: mappedItems.length,
        totalPages,
        totalItems,
        _links: paginationLinks,
      },
    };
  } catch (err) {
    throw new Error(err.message || "Error fetching inventory items");
  }
};
