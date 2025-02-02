import { User } from "../../models/User.js";
import { faker } from "@faker-js/faker";
import { info, error } from "../../utils/logger.js";

const generateUserData = (count = 10) => {
  info(`Genereren van ${count} gebruikers...`);
  return Array.from({ length: count }, () => ({
    username: faker.internet.firstName(),
    email: faker.internet.email(),
    password: "programmeren6",
    role: faker.helpers.arrayElement(["user", "admin"]),
    gender: faker.datatype.boolean(), // true = man, false = vrouw
  }));
};

const userSeeder = {
  name: "UserSeeder",
  run: async () => {
    try {
      info("Verwijderen van bestaande gebruikers...");
      await User.deleteMany({});

      info("Genereren van gebruikersdata...");
      const users = generateUserData();

      info("Invoegen van nieuwe gebruikers in de database...");
      await User.insertMany(users);

      info("UserSeeder succesvol voltooid.");
    } catch (err) {
      error("Fout in UserSeeder", { error: err.message });
      throw err;
    }
  },
};

export default userSeeder;
