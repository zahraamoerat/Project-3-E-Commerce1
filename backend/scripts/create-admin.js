import bcrypt from "bcryptjs";
import db from "../src/config/db.js";

const [emailArg, passwordArg] = process.argv.slice(2);

if (!emailArg || !passwordArg) {
  console.error(
    "Usage: npm run create-admin -w backend -- you@example.com yourpassword"
  );
  process.exit(1);
}

const email = emailArg.trim().toLowerCase();

try {
  const passwordHash = await bcrypt.hash(passwordArg, 10);

  const [result] = await db.execute(
    `INSERT INTO users (email, password_hash, user_role, is_approved, is_active)
     VALUES (?, ?, 'admin', 1, 1)
     ON DUPLICATE KEY UPDATE
       password_hash = VALUES(password_hash),
       user_role = 'admin',
       is_approved = 1,
       is_active = 1`,
    [email, passwordHash]
  );

  if (result.affectedRows === 2) {
    console.log(`Admin updated: ${email}`);
  } else {
    console.log(`Admin created: ${email}`);
  }
} catch (error) {
  console.error("Could not create admin:", error.message);
  process.exit(1);
} finally {
  await db.end();
}