// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcrypt');
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const AuthenticationError = require('../../exceptions/AuthenticationError');
const InvariantError = require('../../exceptions/InvariantError');

module.exports = class UsersService {
  constructor() {
    this.pool = new Pool();
  }

  async addUser({ username, password, fullname }) {
    await this.validateUsername(username);

    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = {
      text: `
        INSERT INTO users (id, username, password, fullname) VALUES(
          $1, $2, $3, $4
        ) RETURNING id
      `,
      values: [id, username, hashedPassword, fullname],
    };
    const { rows } = await this.pool.query(query);

    if (!rows.length) {
      throw new InvariantError('Fail to Add User');
    }

    return rows[0].id;
  }

  async validateUsername(username) {
    const query = {
      text: 'SELECT * FROM users WHERE username = $1',
      values: [username],
    };
    const { rowCount } = await this.pool.query(query);

    if (rowCount) {
      throw new InvariantError('Username already in use');
    }
  }

  async verifyCredential({ username, password }) {
    const query = {
      text: 'SELECT * FROM users WHERE username = $1',
      values: [username],
    };
    const { rows } = await this.pool.query(query);

    if (!rows.length) {
      throw new AuthenticationError('Wrong username or password');
    }

    const { id, password: hashedPassword } = rows[0];
    const isPasswordMatch = await bcrypt.compare(password, hashedPassword);

    if (!isPasswordMatch) {
      throw new AuthenticationError('Wrong username or password');
    }

    return id;
  }
};
