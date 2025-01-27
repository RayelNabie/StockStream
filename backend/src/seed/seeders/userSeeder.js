import { User } from "../../models/User.js";
import { faker } from "@faker-js/faker";
import { info, error } from "../../utils/logger.js";

const generateUserData = () => {
  const users = [];

  for (let i = 0; i < 10; i++) {
    users.push({
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: "programmeren6", // Standaard wachtwoord zonder hashing
      role: faker.helpers.arrayElement(["user", "admin"]), // Willekeurig "user" of "admin"
      gender: faker.datatype.boolean(), // true (man) of false (vrouw)
    });
  }

  return users;
};

const userSeeder = {
  name: "UserSeeder",
  run: async () => {
    try {
      info("Clearing existing users...");
      await User.deleteMany({}); // Verwijder bestaande gebruikers

      info("Generating user data...");
      const users = generateUserData(); // Genereer gebruikersdata

      info("Inserting new user data...");
      await User.insertMany(users); // Voeg nieuwe gebruikers toe aan de database

      info("UserSeeder completed successfully!");
    } catch (err) {
      error("Error in UserSeeder");
      error(err.message);
      throw err;
    }
  },
};

export default userSeeder;