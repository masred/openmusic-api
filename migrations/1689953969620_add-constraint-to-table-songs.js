/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.addConstraint('songs', 'fk_songs_album_id', 'FOREIGN KEY(album_id) REFERENCES albums(id) ON DELETE SET DEFAULT');
};

exports.down = (pgm) => {
  pgm.dropConstraint('songs', 'fk_songs_album_id');
};
