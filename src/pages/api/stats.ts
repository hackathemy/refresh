import { NextApiRequest, NextApiResponse } from "next";
import pool from "../../db/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method == "POST") {
      
    } else {
      const [rows]: any = await pool.query(
        "SELECT " +
          "( select count(*) from project ) as projectCount, " +
          "( select count(*) from funding ) as fundingCount, " +
          "( select FORMAT(sum(amount), 4) from funding  ) as fundingAmount "           
      );
      res.status(200).json({ stats: rows });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
