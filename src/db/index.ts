import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

const client = postgres(process.env.SUPABASE_DATABASE_URL!);
export const db = drizzle({ client });
