import { NextApiRequest, NextApiResponse } from "next";
import pool from "../../../db/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const [rows]: any = await pool.query(
      "SELECT * FROM project WHERE id = ? LIMIT 1",
      req.query.id
    );
    res.status(200).json({ project: rows[0] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
