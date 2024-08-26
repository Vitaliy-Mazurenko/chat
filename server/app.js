import { env } from "./utils/env.js";
import express from "express";
import cors from "cors";
import notFoundHandler from "./middlewares/notFoundHandler.js";
import errorHandler from "./middlewares/errorHandler.js";
import chatRouter from "./routes/chatRoutes.js";

const startServer = () => {
  const port = Number(env("PORT", 5000));
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use("/api/chats", chatRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(port, () => {
    console.log(`Server is running. Use our API on port: ${port}`);
  });
};

export default startServer;
