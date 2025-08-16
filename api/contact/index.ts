import { createContactMessage } from '../../api/_storage';

export default function handler(req: any, res: any){
  if (req.method === 'POST'){
    const data = req.body;
    const msg = createContactMessage(data);
    return res.status(201).json(msg);
  }
  return res.status(405).json({ message: 'Method not allowed' });
}
