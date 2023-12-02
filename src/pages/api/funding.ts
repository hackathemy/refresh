import { NextApiRequest, NextApiResponse } from "next";
import pool from "../../db/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method == "POST") {
      console.log(req.body);
      // const address = req.body.address;
      // const [rows]: any = await pool.query(
      //   `SELECT * FROM funding WHERE address = ${address}`
      // );
    }
    res.status(200).json({});
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
