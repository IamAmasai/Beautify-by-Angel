import { getAllServices } from '../../api/_storage';

export default function handler(req: any, res: any) {
  if (req.method === 'GET') {
    res.status(200).json(getAllServices());
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
