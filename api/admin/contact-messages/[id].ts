import { getContactMessageById, markContactMessageAsRead } from '../../../api/_storage';

export default function handler(req: any, res: any){
  const token = req.headers['x-admin-token'];
  if(!token || token !== process.env.ADMIN_TOKEN) return res.status(401).json({ message: 'Unauthorized' });

  const { id } = req.query as any;
  const sid = parseInt(id);
  if (req.method === 'GET'){
    const m = getContactMessageById(sid);
    if(!m) return res.status(404).json({ message: 'Contact message not found' });
    return res.status(200).json(m);
  }

  if (req.method === 'PATCH'){
    const m = markContactMessageAsRead(sid);
    if(!m) return res.status(404).json({ message: 'Contact message not found' });
    return res.status(200).json(m);
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
