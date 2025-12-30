import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

import routerCategory from "./router/routerCategory.js";
import routerProduct from "./router/routerProduct.js";
import routerUser from "./router/routerUser.js";
import routerAddress from "./router/routerAddress.js";
import routerReview from "./router/routerReview.js";
import routerOrder from "./router/routerOrder.js";

app.use(
  cors({
    origin: [
      process.env.DOMAIN_1,
      process.env.DOMAIN_2,
      process.env.DOMAIN_3,
      process.env.DOMAIN_4,
      process.env.DOMAIN_5,
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/user", routerUser);
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use("/category", routerCategory);
app.use("/product", routerProduct);
app.use("/address", routerAddress);
app.use("/review", routerReview);
app.use("/order", routerOrder);

export default app;
