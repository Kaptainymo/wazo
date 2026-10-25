// POST /api/enrich  { idea, lang, token }
// Free helper: rewrites a short or vague idea as a clearer description the person can edit and approve.
import { lightHandler } from "./_lib.js";
import { buildEnrichPrompt, shapeEnrich } from "./_prompt.js";

export const config = { maxDuration: 60 };
const MOCK = JSON.stringify({ idea: "An app that photographs receipts for freelancers and prepares the yearly tax report. It is for self-employed people who lose receipts and dread tax season. It could earn through a small monthly subscription.", added: ["Who it is for", "The problem", "How it earns"] });

export default (req, res) => lightHandler(req, res, { text: "idea", build: buildEnrichPrompt, shape: shapeEnrich, mock: MOCK, key: "enrich" });
