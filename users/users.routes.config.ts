import express from "express";
import { body } from "express-validator";

import { CommonRoutesConfig } from "../common/common.routes.config";
import UsersController from "./controllers/users.controller";
import UsersMiddleware from "./middleware/users.middleware";
import BodyValidationMiddleware from "../common/middleware/body.validation.middleware";
import jwtMiddleware from "../auth/middleware/jwt.middleware";
import commonPermissionMiddleware from "../common/middleware/common.permission.middleware";
import { PermissionLevel } from "../common/middleware/common.permissionlevel.enum";

export class UsersRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "UsersRoutes");
  }

  configureRoutes() {
    this.app
      .route(`/users`)
      .get(
        jwtMiddleware.validJWTNeeded,
        commonPermissionMiddleware.minimumPermissionLevelRequired(
          PermissionLevel.ADMIN_PERMISSION
        ),
        UsersController.listUsers
      )
      .post(
        body("email").isEmail(),
        body("password")
          .isLength({ min: 6 })
          .withMessage("Password should be at least 6 characters"),
        BodyValidationMiddleware.verifyBodyFieldsErrors,
        UsersMiddleware.validateSameEmailDoesntExist,
        UsersController.createUser
      );

    this.app.param(`userId`, UsersMiddleware.extractUserId);

    this.app
      .route(`/users/:userId`)
      .all(
        UsersMiddleware.validateUserExists,
        jwtMiddleware.validJWTNeeded,
        commonPermissionMiddleware.onlySameUserOrAdminCanDoThisAction
      )
      .get(UsersController.getUserById)
      .delete(UsersController.removeUser);

    this.app.put(`/users/:userId`, [
      body("email").isEmail(),
      body("password")
        .isLength({ min: 6 })
        .withMessage("Password should be at least 6 characters"),
      body("firstName").isString(),
      body("lastName").isString(),
      body("permissionLevel").isInt(),
      BodyValidationMiddleware.verifyBodyFieldsErrors,
      UsersMiddleware.validateSameEmailBelongToSameUser,
      UsersMiddleware.userCantChangePermissionLevel,
      commonPermissionMiddleware.minimumPermissionLevelRequired(
        PermissionLevel.PAID_PERMISSION
      ),
      UsersController.put,
    ]);

    this.app.patch(`/users/:userId`, [
      body("email").isEmail().optional(),
      body("password")
        .isLength({ min: 6 })
        .withMessage("Password should be at least 6 characters")
        .optional(),
      body("firstName").isString().optional(),
      body("lastName").isString().optional(),
      body("permissionLevel").isInt().optional(),
      BodyValidationMiddleware.verifyBodyFieldsErrors,
      UsersMiddleware.validatePatchEmail,
      UsersMiddleware.userCantChangePermissionLevel,
      commonPermissionMiddleware.minimumPermissionLevelRequired(
        PermissionLevel.PAID_PERMISSION
      ),
      UsersController.patch,
    ]);

    this.app.put(`/users/:userId/permissionLevel/:permissionLevel`, [
      jwtMiddleware.validJWTNeeded,
      commonPermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
      commonPermissionMiddleware.minimumPermissionLevelRequired(
          PermissionLevel.FREE_PERMISSION
      ),
      UsersController.updatePermissionLevel,
  ]);

    return this.app;
  }
}
