"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersRoutes = void 0;
const express_validator_1 = require("express-validator");
const common_routes_config_1 = require("../common/common.routes.config");
const users_controller_1 = __importDefault(require("./controllers/users.controller"));
const users_middleware_1 = __importDefault(require("./middleware/users.middleware"));
const body_validation_middleware_1 = __importDefault(require("../common/middleware/body.validation.middleware"));
const jwt_middleware_1 = __importDefault(require("../auth/middleware/jwt.middleware"));
const common_permission_middleware_1 = __importDefault(require("../common/middleware/common.permission.middleware"));
const common_permissionlevel_enum_1 = require("../common/middleware/common.permissionlevel.enum");
class UsersRoutes extends common_routes_config_1.CommonRoutesConfig {
    constructor(app) {
        super(app, "UsersRoutes");
    }
    configureRoutes() {
        this.app
            .route(`/users`)
            .get(jwt_middleware_1.default.validJWTNeeded, common_permission_middleware_1.default.minimumPermissionLevelRequired(common_permissionlevel_enum_1.PermissionLevel.ADMIN_PERMISSION), users_controller_1.default.listUsers)
            .post(express_validator_1.body("email").isEmail(), express_validator_1.body("password")
            .isLength({ min: 6 })
            .withMessage("Password should be at least 6 characters"), body_validation_middleware_1.default.verifyBodyFieldsErrors, users_middleware_1.default.validateSameEmailDoesntExist, users_controller_1.default.createUser);
        this.app.param(`userId`, users_middleware_1.default.extractUserId);
        this.app
            .route(`/users/:userId`)
            .all(users_middleware_1.default.validateUserExists, jwt_middleware_1.default.validJWTNeeded, common_permission_middleware_1.default.onlySameUserOrAdminCanDoThisAction)
            .get(users_controller_1.default.getUserById)
            .delete(users_controller_1.default.removeUser);
        this.app.put(`/users/:userId`, [
            express_validator_1.body("email").isEmail(),
            express_validator_1.body("password")
                .isLength({ min: 6 })
                .withMessage("Password should be at least 6 characters"),
            express_validator_1.body("firstName").isString(),
            express_validator_1.body("lastName").isString(),
            express_validator_1.body("permissionLevel").isInt(),
            body_validation_middleware_1.default.verifyBodyFieldsErrors,
            users_middleware_1.default.validateSameEmailBelongToSameUser,
            users_middleware_1.default.userCantChangePermissionLevel,
            common_permission_middleware_1.default.minimumPermissionLevelRequired(common_permissionlevel_enum_1.PermissionLevel.PAID_PERMISSION),
            users_controller_1.default.put,
        ]);
        this.app.patch(`/users/:userId`, [
            express_validator_1.body("email").isEmail().optional(),
            express_validator_1.body("password")
                .isLength({ min: 6 })
                .withMessage("Password should be at least 6 characters")
                .optional(),
            express_validator_1.body("firstName").isString().optional(),
            express_validator_1.body("lastName").isString().optional(),
            express_validator_1.body("permissionLevel").isInt().optional(),
            body_validation_middleware_1.default.verifyBodyFieldsErrors,
            users_middleware_1.default.validatePatchEmail,
            users_middleware_1.default.userCantChangePermissionLevel,
            common_permission_middleware_1.default.minimumPermissionLevelRequired(common_permissionlevel_enum_1.PermissionLevel.PAID_PERMISSION),
            users_controller_1.default.patch,
        ]);
        this.app.put(`/users/:userId/permissionLevel/:permissionLevel`, [
            jwt_middleware_1.default.validJWTNeeded,
            common_permission_middleware_1.default.onlySameUserOrAdminCanDoThisAction,
            common_permission_middleware_1.default.minimumPermissionLevelRequired(common_permissionlevel_enum_1.PermissionLevel.FREE_PERMISSION),
            users_controller_1.default.updatePermissionLevel,
        ]);
        return this.app;
    }
}
exports.UsersRoutes = UsersRoutes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlcnMucm91dGVzLmNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3VzZXJzL3VzZXJzLnJvdXRlcy5jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0EseURBQXlDO0FBRXpDLHlFQUFvRTtBQUNwRSxzRkFBNkQ7QUFDN0QscUZBQTREO0FBQzVELGlIQUF1RjtBQUN2Rix1RkFBOEQ7QUFDOUQscUhBQTJGO0FBQzNGLGtHQUFtRjtBQUVuRixNQUFhLFdBQVksU0FBUSx5Q0FBa0I7SUFDakQsWUFBWSxHQUF3QjtRQUNsQyxLQUFLLENBQUMsR0FBRyxFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFRCxlQUFlO1FBQ2IsSUFBSSxDQUFDLEdBQUc7YUFDTCxLQUFLLENBQUMsUUFBUSxDQUFDO2FBQ2YsR0FBRyxDQUNGLHdCQUFhLENBQUMsY0FBYyxFQUM1QixzQ0FBMEIsQ0FBQyw4QkFBOEIsQ0FDdkQsNkNBQWUsQ0FBQyxnQkFBZ0IsQ0FDakMsRUFDRCwwQkFBZSxDQUFDLFNBQVMsQ0FDMUI7YUFDQSxJQUFJLENBQ0gsd0JBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFDdkIsd0JBQUksQ0FBQyxVQUFVLENBQUM7YUFDYixRQUFRLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUM7YUFDcEIsV0FBVyxDQUFDLDBDQUEwQyxDQUFDLEVBQzFELG9DQUF3QixDQUFDLHNCQUFzQixFQUMvQywwQkFBZSxDQUFDLDRCQUE0QixFQUM1QywwQkFBZSxDQUFDLFVBQVUsQ0FDM0IsQ0FBQztRQUVKLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSwwQkFBZSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBRXhELElBQUksQ0FBQyxHQUFHO2FBQ0wsS0FBSyxDQUFDLGdCQUFnQixDQUFDO2FBQ3ZCLEdBQUcsQ0FDRiwwQkFBZSxDQUFDLGtCQUFrQixFQUNsQyx3QkFBYSxDQUFDLGNBQWMsRUFDNUIsc0NBQTBCLENBQUMsa0NBQWtDLENBQzlEO2FBQ0EsR0FBRyxDQUFDLDBCQUFlLENBQUMsV0FBVyxDQUFDO2FBQ2hDLE1BQU0sQ0FBQywwQkFBZSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRXRDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFO1lBQzdCLHdCQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFO1lBQ3ZCLHdCQUFJLENBQUMsVUFBVSxDQUFDO2lCQUNiLFFBQVEsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQztpQkFDcEIsV0FBVyxDQUFDLDBDQUEwQyxDQUFDO1lBQzFELHdCQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsUUFBUSxFQUFFO1lBQzVCLHdCQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsUUFBUSxFQUFFO1lBQzNCLHdCQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxLQUFLLEVBQUU7WUFDL0Isb0NBQXdCLENBQUMsc0JBQXNCO1lBQy9DLDBCQUFlLENBQUMsaUNBQWlDO1lBQ2pELDBCQUFlLENBQUMsNkJBQTZCO1lBQzdDLHNDQUEwQixDQUFDLDhCQUE4QixDQUN2RCw2Q0FBZSxDQUFDLGVBQWUsQ0FDaEM7WUFDRCwwQkFBZSxDQUFDLEdBQUc7U0FDcEIsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLEVBQUU7WUFDL0Isd0JBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLEVBQUU7WUFDbEMsd0JBQUksQ0FBQyxVQUFVLENBQUM7aUJBQ2IsUUFBUSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDO2lCQUNwQixXQUFXLENBQUMsMENBQTBDLENBQUM7aUJBQ3ZELFFBQVEsRUFBRTtZQUNiLHdCQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxFQUFFO1lBQ3ZDLHdCQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxFQUFFO1lBQ3RDLHdCQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxRQUFRLEVBQUU7WUFDMUMsb0NBQXdCLENBQUMsc0JBQXNCO1lBQy9DLDBCQUFlLENBQUMsa0JBQWtCO1lBQ2xDLDBCQUFlLENBQUMsNkJBQTZCO1lBQzdDLHNDQUEwQixDQUFDLDhCQUE4QixDQUN2RCw2Q0FBZSxDQUFDLGVBQWUsQ0FDaEM7WUFDRCwwQkFBZSxDQUFDLEtBQUs7U0FDdEIsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsaURBQWlELEVBQUU7WUFDOUQsd0JBQWEsQ0FBQyxjQUFjO1lBQzVCLHNDQUEwQixDQUFDLGtDQUFrQztZQUM3RCxzQ0FBMEIsQ0FBQyw4QkFBOEIsQ0FDckQsNkNBQWUsQ0FBQyxlQUFlLENBQ2xDO1lBQ0QsMEJBQWUsQ0FBQyxxQkFBcUI7U0FDeEMsQ0FBQyxDQUFDO1FBRUQsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDO0lBQ2xCLENBQUM7Q0FDRjtBQW5GRCxrQ0FtRkMifQ==