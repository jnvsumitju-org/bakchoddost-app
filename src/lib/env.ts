import { z } from "zod";

const Schema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
});

Schema.parse(process.env as unknown);

export const FE_ENV = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
};

export default FE_ENV;


