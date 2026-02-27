const fs = require('fs');
const path = require('path');

const runtimeDir = path.join(__dirname, '..', 'node_modules', '@prisma', 'client', 'runtime');
const providers = ['postgresql', 'mysql', 'sqlite', 'sqlserver', 'cockroachdb'];

if (!fs.existsSync(runtimeDir)) {
  console.log('[fix-prisma-runtime] Prisma runtime directory not found, skipping.');
  process.exit(0);
}

let created = 0;

for (const provider of providers) {
  const baseFiles = [
    {
      from: `query_compiler_bg.${provider}.js`,
      to: `query_compiler_fast_bg.${provider}.js`,
    },
    {
      from: `query_compiler_bg.${provider}.mjs`,
      to: `query_compiler_fast_bg.${provider}.mjs`,
    },
    {
      from: `query_compiler_bg.${provider}.wasm-base64.js`,
      to: `query_compiler_fast_bg.${provider}.wasm-base64.js`,
    },
    {
      from: `query_compiler_bg.${provider}.wasm-base64.mjs`,
      to: `query_compiler_fast_bg.${provider}.wasm-base64.mjs`,
    },
  ];

  for (const file of baseFiles) {
    const fromPath = path.join(runtimeDir, file.from);
    const toPath = path.join(runtimeDir, file.to);

    if (!fs.existsSync(fromPath) || fs.existsSync(toPath)) {
      continue;
    }

    fs.copyFileSync(fromPath, toPath);
    created += 1;
  }
}

console.log(`[fix-prisma-runtime] Added ${created} compatibility runtime file(s).`);
