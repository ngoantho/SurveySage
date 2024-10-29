"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonModel = void 0;
class CommonModel {
    constructor(DB_CONNECTION_STRING) {
        this.dbConnectionString = DB_CONNECTION_STRING;
        this.schema = this.createSchema();
        this.model = this.createModel();
    }
}
exports.CommonModel = CommonModel;
//# sourceMappingURL=CommonModel.js.map