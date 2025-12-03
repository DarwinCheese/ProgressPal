import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export function auth(req: any, res: any, next: any) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ error: "Missing Authorization header" });
  }

  const token = header.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
