/* eslint-disable camelcase */
const bindAlbumToModel = ({
  id, name, year, coverUrl, songs,
}) => ({
  id, name, year, coverUrl, songs,
});
const bindSongToModel = ({
  id, title, year, performer, genre, duration, album_id,
}) => ({
  id, title, year, performer, genre, duration, albumId: album_id,
});

module.exports = { bindAlbumToModel, bindSongToModel };
