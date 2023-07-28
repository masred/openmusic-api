module.exports = class AlbumsHandler {
  constructor(service, validator, storageService) {
    this.service = service;
    this.validator = validator;
    this.storageService = storageService;
  }

  async postAlbumHandler(request, h) {
    this.validator.AlbumsValidator.validateAlbumPayload(request.payload);
    const { name, year } = request.payload;

    const albumId = await this.service.addAlbum({ name, year });

    const response = h.response({
      status: 'success',
      message: 'Album successfully added',
      data: {
        albumId,
      },
    });

    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request) {
    const { id } = request.params;
    const album = await this.service.getAlbumById(id);
    return {
      status: 'success',
      data: {
        album,
      },
    };
  }

  async putAlbumByIdHandler(request) {
    this.validator.AlbumsValidator.validateAlbumPayload(request.payload);
    const { id } = request.params;

    await this.service.editAlbumById(id, request.payload);
    return {
      status: 'success',
      message: 'Album successfully updated',
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { id } = request.params;
    await this.service.deleteAlbumById(id);

    return {
      status: 'success',
      message: 'Album successfully deleted',
    };
  }

  async postAlbumCoverHandler(req, h) {
    const baseUrl = `http://${process.env.HOST}:${process.env.PORT}/albums`;

    const { id } = req.params;
    const { cover } = req.payload;

    this.validator.AlbumsValidator.validatePostAlbumCoverHeader(cover.hapi.headers);

    const fileName = await this.storageService.writeFile(cover, id, 'cover');

    await this.service.addCoverUrlOnAlbum(id, `${baseUrl}/covers/${fileName}`);

    const response = h.response({
      status: 'success',
      message: 'Cover uploaded.',
    });
    response.code(201);

    return response;
  }
};
