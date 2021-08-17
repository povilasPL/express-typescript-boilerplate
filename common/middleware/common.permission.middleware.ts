import express from "express";
import debug from "debug";

import { PermissionLevel } from "./common.permissionlevel.enum";

const log: debug.IDebugger = debug("app:common-permission-middleware");

class CommonPermissionMiddleware {
  minimumPermissionLevelRequired(requiredPermissionLevel: PermissionLevel) {
    return (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      try {
        const userPermissionLevel = parseInt(res.locals.jwt.permissionLevel);
        if (userPermissionLevel & requiredPermissionLevel) {
          next();
        } else {
          res.status(403).send();
        }
      } catch (e) {
        log(e);
      }
    };
  }

  async onlySameUserOrAdminCanDoThisAction(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const userPermissionLevel = parseInt(res.locals.jwt.permissionLevel);
    if (
      req.params &&
      req.params.userId &&
      req.params.userId === res.locals.jwt.userId
    ) {
      return next();
    } else {
      if (userPermissionLevel & PermissionLevel.ADMIN_PERMISSION) {
        return next();
      } else {
        return res.status(403).send();
      }
    }
  }
}

export default new CommonPermissionMiddleware();
