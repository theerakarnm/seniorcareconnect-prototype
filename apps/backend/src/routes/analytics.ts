import { Hono } from "hono";
import { getAuth } from "@hono/clerk-auth";
import { HTTPException } from 'hono/http-exception'
import AnalyticDomain from "../resources/analytics/analytics.domain";

const analyticsRoute = new Hono();

analyticsRoute.get("/clients/storage-usage", async (c) => {
  try {
    const authData = getAuth(c)

    if (!authData?.userId) {
      throw new HTTPException(401, { message: "Unauthenticated" });
    }

    const analyticDomain = new AnalyticDomain(authData.userId);

    const examples = await analyticDomain.getUserStorageAnalytics();
    return c.json(examples);
  } catch (error) {
    throw new HTTPException(500, { message: "Internal Server Error" });
  }
});

analyticsRoute.get("/", async (c) => {
  try {
    const authData = getAuth(c)

    if (!authData?.userId) {
      throw new HTTPException(401, { message: "Unauthenticated" });
    }

    const analyticDomain = new AnalyticDomain(authData.userId);

    const examples = await analyticDomain.getUserStorageAnalytics();
    return c.json(examples);
  } catch (error) {
    throw new HTTPException(500, { message: "Internal Server Error" });
  }
});

export default analyticsRoute;
