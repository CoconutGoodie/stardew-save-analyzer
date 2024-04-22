/// <reference types="vite/client" />

declare module "*.xml" {
  const xml: Record<string, unknown>;
  export default xml;
}

declare type ValueOf<T extends object> = T[keyof T];
