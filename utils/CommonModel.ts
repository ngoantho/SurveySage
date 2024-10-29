import { Schema, Model } from "mongoose";

abstract class CommonModel<T> {
  schema: Schema
  model: Model<T>
  dbConnectionString: string

  constructor(DB_CONNECTION_STRING: string) {
    this.dbConnectionString = DB_CONNECTION_STRING
    this.schema = this.createSchema()
    this.model = this.createModel()
  }

  abstract createSchema(): Schema
  abstract createModel(): Model<T> | null
}

export {CommonModel}