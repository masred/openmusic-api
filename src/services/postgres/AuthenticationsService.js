const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

module.exports = class AuthenticationsService {
  constructor() {
    this.pool = new Pool();
  }

  async addToken(token) {
    const query = {
      text: 'INSERT INTO authentications VALUES ($1)',
      values: [token],
    };
    await this.pool.query(query);
  }

  async validateToken(token) {
    const query = {
      text: 'SELECT * FROM authentications WHERE token = $1',
      values: [token],
    };
    const { rowCount } = await this.pool.query(query);

    if (!rowCount) {
      throw new InvariantError('Invalid Token');
    }
  }

  async deleteToken(token) {
    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token],
    };
    await this.pool.query(query);
  }
};
