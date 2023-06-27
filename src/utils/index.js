/* eslint-disable camelcase */
const bindAlbumToModel = ({
  id, name, year, songs,
}) => ({
  id, name, year, songs,
});
const bindSongToModel = ({
  id, title, year, performer, genre, duration, album_id,
}) => ({
  id, title, year, performer, genre, duration, albumId: album_id,
});

module.exports = { bindAlbumToModel, bindSongToModel };
