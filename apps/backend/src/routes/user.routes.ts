import { Hono } from "hono";
import { userDomain } from "~/features/user/user.domain";
import { zValidator } from '@hono/zod-validator'
import z from "zod";
import { calculatePagination, sendPaginatedSuccess, sendSuccess } from "~/core/tools/common-response";

const userRoute = new Hono();

userRoute.get("/", zValidator('query', z.object({
  search: z.string().optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
})), async (c) => {
  const query = c.req.valid('query')
  const users = await userDomain.getUsers(query);

  return sendPaginatedSuccess(
    c,
    users.data,
    calculatePagination(
      users.page,
      users.limit,
      users.total
    ))
});

userRoute.get('/:id', async (c) => {
  const { id } = c.req.param();
  const user = await userDomain.getUserById(id);

  return sendSuccess(c, user)
})

export default userRoute;
