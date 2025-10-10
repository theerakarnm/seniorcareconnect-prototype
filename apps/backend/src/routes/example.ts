import { Hono } from "hono";
import { exampleDomain } from "../resources/example/example.domain";

const exampleRoute = new Hono();

exampleRoute.get("/examples", async (c) => {
  const examples = await exampleDomain.generateExampleNumber()
  return c.json(examples);
});

export default exampleRoute;
