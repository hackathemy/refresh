import axios from 'axios';

export default async function handler(req:any, res:any) {
  try {

    const response = await axios.post(`http://34.22.105.181:3003/v1/contract/deploy`, {
      "builder":"0xa763ebb58Fc66220F208e697E585a4197A941c84",
      "votesTheshhold":1,
      "tokenAddress":"0x844c811c0dc060808ac024b6e300499cbbd574b7"
    });
    console.log("api call");
    
    console.log(response.data);
    
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}