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
];
