import { getAllContactMessages } from '../../../api/_storage';

export default function handler(req: any, res: any){
  const token = req.headers['x-admin-token'];
  if(!token || token !== process.env.ADMIN_TOKEN) return res.status(401).json({ message: 'Unauthorized' });

  if (req.method === 'GET'){
    return res.status(200).json(getAllContactMessages());
  }
  return res.status(405).json({ message: 'Method not allowed' });
}
