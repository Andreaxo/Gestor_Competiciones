const { Strategy, ExtractJwt } = require("passport-jwt");
const config = require("./../../../config");
const boom = require("@hapi/boom");

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.app.jwtSecret,
};

const JwtStrategy = new Strategy(options, (payload, done) => {
  return done(null, payload);
});
module.exports = JwtStrategy;
