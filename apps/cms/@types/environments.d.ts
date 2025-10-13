namespace NodeJS {
  interface ProcessEnv extends NodeJS.ProcessEnv {
    NEXT_PUBLIC_CMS_URL: string
    DATABASE_URI: string
    PAYLOAD_SECRET: string
  }
}
