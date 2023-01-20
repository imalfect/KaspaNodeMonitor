// Status
import {router} from '../index.js';
export default router.get('/api/status', (req, res) => {
  res.json({
    status: 'OK',
  });
});
