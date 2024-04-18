/// <reference types="vite/client" />

declare module "*.xml" {
  const xml: Record<string, any>;
  export default xml;
}
