import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Usage:
 *   node scripts/diffTest.js old.json new.json
 * Exits 0 if "equal" under these rules, 1 otherwise.
 */

const [, , aPath, bPath] = process.argv;
if (!aPath || !bPath) {
  console.error('Usage: node scripts/diffTest.js <old.json> <new.json>');
  process.exit(2);
}

const load = async (p) => JSON.parse(await fs.readFile(path.resolve(p), 'utf8'));

const isEmptyish = (v) => {
  if (v === undefined || v === null) return true;
  if (typeof v === 'string') return v.trim() === '';
  if (Array.isArray(v)) return v.length === 0 || v.every(isEmptyish);
  if (typeof v === 'object') {
    const ks = Object.keys(v);
    return ks.length === 0 || ks.every((k) => isEmptyish(v[k]));
  }
  return false;
};

// Produce a canonical form where:
// - emptyish values are removed (so "missing" == "empty"),
// - object keys are sorted,
// - arrays are sorted by a stable “key” derived from their canonical content.
const canonicalize = (node) => {
  if (node === undefined || node === null) return undefined;

  if (Array.isArray(node)) {
    const items = node.map(canonicalize).filter((v) => !isEmptyish(v));

    items.sort((x, y) => {
      const kx = stableKey(x);
      const ky = stableKey(y);
      return kx < ky ? -1 : kx > ky ? 1 : 0;
    });

    return items.length ? items : undefined;
  }

  if (typeof node === 'object') {
    const out = {};
    for (const k of Object.keys(node).sort()) {
      const v = canonicalize(node[k]);
      if (!isEmptyish(v)) out[k] = v;
    }
    return Object.keys(out).length ? out : undefined;
  }

  // primitive
  if (typeof node === 'string') return node; // keep as-is (no trim here)
  if (typeof node === 'number' || typeof node === 'boolean') return node;
  return node;
};

// Create a deterministic sort key for any canonical value.
const stableKey = (v) => {
  if (v === undefined) return 'u';
  if (v === null) return 'n';
  if (typeof v === 'string') return 's:' + v;
  if (typeof v === 'number') return 'd:' + v;
  if (typeof v === 'boolean') return 'b:' + (v ? '1' : '0');
  // objects/arrays: stringify the already-canonicalized form (keys sorted)
  return 'j:' + JSON.stringify(v);
};

try {
  const aRaw = await load(aPath);
  const bRaw = await load(bPath);

  const aCanon = canonicalize(aRaw);
  const bCanon = canonicalize(bRaw);

  const aStr = JSON.stringify(aCanon);
  const bStr = JSON.stringify(bCanon);

  if (aStr === bStr) {
    console.log('✅ Equivalent (order-insensitive; missing == empty).');
    process.exit(0);
  } else {
    console.error('❌ Differ.');
    // Optional hints:
    console.error('— Canonical lengths:', 'A=', aStr.length, 'B=', bStr.length);
    // If you want, write canonicalized versions to inspect:
    await fs.writeFile('tmp/old.canon.json', JSON.stringify(aCanon, null, 2));
    await fs.writeFile('tmp/new.canon.json', JSON.stringify(bCanon, null, 2));
    process.exit(1);
  }
} catch (err) {
  console.error(err.stack || String(err));
  process.exit(2);
}
