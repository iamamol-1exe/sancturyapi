import { createClient } from "redis";
import { config } from "../../config";

export const redisClient = createClient({
  url: config.redis.url,
});

redisClient.on("error", (err) => {
  console.log("Error in connecting redis", err);
});

redisClient.on("connect", () => {
  console.log("Redis is connectes succesfully");
});


export default redisClient;
