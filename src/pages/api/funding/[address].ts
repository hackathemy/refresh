import { NextApiRequest, NextApiResponse } from "next";
import pool from "../../../db/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method == "POST") {
      const { projectId, address, amount, chain } = req.body;
      const result = await pool.query(
        "INSERT INTO funding (project_id, address, amount, fund_date, chain) VALUES (?, ?, ?, ?, ?)",
        [projectId, address, amount, new Date(), chain]
      );

      res.status(200).json({
        message: "Project created successfully",
        result: result,
      });
    } else {
      const { address } = req.query;
      const [rows]: any = await pool.query(
        "SELECT p.*, SUM(f.amount) as amount FROM project p JOIN funding f ON p.id = f.project_id WHERE f.address = ? GROUP BY f.project_id",
        [address]
      );
      res.status(200).json({ projects: rows });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
