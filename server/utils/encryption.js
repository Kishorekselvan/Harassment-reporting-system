import dotenv from "dotenv";
dotenv.config();
import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";

// MUST be 32 bytes (store in .env)
const SECRET_KEY = Buffer.from(process.env.MESSAGE_SECRET_KEY, "hex");

export const encryptMessage = (text) => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  return {
    content: encrypted,
    iv: iv.toString("hex"),
    authTag: authTag.toString("hex")
  };
};

export const decryptMessage = ({ content, iv, authTag }) => {
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    SECRET_KEY,
    Buffer.from(iv, "hex")
  );

  decipher.setAuthTag(Buffer.from(authTag, "hex"));

  let decrypted = decipher.update(content, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};
