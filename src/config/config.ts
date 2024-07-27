import dotenv from "dotenv";

// destructure dot env file.
dotenv.config();

export const DEVELOPMENT = process.env.NODE_ENV === "development";
export const TEST = process.env.NODE_ENV === "test";

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || "localhost";
const SERVER_PORT = process.env.SERVER_PORT
  ? Number(process.env.SERVER_PORT)
  : 12345;

const EMAIL_USERNAME = process.env.EMAIL_USERNAME;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;


export const DB_URI: string = process.env.DB_URI!;

export const SERVER = {
  SERVER_HOSTNAME,
  SERVER_PORT,
};
export const EMAIL_CREDS = {
  EMAIL_PASSWORD,
  EMAIL_USERNAME,
};

export const SECRET_KEY = process.env.JWT_SECRET_KEY || "12313456165";
