const assert = require('assert');
const { query } = require('../path/to/your/database');

describe('Database Tests', () => {
  it('should return at least one result from a raw query', async () => {
    const result = await query('SELECT * FROM your_table LIMIT 1');
    assert(result.length > 0, 'Query should return at least one result');
  });
});