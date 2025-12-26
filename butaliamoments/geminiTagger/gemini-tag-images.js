import { readFile, writeFile, access } from 'fs/promises';
import { constants as fsConstants } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dotenvLoads = [];
{
  const pathsToTry = [resolve(__dirname, '.env'), resolve(process.cwd(), '.env')];
  for (const p of pathsToTry) {
    const res = dotenv.config({ path: p });
    dotenvLoads.push({ path: p, ok: !res.error, error: res.error ? String(res.error) : null });
  }
}

function parseEnvFileContents(contents) {
  const out = {};
  const normalized = contents.replace(/^\uFEFF/, '');
  for (const line of normalized.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const cleaned = trimmed.startsWith('export ') ? trimmed.slice('export '.length).trim() : trimmed;
    const eqIdx = cleaned.indexOf('=');
    if (eqIdx === -1) continue;
    const key = cleaned.slice(0, eqIdx).trim();
    let val = cleaned.slice(eqIdx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (key) out[key] = val;
  }
  return out;
}

async function ensureApiKeyLoaded() {
  if (process.env.GEMINI_API_KEY) return { fixed: false, parsedKeys: [] };

  const envPaths = [resolve(__dirname, '.env'), resolve(process.cwd(), '.env')];
  for (const p of envPaths) {
    try {
      const raw = await readFile(p, 'utf-8');
      const parsed = parseEnvFileContents(raw);
      const keys = Object.keys(parsed);
      if (!process.env.GEMINI_API_KEY && parsed.GEMINI_API_KEY) process.env.GEMINI_API_KEY = parsed.GEMINI_API_KEY;
      if (!process.env.GEMINI_API_KEY && parsed.GOOGLE_GEMINI_API_KEY) {
        process.env.GEMINI_API_KEY = parsed.GOOGLE_GEMINI_API_KEY;
      }
      if (!process.env.GEMINI_MODEL && parsed.GEMINI_MODEL) process.env.GEMINI_MODEL = parsed.GEMINI_MODEL;
      if (process.env.GEMINI_API_KEY) return { fixed: true, parsedKeys: keys };
      // Continue trying other paths; keep last parsed keys for diagnostics.
      if (keys.length) return { fixed: false, parsedKeys: keys };
    } catch {
      // ignore
    }
  }

  // One more fallback: find env keys that look like GEMINI_API_KEY but with accidental whitespace.
  const maybeKey = Object.keys(process.env).find((k) => k.replace(/\s+/g, '') === 'GEMINI_API_KEY');
  if (maybeKey && process.env[maybeKey]) {
    process.env.GEMINI_API_KEY = process.env[maybeKey];
    return { fixed: true, parsedKeys: [maybeKey] };
  }

  return { fixed: false, parsedKeys: [] };
}

function parseArgs(argv) {
  let planWasProvided = false;
  const args = {
    year: 2025,
    limit: Infinity,
    offset: 0,
    dryRun: false,
    sleepMs: 0,
    onlyMissing: true,
    planPath: null
  };

  for (let i = 2; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--year') args.year = Number(argv[++i]);
    else if (a === '--limit') args.limit = Number(argv[++i]);
    else if (a === '--offset') args.offset = Number(argv[++i]);
    else if (a === '--sleep-ms') args.sleepMs = Number(argv[++i]);
    else if (a === '--plan') {
      planWasProvided = true;
      args.planPath = resolve(process.cwd(), argv[++i]);
    }
    else if (a === '--dry-run') args.dryRun = true;
    else if (a === '--include-reviewed') args.onlyMissing = false;
    else throw new Error(`Unknown arg: ${a}`);
  }

  if (!planWasProvided) {
    args.planPath = resolve(
      __dirname,
      `${args.year}/moments-${args.year}-plan.json`
    );
  }

  return args;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function toTitle(month) {
  const map = {
    '01': 'January',
    '02': 'February',
    '03': 'March',
    '04': 'April',
    '05': 'May',
    '06': 'June',
    '07': 'July',
    '08': 'August',
    '09': 'September',
    '10': 'October',
    '11': 'November',
    '12': 'December'
  };
  return map[month] ?? month;
}

function normalizeResult(raw) {
  const out = {
    type: null,
    description: null,
    tags: []
  };

  if (!raw || typeof raw !== 'object') return out;

  if (typeof raw.type === 'string' && raw.type.trim()) out.type = raw.type.trim();
  if (typeof raw.description === 'string' && raw.description.trim()) out.description = raw.description.trim();

  if (Array.isArray(raw.tags)) {
    out.tags = raw.tags
      .filter((t) => typeof t === 'string')
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 12);
  }

  return out;
}

async function callGemini({ apiKey, modelName, imageAbsPath, month }) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: modelName });

  const imageBytes = await readFile(imageAbsPath);
  const imageB64 = imageBytes.toString('base64');

  const prompt = [
    'You are tagging a personal family photo library for a year-in-review webpage.',
    'Return ONLY valid JSON with fields: {"type": string, "description": string, "tags": string[]}.',
    'Rules:',
    '- type: short category like family, kids, friends, sports, music, recital, trip, holiday, school, date-night, food, halloween, disneyland, beach, other',
    '- description: one short sentence, no names, no sensitive details',
    '- tags: 3-10 short lowercase tags, no names',
    `- month context: ${toTitle(month)}`
  ].join('\n');

  const result = await model.generateContent({
    contents: [
      {
        role: 'user',
        parts: [
          { text: prompt },
          {
            inlineData: {
              data: imageB64,
              mimeType: 'image/jpeg'
            }
          }
        ]
      }
    ],
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.3
    }
  });

  const text = result?.response?.text?.();
  if (!text) throw new Error('No response text from Gemini');

  try {
    return JSON.parse(text);
  } catch (e) {
    // Sometimes models wrap JSON in markdown; attempt to recover.
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error(`Failed to parse JSON from Gemini: ${text.slice(0, 200)}`);
  }
}

async function main() {
  const args = parseArgs(process.argv);

  const { fixed: envFixed, parsedKeys } = await ensureApiKeyLoaded();
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const diag = dotenvLoads
      .map((d) => `- ${d.path}: ${d.ok ? 'loaded' : `error (${d.error})`}`)
      .join('\n');
    const keyList = parsedKeys.length ? parsedKeys.join(', ') : '(none detected)';
    throw new Error(
      'Missing GEMINI_API_KEY.\n' +
        'Expected GEMINI_API_KEY=... in a .env file.\n' +
        'dotenv load attempts:\n' +
        diag +
        `\nparsed keys from .env (best-effort): ${keyList}`
    );
  }

  const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

  try {
    await access(args.planPath, fsConstants.F_OK);
  } catch {
    throw new Error(
      `Plan JSON not found at: ${args.planPath}\n` +
        'Either restore/create the plan file, or pass --plan <path-to-json>.'
    );
  }

  const planRaw = await readFile(args.planPath, 'utf-8');
  const plan = JSON.parse(planRaw);
  if (!plan?.items || !Array.isArray(plan.items)) throw new Error('Invalid plan JSON: missing items[]');

  const repoRoot = resolve(__dirname, '..');

  const candidates = plan.items
    .map((it, idx) => ({ it, idx }))
    .filter(({ it }) => {
      if (args.onlyMissing) return !it.type || !it.description || !Array.isArray(it.tags) || it.tags.length === 0;
      return true;
    });

  const slice = candidates.slice(args.offset, args.offset + args.limit);

  let processed = 0;
  for (const { it, idx } of slice) {
    const srcRel = it.src;
    const month = it.month;

    if (!srcRel || !month) continue;

    const imageAbsPath = resolve(repoRoot, srcRel);

    process.stdout.write(`Tagging [${idx + 1}/${plan.items.length}] ${srcRel}... `);

    try {
      const raw = await callGemini({ apiKey, modelName, imageAbsPath, month });
      const normalized = normalizeResult(raw);

      if (!normalized.type || !normalized.description) {
        throw new Error('Gemini returned missing type/description');
      }

      const updated = {
        ...it,
        type: normalized.type,
        description: normalized.description,
        tags: normalized.tags,
        needsReview: true
      };

      plan.items[idx] = updated;

      if (!args.dryRun) {
        await writeFile(args.planPath, JSON.stringify(plan, null, 2) + '\n', 'utf-8');
      }

      processed += 1;
      process.stdout.write('OK\n');
    } catch (err) {
      const msg = String(err?.message || err);
      if (msg.includes('404') && msg.includes('models/') && msg.includes('not found')) {
        process.stdout.write(
          `ERROR (${msg})\n` +
            'Hint: set GEMINI_MODEL to a supported model, e.g. gemini-1.5-flash or gemini-1.5-pro.\n'
        );
      } else {
        process.stdout.write(`ERROR (${msg})\n`);
      }
      // Keep going; you can re-run later to retry failures.
    }

    if (args.sleepMs > 0) {
      await sleep(args.sleepMs);
    }
  }

  console.log(`Done. Processed ${processed} items. Plan: ${args.planPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
