import axios from 'axios';

export default async function handler(req:any, res:any) {
  try {
    const data = {
      "tokenNumber" : 1000
    }
    const response = await axios.post(`http://34.22.105.181:3000/v1/claim/funder/${req.query.sessionId}`, {
      "tokenNumber" : 1000
    });
    console.log("api call");
    
    console.log(response.data);
    
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}