import express from "express";
import { body } from "express-validator";

import { CommonRoutesConfig } from "../common/common.routes.config";
import bodyValidationMiddleware from "../common/middleware/body.validation.middleware";
import commonPermissionMiddleware from "../common/middleware/common.permission.middleware";
import { PermissionLevel } from "../common/middleware/common.permissionlevel.enum";
import usersController from "./controllers/users.controller";
import usersMiddleware from "./middleware/users.middleware";
import jwtMiddleware from "../auth/middleware/jwt.middleware";

export class UsersRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "UsersRoutes");
  }

  configureRoutes() : express.Application {
    this.app
      .route(`${process.env.BASE_URL}/users`)
      .get(
        jwtMiddleware.validJWTNeeded,
        commonPermissionMiddleware.minimumPermissionLevelRequired(
          PermissionLevel.ADMIN_PERMISSION
        ),
        usersController.listUsers
      )
      .post(
        body("email").isEmail(),
        body("password")
          .isLength({ min: 6 })
          .withMessage("Password should be at least 6 characters"),
        bodyValidationMiddleware.verifyBodyFieldsErrors,
        usersMiddleware.validateSameEmailDoesntExist,
        usersController.createUser
      );

    this.app.param('userId', usersMiddleware.extractUserId);

    this.app
      .route(`${process.env.BASE_URL}/users/:userId`)
      .all(
        usersMiddleware.validateUserExists,
        jwtMiddleware.validJWTNeeded,
        commonPermissionMiddleware.onlySameUserOrAdminCanDoThisAction
      )
      .get(usersController.getUserById)
      .delete(usersController.removeUser);

    this.app.put(`${process.env.BASE_URL}/users/:userId`, [
      body("email").isEmail(),
      body("password")
        .isLength({ min: 6 })
        .withMessage("Password should be at least 6 characters"),
      body("firstName").isString(),
      body("lastName").isString(),
      body("permissionLevel").isInt(),
      bodyValidationMiddleware.verifyBodyFieldsErrors,
      usersMiddleware.validateSameEmailBelongToSameUser,
      usersMiddleware.userCantChangePermissionLevel,
      commonPermissionMiddleware.minimumPermissionLevelRequired(
        PermissionLevel.PAID_PERMISSION
      ),
      usersController.put,
    ]);

    this.app.patch(`${process.env.BASE_URL}/users/:userId`, [
      body("email").isEmail().optional(),
      body("password")
        .isLength({ min: 6 })
        .withMessage("Password should be at least 6 characters")
        .optional(),
      body("firstName").isString().optional(),
      body("lastName").isString().optional(),
      body("permissionLevel").isInt().optional(),
      bodyValidationMiddleware.verifyBodyFieldsErrors,
      usersMiddleware.validatePatchEmail,
      usersMiddleware.userCantChangePermissionLevel,
      commonPermissionMiddleware.minimumPermissionLevelRequired(
        PermissionLevel.PAID_PERMISSION
      ),
      usersController.patch,
    ]);

    this.app.put(`${process.env.BASE_URL}/users/:userId/permissionLevel/:permissionLevel`, [
      jwtMiddleware.validJWTNeeded,
      commonPermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
      commonPermissionMiddleware.minimumPermissionLevelRequired(
          PermissionLevel.FREE_PERMISSION
      ),
      usersController.updatePermissionLevel,
  ]);

    return this.app;
  }
}
