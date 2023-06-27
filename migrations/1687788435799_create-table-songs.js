/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    title: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    year: {
      type: 'INT',
      notNull: true,
    },
    performer: {
      type: 'VARCHAR(20)',
      notNull: true,
    },
    genre: {
      type: 'VARCHAR(20)',
      notNull: true,
    },
    duration: {
      type: 'INTEGER',
    },
    album_id: {
      type: 'VARCHAR(50)',
      refereces: 'albums(id)',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('songs');
};
