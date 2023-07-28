const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class AlbumLikesService {
  constructor(cacheService) {
    this.pool = new Pool();
    this.cacheService = cacheService;
  }

  albumLikesCacheKey = 'album-likes:';

  async likeAnAlbum(albumId, userId) {
    const id = `like-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, albumId, userId],
    };
    const { rowCount } = await this.pool.query(query);

    if (!rowCount) {
      throw new InvariantError('Fail to like an album');
    }

    await this.cacheService.del(`${this.albumLikesCacheKey}${albumId}`);
  }

  async dislikeAnAlbum(albumId, userId) {
    const query = {
      text: 'DELETE FROM album_likes WHERE album_id = $1 AND user_id = $2 RETURNING id',
      values: [albumId, userId],
    };
    const { rowCount } = await this.pool.query(query);

    if (!rowCount) {
      throw new InvariantError('Fail to dislike an album');
    }

    await this.cacheService.del(`${this.albumLikesCacheKey}${albumId}`);
  }

  async isAlbumLiked(albumId, userId) {
    const query = {
      text: 'SELECT id FROM album_likes WHERE album_id = $1 AND user_id = $2',
      values: [albumId, userId],
    };
    const { rowCount } = await this.pool.query(query);

    if (!rowCount) {
      return false;
    }

    return true;
  }

  async albumLikesCount(albumId) {
    const query = {
      text: 'SELECT id FROM album_likes WHERE album_id = $1',
      values: [albumId],
    };
    const { rowCount } = await this.pool.query(query);
    await this.cacheService.set(`${this.albumLikesCacheKey}${albumId}`, rowCount, 1800);

    return rowCount;
  }

  async cachedAlbumLikesCount(albumId) {
    const cache = await this.cacheService.get(`${this.albumLikesCacheKey}${albumId}`);
    return cache;
  }
}

module.exports = AlbumLikesService;
