import { runValidateAppStoreUrls } from "./validate-app-store-urls";

runValidateAppStoreUrls()
  .then(() => process.exit(0))
  .catch((e) => { console.error(e); process.exit(1); });
