import axios from 'axios';

export default async function handler(req:any, res:any) {
  try {
    const response = await axios.get(`http://34.22.105.181:3000/v1/claim/authentication`, {
     
    });
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}