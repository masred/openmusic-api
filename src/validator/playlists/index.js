const InvariantError = require('../../exceptions/InvariantError');
const { PostPlaylistsPayloadSchema, PostPlaylistSongsPayloadSchema, DeletePlaylistSongsPayloadSchema } = require('./schema');

const PlaylistsValidator = {
  validatePostPlaylistPayload: (payload) => {
    const validationResult = PostPlaylistsPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validatePostPlaylistsSongsPayload: (payload) => {
    const validationResult = PostPlaylistSongsPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateDeletePlaylistsSongsPayload: (payload) => {
    const validationResult = DeletePlaylistSongsPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistsValidator;
