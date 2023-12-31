const config = require('../../utils/config');

module.exports = class AlbumsHandler {
  constructor(service, validator, storageService, albumLikesService) {
    this.service = service;
    this.validator = validator;
    this.storageService = storageService;
    this.albumLikesService = albumLikesService;
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
    const baseUrl = `http://${config.app.host}:${config.app.port}/albums`;

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

  async postAlbumLikeHandler(req, h) {
    const { id } = req.params;
    const { id: authId } = req.auth.credentials;

    await this.service.getAlbumById(id);

    const isAlbumLiked = await this.albumLikesService.isAlbumLiked(id, authId);

    if (isAlbumLiked) {
      const response = h.response({
        status: 'fail',
        message: 'Album already liked',
      });
      response.code(400);

      return response;
    }

    await this.albumLikesService.likeAnAlbum(id, authId);

    const response = h.response({
      status: 'success',
      message: 'Album liked',
    });
    response.code(201);

    return response;
  }

  async getAlbumLikesHandler(req, h) {
    const { id } = req.params;
    const cache = await this.albumLikesService.cachedAlbumLikesCount(id);

    if (cache) {
      const response = h.response({
        status: 'success',
        data: { likes: +cache },
      });
      response.header('X-Data-Source', 'cache');

      return response;
    }

    const likes = await this.albumLikesService.albumLikesCount(id);

    return {
      status: 'success',
      data: { likes },
    };
  }

  async deleteAlbumLikeHandler(req, h) {
    const { id } = req.params;
    const { id: authId } = req.auth.credentials;

    await this.service.getAlbumById(id);

    const isAlbumLiked = await this.albumLikesService.isAlbumLiked(id, authId);

    if (!isAlbumLiked) {
      const response = h.response({
        status: 'fail',
        message: 'You have not liked this album',
      });
      response.code(400);

      return response;
    }

    await this.albumLikesService.dislikeAnAlbum(id, authId);

    return h.response({
      status: 'success',
      message: 'Album disliked',
    });
  }
};
