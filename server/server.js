import { assertConfig } from "./lib/env.js";
import { connectWithRetry } from "./lib/db.js";
import app from "./app.js";
import { seedMissing } from "./scripts/seedLib.js";

const problems = assertConfig();
if (problems.length) {
  console.error("Configuration problems:\n - " + problems.join("\n - "));
  process.exit(1);
}

app.listen(port, () => {
  console.log(`Ivy Interio API listening on port ${port}`);
});
// Fills EMPTY content types with starter content once connected (additive only). Disable with AUTO_SEED=false.
connectWithRetry(
  console,
  process.env.AUTO_SEED === "false"
    ? undefined
    : async () => {
        const n = await seedMissing();
        if (n) console.log(`Auto-seed added ${n} record(s).`);
      },
);
