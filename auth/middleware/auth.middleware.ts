import express from "express";
import * as argon2 from "argon2";

import UsersService from "../../users/services/users.service";

class AuthMiddleWare {
  async verifyUserPassword(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const user: any = await UsersService.getUserByEmailWithPassword(
      req.body.email
    );

    if (user) {
      const passwordHash = user.password;

      if (await argon2.verify(passwordHash, req.body.password)) {
        const { _id, email, permissionLevel } = user;
        req.body = {
          userId: _id,
          email,
          permissionLevel,
        };
        return next();
      }
    }
    res.status(400).send({ errors: ["Invalid email and/or password"] });
  }
}

export default new AuthMiddleWare();
