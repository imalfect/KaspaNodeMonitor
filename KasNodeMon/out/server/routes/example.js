import {router} from '../index.js';

export default router.get('/api/example', function(req, res) {
  res.json('Hello from Kaspa Node Monitor!');
});
