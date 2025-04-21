
import jwt from "jsonwebtoken";
import Admin from "../resources/models/admin.js";
import { errorResMsg } from "../utils/lib/response.js";


export const isAuthenticated = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) return errorResMsg(res, 401, "Authentication failed");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) return errorResMsg(res, 401, "Authentication failed");
    req.user = decoded;
    next();
  } catch (error) {
    return errorResMsg(res, 401, "Authentication failed.....");
  }
};

export const createJwtToken = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "5",
  });
  return token;
};

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token missing or invalid" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Optional: Attach admin/user to req
    const admin = await Admin.findById(decoded._id).select("-password");
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    req.user = { id: admin._id, role: decoded.role }; // Attach user info to request object
    next(); // ✅ Very important to proceed

  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ message: "Invalid or expired token", error: error.message });
  }
};

export const passwordJwtToken =(payload)=>{
  const token =jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"5m"});
  return token;
};

