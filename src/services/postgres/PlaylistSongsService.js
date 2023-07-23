const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistSongsService {
  constructor(songsService) {
    this.pool = new Pool();
    this.songsService = songsService;
  }

  async addSongToPlaylist(id, { songId }) {
    await this.songsService.getSongById(songId);

    const relationId = `playlists.songs-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlist_songs VALUES ($1, $2, $3) RETURNING id',
      values: [relationId, id, songId],
    };
    const { rowCount } = await this.pool.query(query);

    if (!rowCount) {
      throw new InvariantError('Failed to add song into playlist');
    }
  }

  async getSongsFromPlaylist(id) {
    const query = {
      text: 'SELECT songs.id, songs.title, songs.performer FROM playlist_songs RIGHT JOIN songs ON playlist_songs.song_id = songs.id WHERE playlist_songs.playlist_id = $1 GROUP BY songs.id',
      values: [id],
    };
    const { rows } = await this.pool.query(query);

    return rows;
  }

  async deleteSongFromPlaylist(id, { songId }) {
    await this.songsService.getSongById(songId);

    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [id, songId],
    };
    const { rowCount } = await this.pool.query(query);

    if (!rowCount) {
      throw new NotFoundError(
        'Failed to delete song from playlist. Song not found',
      );
    }
  }
}

module.exports = PlaylistSongsService;
