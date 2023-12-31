/* eslint-disable import/no-extraneous-dependencies */
require('dotenv').config();

const path = require('path');
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const inert = require('@hapi/inert');
const ClientError = require('./exceptions/ClientError');
const StorageService = require('./services/storage/StorageService');
const CacheService = require('./services/redis/CacheService');

const albums = require('./api/albums');
const AlbumsService = require('./services/postgres/AlbumsService');
const AlbumsValidator = require('./validator/albums');
const AlbumLikesService = require('./services/postgres/AlbumLikesService');

const songs = require('./api/songs');
const SongsService = require('./services/postgres/SongsService');
const SongsValidator = require('./validator/songs');

const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const AuthenticationsValidator = require('./validator/authentications');
const tokenManager = require('./tokenize/TokenManager');

const playlists = require('./api/playlists');
const PlaylistsService = require('./services/postgres/PlaylistsService');
const PlaylistSongsService = require('./services/postgres/PlaylistSongsService');
const PlaylistsValidator = require('./validator/playlists');

const exportsPlugin = require('./api/exports');
const producerService = require('./services/rabbitmq/ProducerService');
const ExportsValidator = require('./validator/exports');
const config = require('./utils/config');

const init = async () => {
  const cacheService = new CacheService();
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const playlistsService = new PlaylistsService();
  const playlistSongsService = new PlaylistSongsService(songsService);
  const storageAlbumsService = new StorageService(path.resolve(__dirname, 'api/albums/storage/covers'));
  const albumLikesService = new AlbumLikesService(cacheService);

  const server = Hapi.server({
    port: config.app.port,
    host: config.app.host,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    { plugin: Jwt },
    { plugin: inert },
  ]);

  server.auth.strategy('auth', 'jwt', {
    keys: config.jwt.accessTokenKey,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: config.jwt.accessTokenAge,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: AlbumsValidator,
        storageService: storageAlbumsService,
        albumLikesService,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        playlistsService,
        playlistSongsService,
        validator: PlaylistsValidator,
      },
    },
    {
      plugin: exportsPlugin,
      options: {
        producerService,
        playlistsService,
        validator: ExportsValidator,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;
    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }
      if (!response.isServer) {
        return h.continue;
      }
      const newResponse = h.response({
        status: 'error',
        message: 'Internal server error',
      });
      newResponse.code(500);
      return newResponse;
    }
    return h.continue;
  });

  await server.start();
  console.log(`Server started on ${server.info.uri}`);
};

init();
