import jwt from "jsonwebtoken";
import db from "../config/db.js";
const secret=()=>process.env.JWT_SECRET||"development-only-change-me";
export function signUser(user){return jwt.sign({user_id:user.user_id,email:user.email,user_role:user.user_role,supplier_id:user.supplier_id||null},secret(),{expiresIn:"8h"});}
export function requireAuth(req,res,next){const h=req.headers.authorization||"";const t=h.startsWith("Bearer ")?h.slice(7):null;if(!t)return res.status(401).json({message:"Authentication required."});try{req.user=jwt.verify(t,secret());next();}catch{return res.status(401).json({message:"Your session has expired. Please sign in again."});}}
export function requireRole(...roles){return(req,res,next)=>{if(!req.user||!roles.includes(req.user.user_role))return res.status(403).json({message:"You are not authorised to perform this action."});next();};}
export async function requireSupplier(req,res,next){try{const [rows]=await db.execute("SELECT supplier_id FROM suppliers WHERE user_id=? LIMIT 1",[req.user?.user_id]);const supplierId=rows[0]?.supplier_id;if(!supplierId)return res.status(403).json({message:"A supplier account is required."});req.supplierId=Number(supplierId);next();}catch(error){next(error);}}
