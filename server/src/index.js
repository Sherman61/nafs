import { buildApp } from './app.js';

const PORT = process.env.PORT || 5000;
const app = buildApp();

app.listen(PORT, () => {
  console.log(`Lefanek Ahava commerce API running on port ${PORT}`);
});
