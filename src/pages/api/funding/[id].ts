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
        [
          projectId,
          address,
          amount,
          new Date(),
          chain
        ]
      );

      res.status(200).json({
        message: "Project created successfully",
        result: result,
      });
    } else {
      // const [rows]: any = await pool.query(
      //   "SELECT " +
      //     "id,  " +
      //     "title,  " +
      //     "`desc`, " +
      //     "goal,  " +
      //     "writer,  " +
      //     "DATE_FORMAT(start_date, '%Y-%m-%d') AS start_date, " +
      //     "DATE_FORMAT(end_date, '%Y-%m-%d') AS end_date, " +
      //     "token_name as tokenName, " +
      //     "token_symbol as tokenSymbol " +
      //     "FROM project"
      // );
      // res.status(200).json({ projects: rows });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
