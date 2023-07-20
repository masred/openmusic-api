module.exports = class AuthenticationsHandler {
  constructor({
    authenticationsService, usersService,
    tokenManager, validator,
  }) {
    this.authenticationsService = authenticationsService;
    this.usersService = usersService;
    this.tokenManager = tokenManager;
    this.validator = validator;
  }

  async postAuthenticationHandler(req, h) {
    this.validator.validatePostAuthenticationPayload(req.payload);

    const id = await this.usersService.verifyCredential(req.payload);
    const accessToken = this.tokenManager.generateAccessToken({ id });
    const refreshToken = this.tokenManager.generateRefreshToken({ id });

    await this.authenticationsService.addToken(refreshToken);

    const response = h.response({
      status: 'success',
      data: {
        accessToken,
        refreshToken,
      },
    });
    response.code(201);

    return response;
  }

  async putAuthenticationHandler(req) {
    this.validator.validatePutAuthenticationPayload(req.payload);

    const { refreshToken } = req.payload;

    await this.authenticationsService.validateToken(refreshToken);

    const tokenPayload = this.tokenManager.verifyRefreshToken(refreshToken);
    const accessToken = this.tokenManager.generateAccessToken(tokenPayload);

    return {
      status: 'success',
      data: {
        accessToken,
      },
    };
  }

  async deleteAuthenticationHandler(req) {
    this.validator.validateDeleteAuthenticationPayload(req.payload);

    const { refreshToken } = req.payload;

    await this.authenticationsService.validateToken(refreshToken);
    await this.authenticationsService.deleteToken(refreshToken);

    return {
      status: 'success',
      message: 'Logged out successfully',
    };
  }
};
