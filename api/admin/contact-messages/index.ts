import { VercelRequest, VercelResponse } from '@vercel/node';
import { getAllContactMessages } from '../../../api/_storage';

export default function handler(req: VercelRequest, res: VercelResponse){
  // simple admin auth using header + env var
  const token = req.headers['x-admin-token'];
  if(!token || token !== process.env.ADMIN_TOKEN) return res.status(401).json({ message: 'Unauthorized' });

  if(req.method === 'GET'){
    return res.status(200).json(getAllContactMessages());
  }
  return res.status(405).json({ message: 'Method not allowed' });
}
