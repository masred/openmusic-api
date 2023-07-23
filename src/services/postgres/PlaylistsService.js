const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsService {
  constructor() {
    this.pool = new Pool();
  }

  async addPlaylist(owner, { name }) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };
    const { rows } = await this.pool.query(query);

    if (!rows.length) {
      throw new InvariantError('Failed to add playlist');
    }

    return rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: 'SELECT playlists.id, playlists.name, users.username FROM playlists LEFT JOIN users ON playlists.owner = users.id WHERE playlists.owner = $1',
      values: [owner],
    };
    const { rows } = await this.pool.query(query);

    return rows;
  }

  async getPlaylistById(id) {
    const query = {
      text: 'SELECT playlists.id, playlists.name, users.username FROM playlists LEFT JOIN users ON playlists.owner = users.id WHERE playlists.id = $1',
      values: [id],
    };
    const { rows } = await this.pool.query(query);

    if (!rows.length) {
      throw new NotFoundError('Playlist Not Found');
    }

    return rows[0];
  }

  async deletePlaylist(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };
    const { rowCount } = await this.pool.query(query);

    if (!rowCount) {
      throw new NotFoundError(
        'Failed to delete playlist. Playlist id not found',
      );
    }
  }

  async verifyPlaylistOwner(id, userId) {
    const query = {
      text: 'SELECT owner FROM playlists WHERE id = $1',
      values: [id],
    };
    const { rows } = await this.pool.query(query);

    if (!rows.length) {
      throw new NotFoundError('Playlist Not Found');
    }

    if (rows[0].owner !== userId) {
      throw new AuthorizationError('Only owners are allowed');
    }
  }

  async verifyPlaylistAccess(id, userId) {
    try {
      await this.verifyPlaylistOwner(id, userId);
    } catch (e) {
      if (!(e instanceof AuthorizationError)) {
        throw e;
      }
    }
  }
}

module.exports = PlaylistsService;
