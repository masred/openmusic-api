const InvariantError = require('../../exceptions/InvariantError');
const Schemas = require('./schema');

const ExportsValidator = {
  validatePostPlaylistsPayload: (payload) => {
    const validationResult = Schemas.PostPlaylistsSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = ExportsValidator;
