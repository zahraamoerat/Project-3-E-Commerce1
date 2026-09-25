import db from "../config/db.js";

export async function getCategories(req, res, next) {
  try {
    const [rows] = await db.execute(
      "SELECT category_id, category_name, description FROM categories ORDER BY category_name ASC"
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
}
