import express from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import { Jwt } from "../../common/types/jwt";
import usersService from "../../users/services/users.service";

const jwtSecret = `${process.env.JWT_SECRET}`;

class JwtMiddleware {
  verifyRefreshBodyField(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (req.body && req.body.refreshToken) {
      return next();
    }
    return res
      .status(400)
      .send({ errors: ["Missing required field: refreshToken"] });
  }

  async validRefreshNeeded(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const user: any = await usersService.getUserByEmailWithPassword(
      res.locals.jwt.email
    );

    const salt = crypto.createSecretKey(
      Buffer.from(res.locals.jwt.refreshKey.data)
    );

    const hash = crypto
      .createHmac("sha512", salt)
      .update(res.locals.jwt.userId + jwtSecret)
      .digest("base64");

    if (hash === req.body.refreshToken) {
      const { _id, email, permissionLevel } = user;

      req.body = {
        userId: _id,
        email,
        permissionLevel,
      };

      return next();
    }

    return res.status(400).send({ errors: ["Invalid refresh token"] });
  }

  async validJWTNeeded(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (req.headers["authorization"]) {
      try {
        const authorization = req.headers["authorization"].split(" ");

        if (authorization[0] !== "Bearer") {
          return res.status(400).send();
        }

        res.locals.jwt = jwt.verify(authorization[1], jwtSecret) as Jwt;
        next();
      } catch (err) {
        return res.status(403).send();
      }
    } else {
      return res.status(401).send();
    }
  }
}

export default new JwtMiddleware();
