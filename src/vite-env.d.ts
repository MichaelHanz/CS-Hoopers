/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ADMIN_PIN: string;
  // add more env variables here later if you need them
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}