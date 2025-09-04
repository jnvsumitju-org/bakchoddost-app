import { z } from "zod";

const Schema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
});

Schema.parse(process.env as unknown);

export const FE_ENV = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
};

export default FE_ENV;


