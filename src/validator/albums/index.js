const InvariantError = require('../../exceptions/InvariantError');
const { AlbumPayloadSchema, imageHeadersSchema } = require('./schema');

const AlbumsValidator = {
  validateAlbumPayload: (payload) => {
    const validationResult = AlbumPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePostAlbumCoverHeader: (header) => {
    const validationResult = imageHeadersSchema.validate(header);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = { AlbumsValidator };
