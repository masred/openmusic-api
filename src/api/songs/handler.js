module.exports = class SongsHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;
  }

  async postSongHandler(request, h) {
    this.validator.SongsValidator.validateSongPayload(request.payload);

    const songId = await this.service.addSong(request.payload);

    const response = h.response({
      status: 'success',
      message: 'Song successfully added',
      data: {
        songId,
      },
    });

    response.code(201);
    return response;
  }

  async getSongsHandler(request) {
    const songs = await this.service.getSongs(request.query);

    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  async getSongByIdHandler(request) {
    const { id } = request.params;
    const song = await this.service.getSongById(id);
    return {
      status: 'success',
      data: {
        song,
      },
    };
  }

  async putSongByIdHandler(request) {
    this.validator.SongsValidator.validateSongPayload(request.payload);
    const { id } = request.params;

    await this.service.editSongById(id, request.payload);
    return {
      status: 'success',
      message: 'Song successfully updated',
    };
  }

  async deleteSongByIdHandler(request) {
    const { id } = request.params;
    await this.service.deleteSongById(id);

    return {
      status: 'success',
      message: 'Song successfully deleted',
    };
  }
};
