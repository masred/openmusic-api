module.exports = class SongsHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  async postSongHandler(request, h) {
    this.validator.SongsValidator.validateSongPayload(request.payload);
    const {
      title, year, genre, performer, duration, albumId,
    } = request.payload;

    const songId = await this.service.addSong({
      title, year, genre, performer, duration, albumId,
    });

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
        songs: songs.map(({ id, title, performer }) => ({ id, title, performer })),
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
