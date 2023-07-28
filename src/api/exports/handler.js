class ExportsHandler {
  constructor({ producerService, playlistsService, validator }) {
    this.producerService = producerService;
    this.playlistsService = playlistsService;
    this.validator = validator;
  }

  async postExportPlaylistByIdHandler(req, h) {
    this.validator.validatePostPlaylistsPayload(req.payload);

    const { id } = req.params;
    const { id: authId } = req.auth.credentials;
    const { targetEmail } = req.payload;

    await this.playlistsService.verifyPlaylistOwner(id, authId);

    const message = {
      playlistId: id,
      targetEmail,
    };

    await this.producerService.sendMessage('export:playlists', JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'We are processing your request',
    });
    response.code(201);

    return response;
  }
}

module.exports = ExportsHandler;
