import { NextApiRequest, NextApiResponse } from "next";
import pool from "../../db/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const [rows]: any = await pool.query(
      "SELECT "+
      "id,  "+
      "title,  "+
      "`desc`, "+
      "goal,  "+
      "writer,  "+
      "DATE_FORMAT(start_date, '%Y-%m-%d') AS start_date, "+
      "DATE_FORMAT(end_date, '%Y-%m-%d') AS end_date "+
      "FROM project"
    );
    res.status(200).json({ projects: rows });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
