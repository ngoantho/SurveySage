import { Schema, Model, connect, model } from "mongoose";

abstract class CommonModel<T> {
  schema: Schema;
  model: Model<T>;
  dbConnectionString: string;

  constructor(DB_CONNECTION_STRING: string) {
    this.dbConnectionString = DB_CONNECTION_STRING;
    this.schema = this.createSchema();
    this.createModel().then((model: Model<T>) => {
      this.model = model;
    });
  }

  abstract createSchema(): Schema;
  abstract get modelName(): string;
  abstract get collectionName(): string;

  async createModel(): Promise<Model<T>> {
    try {
      await connect(this.dbConnectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      return model<T>(this.modelName, this.schema, this.collectionName);
    } catch (e) {
      throw new Error(e);
    }
  }
}

export { CommonModel };
