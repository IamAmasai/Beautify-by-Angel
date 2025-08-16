import { VercelRequest, VercelResponse } from '@vercel/node';
import { getAllServices } from '../../api/_storage';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if(req.method === 'GET'){
    res.status(200).json(getAllServices());
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
