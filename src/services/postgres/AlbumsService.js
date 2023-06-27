const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const { bindAlbumToModel } = require('../../utils');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumsService {
  constructor() {
    this.pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };

    const result = await this.pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Failed to add Album');
    }

    return result.rows[0].id;
  }

  async getAlbumById(id) {
    const albumQuery = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };
    const result = await this.pool.query(albumQuery);

    if (!result.rows[0]) {
      throw new NotFoundError('Album not found');
    }

    const songsQuery = {
      text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
      values: [id],
    };

    const songsQResult = await this.pool.query(songsQuery);
    result.rows[0].songs = songsQResult.rows;

    return result.rows.map(bindAlbumToModel)[0];
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };

    const result = await this.pool.query(query);
    if (!result.rows[0]) {
      throw new NotFoundError('Album not found');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this.pool.query(query);

    if (!result.rows[0]) {
      throw new NotFoundError('Album not found');
    }
  }
}

module.exports = AlbumsService;
