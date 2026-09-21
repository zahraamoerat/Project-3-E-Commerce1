import db from "../config/db.js";
import bcrypt from "bcryptjs";
import { signUser } from "../middleware/auth.js";
export async function login(req,res,next){try{const email=String(req.body.email||"").trim().toLowerCase();const password=String(req.body.password||"");if(!email||!password)return res.status(400).json({message:"Email and password are required."});const [rows]=await db.execute(`SELECT u.user_id,u.email,u.password_hash,u.user_role,u.is_active,u.is_approved,s.supplier_id FROM users u LEFT JOIN suppliers s ON s.user_id=u.user_id WHERE u.email=? LIMIT 1`,[email]);const u=rows[0];if(!u||!u.is_active||u.is_approved===0||!(await bcrypt.compare(password,u.password_hash)))return res.status(401).json({message:"Invalid email or password."});const user={user_id:u.user_id,email:u.email,user_role:u.user_role,supplier_id:u.supplier_id||null};res.json({token:signUser(user),user});}catch(e){next(e);}}
export async function me(req,res){res.json({user:req.user});}
