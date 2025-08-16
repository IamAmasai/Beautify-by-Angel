import { getServiceById } from '../../api/_storage';

export default function handler(req: any, res: any) {
  const { id } = req.query as any;
  const sid = parseInt(id);
  if (req.method === 'GET') {
    const s = getServiceById(sid);
    if (!s) return res.status(404).json({ message: 'Service not found' });
    return res.status(200).json(s);
  }
  return res.status(405).json({ message: 'Method not allowed' });
}
