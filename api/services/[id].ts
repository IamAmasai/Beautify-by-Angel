import { VercelRequest, VercelResponse } from '@vercel/node';
import { getServiceById } from '../../api/_storage';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query as any;
  const sid = parseInt(id);
  if(req.method === 'GET'){
    const s = getServiceById(sid);
    if(!s) return res.status(404).json({ message: 'Service not found' });
    return res.status(200).json(s);
  }
  return res.status(405).json({ message: 'Method not allowed' });
}
