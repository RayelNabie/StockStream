import { envConfig } from "./env.js";

const jwtConfig = {
    enableJWT: true, 
    jwtSecret: envConfig.jwtSecret, 
    jwtExpiry: "1h", 
  };
  
  export default jwtConfig;