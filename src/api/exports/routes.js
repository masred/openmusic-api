const routes = (handler) => [
  {
    method: 'POST',
    path: '/export/playlists/{id}',
    handler: (req, h) => handler.postExportPlaylistByIdHandler(req, h),
    options: { auth: 'auth' },
  },
];

module.exports = routes;
