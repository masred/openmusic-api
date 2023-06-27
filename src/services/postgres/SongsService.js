const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const { bindSongToModel } = require('../../utils');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongsService {
  constructor() {
    this.pool = new Pool();
  }

  async addSong({
    title, year, performer, genre, duration, albumId,
  }) {
    const id = `song-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, performer, genre, duration, albumId],
    };

    const result = await this.pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Failed to add song');
    }

    return result.rows[0].id;
  }

  async getSongs({ title, performer }) {
    const titleString = (title || '');
    const performerString = (performer || '');

    const query = {
      text: `
          SELECT id, title, performer FROM songs
          WHERE title ILIKE $1 AND performer ILIKE $2
        `,
      values: [`%${titleString}%`, `%${performerString}%`],
    };

    const result = await this.pool.query(query);

    return result.rows.map(bindSongToModel);
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };
    const result = await this.pool.query(query);

    if (!result.rows[0]) {
      throw new NotFoundError('Song not found');
    }

    return result.rows.map(bindSongToModel)[0];
  }

  async editSongById(id, {
    title, year, performer, genre, duration, albumId,
  }) {
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, album_id = $6 WHERE id = $7 RETURNING id',
      values: [title, year, performer, genre, duration, albumId, id],
    };

    const result = await this.pool.query(query);
    if (!result.rows[0]) {
      throw new NotFoundError('Song not found');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this.pool.query(query);

    if (!result.rows[0]) {
      throw new NotFoundError('Song not found');
    }
  }
}

module.exports = SongsService;
