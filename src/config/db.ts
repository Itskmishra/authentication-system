import mongoose from "mongoose";
import { DB_URI } from "./config";

const connect_db = async () => {
  try {
    // try to connect to db
    await mongoose.connect(DB_URI);
    logging.info("DATABASE Connected Successfully.");
  } catch (err) {
    logging.error("MONGO ERROR: " + err);
  }
};

export default connect_db;
