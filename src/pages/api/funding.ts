import { NextApiRequest, NextApiResponse } from "next";
import pool from "../../db/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const [rows]: any = await pool.query(
      "SELECT " +
        "id,  " +
        "project_id,  " +
        "address, " +
        "amount,  " +
        "chain, " +
        "message_id, " +
        "src_tx, " +
        "dest_tx, " +
        "DATE_FORMAT(fund_date, '%Y-%m-%d') AS fund_date, " +
        "( select title from project where id = f.project_id ) as project_title" +
        " FROM funding f ORDER BY id DESC"
    );
    res.status(200).json({ fundingList: rows });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
