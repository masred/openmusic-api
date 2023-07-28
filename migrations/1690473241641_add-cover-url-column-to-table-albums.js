/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.addColumns('albums', {
    cover_url: {
      type: 'TEXT',
      unique: true,
      default: null,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('albums', ['cover_url']);
};
