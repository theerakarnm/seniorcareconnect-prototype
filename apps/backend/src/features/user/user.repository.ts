import { user as userTable } from "~/core/database/schema";
import { eq, ilike, or, count, like, desc, asc, sql, and } from "drizzle-orm";
import db from "~/core/database";
import { UserListQuery } from "./user.interface";

class UserRepository {
  private db;

  constructor() {
    this.db = db;
  }

  public async getUserById(id: string) {
    const user = await this.db.query.user.findFirst({
      where: and(
        eq(userTable.id, id)
      ),
    });

    return user ?? null;
  }

  public async getExample(query: UserListQuery) {
    const users = await this.db
      .select()
      .from(userTable)
      .where(and(
        query.search
          ? or(
            ilike(userTable.name, `%${query.search}%`),
            ilike(userTable.email, `%${query.search}%`)
          )
          : undefined
      ))
      .orderBy(desc(userTable.createdAt))
      .limit(query.limit ?? 10)
      .offset(query.page ? (query.page - 1) * (query.limit ?? 10) : 0);

    const total = await this.db
      .select({
        count: sql<number>`count(${userTable.id})`,
      })
      .from(userTable)
      .where(and(
        query.search
          ? or(
            ilike(userTable.name, `%${query.search}%`),
            ilike(userTable.email, `%${query.search}%`)
          )
          : undefined
      ))
      .then((res) => res[0]?.count ?? 0);

    return {
      data: users,
      total,
      page: query.page ?? 1,
      limit: query.limit ?? 10,
      totalPages: Math.ceil(total / (query.limit ?? 10)),
    };
  }
}

export const userRepository = new UserRepository();
