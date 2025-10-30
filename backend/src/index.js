import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./db/index.js";

dotenv.config({
  path: "./.env",
  debug: true,
});

connectDB()
  .then(() => {
    return app.listen(process.env.PORT, () => {
      console.log(`app is listening on http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Mongodb connection failed !!! ", err);
  });
