class PlaylistsHandler {
  constructor({ playlistsService, playlistSongsService, validator }) {
    this.playlistsService = playlistsService;
    this.playlistSongsService = playlistSongsService;
    this.validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
    this.postSongToPlaylistHandler = this.postSongToPlaylistHandler.bind(this);
    this.getSongsFromPlaylistsHandler = this.getSongsFromPlaylistsHandler.bind(this);
  }

  async postPlaylistHandler(req, h) {
    this.validator.validatePostPlaylistPayload(req.payload);

    const { id: authId } = req.auth.credentials;

    const playlistId = await this.playlistsService.addPlaylist(authId, req.payload);

    const response = h.response({
      status: 'success',
      data: { playlistId },
    });
    response.code(201);

    return response;
  }

  async getPlaylistsHandler(req) {
    const { id: authId } = req.auth.credentials;

    const playlists = await this.playlistsService.getPlaylists(authId);

    return {
      status: 'success',
      data: { playlists },
    };
  }

  async deletePlaylistByIdHandler(req) {
    const { id: authId } = req.auth.credentials;
    const { id } = req.params;

    await this.playlistsService.verifyPlaylistOwner(id, authId);
    await this.playlistsService.deletePlaylist(id);

    return {
      status: 'success',
      message: 'Playlist Deleted',
    };
  }

  async postSongToPlaylistHandler(req, h) {
    this.validator.validatePostPlaylistsSongsPayload(req.payload);

    const { id: authId } = req.auth.credentials;
    const { id } = req.params;

    await this.playlistsService.verifyPlaylistOwner(id, authId);
    await this.playlistSongsService.addSongToPlaylist(id, req.payload);

    const response = h.response({
      status: 'success',
      message: 'Song added to Playlist',
    });
    response.code(201);

    return response;
  }

  async getSongsFromPlaylistsHandler(req) {
    const { id: authId } = req.auth.credentials;
    const { id } = req.params;

    await this.playlistsService.verifyPlaylistOwner(id, authId);

    const playlist = await this.playlistsService.getPlaylistById(id);
    playlist.songs = await this.playlistSongsService.getSongsFromPlaylist(id);

    return {
      status: 'success',
      data: { playlist },
    };
  }

  async deleteSongFromPlaylistsHandler(req) {
    this.validator.validateDeletePlaylistsSongsPayload(req.payload);

    const { id: authId } = req.auth.credentials;
    const { id } = req.params;

    await this.playlistsService.verifyPlaylistOwner(id, authId);
    await this.playlistSongsService.deleteSongFromPlaylist(id, req.payload);

    return {
      status: 'success',
      message: 'Song deleted from Playlist',
    };
  }
}

module.exports = PlaylistsHandler;
