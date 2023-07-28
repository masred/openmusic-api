exports.up = (pgm) => {
  pgm.createTable('album_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    album_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  pgm.addConstraint(
    'album_likes',
    'fk_album_likes.album_id',
    'FOREIGN KEY(album_id) REFERENCES albums(id) ON DELETE CASCADE',
  );

  pgm.addConstraint(
    'album_likes',
    'fk_album_likes.user_id',
    'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint('album_likes', 'fk_album_likes.user_id');
  pgm.dropConstraint('album_likes', 'fk_album_likes.album_id');
  pgm.dropTable('album_likes');
};
