import { NextApiRequest, NextApiResponse } from "next";
import pool from "../../db/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method == "POST") {
      const { title, desc, goal, writer, duration, tokenName, tokenSymbol } =
        req.body;
      const result = await pool.query(
        "INSERT INTO project (title, `desc`, goal, writer, start_date, end_date, token_name, token_symbol) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          title,
          desc,
          goal,
          writer,
          new Date(),
          new Date(new Date().setDate(new Date().getDate() + duration)),
          tokenName,
          tokenSymbol,
        ]
      );

      res.status(200).json({
        message: "Project created successfully",
        result: result,
      });
    } else {
      const [rows]: any = await pool.query(
        "SELECT " +
          "id,  " +
          "title,  " +
          "`desc`, " +
          "goal,  " +
          "writer,  " +
          "DATE_FORMAT(start_date, '%Y-%m-%d') AS start_date, " +
          "DATE_FORMAT(end_date, '%Y-%m-%d') AS end_date, " +
          "token_name as tokenName, " +
          "token_symbol as tokenSymbol, " +
          "( select count(*) from funding where project_id = p.id ) as peoples, " +
          "( select sum(f.amount) from funding f where project_id = p.id ) as amount " +
          " FROM project p"
      );
      res.status(200).json({ projects: rows });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
