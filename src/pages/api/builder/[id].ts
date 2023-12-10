import axios from 'axios';

export default async function handler(req:any, res:any) {
  try {
    const response = await axios.get(`http://34.22.105.181:3001/v1/votes/funder/${req.query.id}`, {
      headers: {
        'Content-Type': 'application/json',
        // 필요한 경우에 API 키 등의 헤더 추가
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}