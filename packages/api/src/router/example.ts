import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { publicProcedure } from "../trpc";
import { ExampleDomain } from "../features/example/example.domain";

export const postRouter = {
  all: publicProcedure.query(() => {
    const exampleDomain = new ExampleDomain();
    return exampleDomain.getExample();
  }),
  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      const exampleDomain = new ExampleDomain();
      return exampleDomain.getExampleById(Number(input.id));
    })
} satisfies TRPCRouterRecord;
