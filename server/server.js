import { assertConfig } from './lib/env.js';
import { connectWithRetry } from './lib/db.js';
import { createApp } from './app.js';

const problems = assertConfig();
if (problems.length) {
  console.error('Configuration problems:\n - ' + problems.join('\n - '));
  process.exit(1);
}

const port = Number(process.env.PORT) || 5000;
createApp().listen(port, () => console.log(`Ivy Interio API listening on port ${port}`));
connectWithRetry();
