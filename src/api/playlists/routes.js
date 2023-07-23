const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists',
    handler: (req, h) => handler.postPlaylistHandler(req, h),
    options: { auth: 'playlist_auth' },
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: (req) => handler.getPlaylistsHandler(req),
    options: { auth: 'playlist_auth' },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}',
    handler: (req) => handler.deletePlaylistByIdHandler(req),
    options: { auth: 'playlist_auth' },
  },
  {
    method: 'POST',
    path: '/playlists/{id}/songs',
    handler: (req, h) => handler.postSongToPlaylistHandler(req, h),
    options: { auth: 'playlist_auth' },
  },
  {
    method: 'GET',
    path: '/playlists/{id}/songs',
    handler: (req) => handler.getSongsFromPlaylistsHandler(req),
    options: { auth: 'playlist_auth' },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}/songs',
    handler: (req) => handler.deleteSongFromPlaylistsHandler(req),
    options: { auth: 'playlist_auth' },
  },
];

module.exports = routes;
