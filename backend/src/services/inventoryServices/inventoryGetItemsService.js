import { Inventory } from "../../models/Inventory.js";
import { envConfig } from "../../config/env.js";
import { info, error, debug } from "../../utils/logger.js";

export const getInventoryItemsService = async (query) => {
  try {
    debug("[Service] Start ophalen van inventarisitems", { query });

    const start = Number.isInteger(parseInt(query.start, 10)) ? parseInt(query.start, 10) : 0;
    const limit = Number.isInteger(parseInt(query.limit, 10)) ? Math.min(parseInt(query.limit, 10), 200) : 200;

    if (start < 0) {
      info("[Service] Ongeldige startwaarde ontvangen", { start });
      return { status: 400, message: "Ongeldige startwaarde. Moet een positief geheel getal zijn of 0." };
    }

    if (limit <= 0) {
      info("[Service] Ongeldige limiet ontvangen", { limit });
      return { status: 400, message: "Ongeldige limiet. Moet een waarde tussen 1 en 200 zijn." };
    }

    debug("[Service] Start en limiet gevalideerd", { start, limit });

    const totalItems = await Inventory.countDocuments({});
    const totalPages = Math.ceil(totalItems / limit);
    const page = Math.floor(start / limit) + 1;

    if (totalItems === 0) {
      info("[Service] Geen inventarisitems gevonden");
      return { status: 200, message: "Geen inventarisitems gevonden.", items: [], pagination: { currentPage: 0, totalPages: 0, totalItems: 0 } };
    }

    if (page < 1 || page > totalPages) {
      info("[Service] Ongeldig paginanummer", { page, totalPages });
      return { status: 400, message: "Ongeldig paginanummer. Buiten het bereik." };
    }

    debug("[Service] Paginering berekend", { page, totalPages });

    const items = await Inventory.find({}).skip(start).limit(limit);
    debug("[Service] Inventarisitems opgehaald", { aantalItems: items.length });

    const baseUrl = `${envConfig.serverUrl}/inventory`;

    const mappedItems = items.map((item) => ({
      ...item.toObject({ versionKey: false }),
      _links: {
        self: { href: `${baseUrl}/${item._id}` },
        collection: { href: baseUrl },
      },
    }));

    const paginationLinks = {
      previous: start > 0 ? { href: `${baseUrl}?start=${Math.max(0, start - limit)}&limit=${limit}` } : null,
      next: page < totalPages ? { href: `${baseUrl}?start=${start + limit}&limit=${limit}` } : null,
      first: { href: `${baseUrl}?start=0&limit=${limit}` },
      last: { href: `${baseUrl}?start=${(totalPages - 1) * limit}&limit=${limit}` },
    };

    info("[Service] Inventaris succesvol opgehaald", { currentPage: page, totalPages, totalItems });

    return {
      status: 200,
      items: mappedItems,
      _links: { self: { href: baseUrl } },
      pagination: {
        currentPage: page,
        currentItems: mappedItems.length,
        totalPages,
        totalItems,
        _links: paginationLinks,
      },
    };
  } catch (err) {
    error("[Service] Fout bij ophalen van inventaris", { error: err.message });

    return {
      status: 500,
      message: "Interne serverfout bij ophalen van inventaris.",
      error: err.message,
    };
  }
};