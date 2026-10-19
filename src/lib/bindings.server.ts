// Netlify build: there are no Cloudflare bindings (D1/R2/KV). The accessor is
// kept so existing server code compiles; every binding is simply undefined.
type D1Like = { prepare(sql: string): { bind(...a: unknown[]): { run(): Promise<{ meta: { last_row_id?: number } }> } } };
type AppEnv = { DB?: D1Like; STORAGE?: undefined; KV?: undefined };

export function bindings(): AppEnv {
  return {};
}
