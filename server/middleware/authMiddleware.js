import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log("token", token);
  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    console.log("JWT_SECRET", process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET||"kalpana75");
    console.log("decoded",decoded);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
};
export const verifyAdmin = (req, res, next) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({ message: "Access denied!Admin only" });
  }
  next();
};
export const verifyPolice = (req, res, next) => {
  console.log("Role:",req.user.role);
  if (req.user.role !== "Police") {

    return res.status(403).json({ message: "Access denied: Police only" });
  }
  next();
};