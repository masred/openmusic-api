const path = require('path');

module.exports = (handler) => [
  {
    method: 'POST',
    path: '/albums',
    handler: (req, h) => handler.postAlbumHandler(req, h),
  },
  {
    method: 'GET',
    path: '/albums/{id}',
    handler: (req) => handler.getAlbumByIdHandler(req),
  },
  {
    method: 'PUT',
    path: '/albums/{id}',
    handler: (req) => handler.putAlbumByIdHandler(req),
  },
  {
    method: 'DELETE',
    path: '/albums/{id}',
    handler: (req) => handler.deleteAlbumByIdHandler(req),
  },
  {
    method: 'POST',
    path: '/albums/{id}/covers',
    handler: (req, h) => handler.postAlbumCoverHandler(req, h),
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 512000,
      },
    },
  },
  {
    method: 'GET',
    path: '/albums/{param*}',
    handler: {
      directory: {
        path: path.resolve(__dirname, 'storage'),
      },
    },
  },
  {
    method: 'POST',
    path: '/albums/{id}/likes',
    handler: (req, h) => handler.postAlbumLikeHandler(req, h),
    options: { auth: 'auth' },
  },
  {
    method: 'GET',
    path: '/albums/{id}/likes',
    handler: (req, h) => handler.getAlbumLikesHandler(req, h),
  },
  {
    method: 'DELETE',
    path: '/albums/{id}/likes',
    handler: (req, h) => handler.deleteAlbumLikeHandler(req, h),
    options: { auth: 'auth' },
  },
];
