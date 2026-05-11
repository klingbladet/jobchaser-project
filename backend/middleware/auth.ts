import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: { id: string; username: string };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader?.split(' ')[1];

  console.log("--- AUTH DEBUG ---")
  console.log("Auth Header", token ? "JA" : "NEJ");
  console.log("Token hittad_", token ? "JA" : "NEJ")
  console.log("Använder Secret:", process.env.JWT_SECRET ? "DEFINIERAD" : "UNDEFINED! (HÄR ÄR FELET)")
  
  if(!token) {
    return res.status(401).json({ error: 'Ingen token tillhandahållen' });
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) {
      console.log("JWT VERIFIERINGFEL", err.message);
      return res.status(403).json({ error: 'Ogiltig eller utgången token' });
    }
    const payload = decoded as { id: string; username: string };
    console.log("Verifiering lyckades för användare:", payload.username);
    req.user = { id:payload.id, username: payload.username };
    next();
  });
}