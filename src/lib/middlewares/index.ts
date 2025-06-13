import { MiddlewareHandler } from "@/types/type";

export * from "./api-auth";

export function compose(...middlewares: Array<(req: any, handler: any) => Promise<Response>>) {
  return function (request: Request, handler: MiddlewareHandler) {
    return middlewares.reduceRight(
      (next, middleware) => (req: any) => middleware(req, next),
      handler
    )(request);
  };
}
