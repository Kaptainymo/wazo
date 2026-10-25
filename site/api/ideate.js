// POST /api/ideate  { topic, lang, token }
// Free helper for people with no idea yet: four original ideas around a topic or a feeling.
import { lightHandler } from "./_lib.js";
import { buildIdeatePrompt, shapeIdeas } from "./_prompt.js";

export const config = { maxDuration: 60 };
const MOCK = JSON.stringify({ ideas: [
  { title: "Weekend art workshops for kids", why: "Parents look for fun things to do with children that are not screens." },
  { title: "Homework help by video call", why: "Many families want a patient tutor at a fair price." },
  { title: "A neighbourhood toy swap", why: "Children outgrow toys fast and parents like saving money." },
  { title: "Bedtime stories recorded in your voice", why: "Grandparents far away can still read to their grandchildren." },
] });

export default (req, res) => lightHandler(req, res, { text: "topic", build: buildIdeatePrompt, shape: shapeIdeas, mock: MOCK, key: "ideate" });
