import db, { type PgTx } from "../../core/database";
import { eq, ilike, or, count, like, desc, asc, sql, and } from "drizzle-orm";
import { ExampleItem } from "./example.interface";

class ExampleRepository {
  private db;

  example: ExampleItem[] = [{
    id: 1,
    name: `Example 1`,
    description: "This is an example item.",
    price: 9.99
  }, {
    id: 2,
    name: `Example 2`,
    description: "This is another example item.",
    price: 19.99
  }]

  constructor() {
    this.db = db;
  }

  public async getExampleById(id: number): Promise<ExampleItem> {
    return new Promise((res, rej) => {
      const exItem = this.example.find(item => item.id === id);
      return exItem ? res(exItem) : rej(new Error("Item not found"));
    })
  }

  public async getExample(): Promise<ExampleItem[]> {
    return new Promise((res) => {
      // Dummy implementation, replace with actual DB query
      return res(this.example);
    })
  }
}

export const exampleRepository = new ExampleRepository();
