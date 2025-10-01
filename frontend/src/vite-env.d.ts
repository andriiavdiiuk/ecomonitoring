/// <reference types="vite/client" />

interface ViteTypeOptions {
    strictImportMetaEnv: unknown
}

interface ImportMetaEnv {
    readonly REACT_APP_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}