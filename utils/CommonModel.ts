import { Schema, Model, connect } from "mongoose";

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
  abstract createModel(): Promise<Model<T>> | null;

  async connect() {
    await connect(this.dbConnectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
}

export { CommonModel };
