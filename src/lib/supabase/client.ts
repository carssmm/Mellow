import { createBrowserClient } from "@supabase/ssr";
import { config } from "@/lib/config";

export function createSupabaseClient() {
  return createBrowserClient(
    config.supabase.url,
    config.supabase.anonKey
  );
}
