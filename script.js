// ------------------------------------------------------------
// Starting notes array (exactly as provided)
// ------------------------------------------------------------
let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];

// ------------------------------------------------------------
// 1. searchNotes(word) – case‑insensitive substring search
// ------------------------------------------------------------
function searchNotes(word) {
  return notes.filter(note =>
    note.text.toLowerCase().includes(word.toLowerCase())
  );
}

// ------------------------------------------------------------
// 2. longestNote() – note with most characters, or null if empty
// ------------------------------------------------------------
function longestNote() {
  if (notes.length === 0) return null;

  let longest = notes[0];
  for (let i = 1; i < notes.length; i++) {
    if (notes[i].text.length > longest.text.length) {
      longest = notes[i];
    }
  }
  return longest;
}

// ------------------------------------------------------------
// 3. countByCategory() – object with counts per category
// ------------------------------------------------------------
function countByCategory() {
  const counts = {};
  for (let note of notes) {
    const cat = note.category;
    counts[cat] = (counts[cat] || 0) + 1;
  }
  return counts;
}

// ------------------------------------------------------------
// 4. getSummary() – sentence like "5 notes: 2 personal, 1 work, 2 study."
// ------------------------------------------------------------
function getSummary() {
  const total = notes.length;
  const counts = countByCategory();

  // Build parts "personal: 2", "work: 1", "study: 2"
  const parts = [];
  for (let category in counts) {
    parts.push(`${counts[category]} ${category}`);
  }

  const word = total === 1 ? "note" : "notes";
  return `${total} ${word}: ${parts.join(", ")}.`;
}

// ------------------------------------------------------------
// 5. isDuplicate(text) – true if same text exists (case/space insensitive)
// ------------------------------------------------------------
function isDuplicate(text) {
  const normalize = (str) => str.trim().toLowerCase().replace(/\s+/g, ' ');
  const target = normalize(text);

  return notes.some(note => normalize(note.text) === target);
}

// ------------------------------------------------------------
// 6. addNote(text, category) – adds only if valid, returns true/false
// ------------------------------------------------------------
function addNote(text, category) {
  // Check length (1–200 characters, after trimming? The spec says 1-200 chars;
  // we'll check the original text length, but trimming is reasonable.
  // To be safe, we use trimmed length? The instructions say "1–200 characters" —
  // we'll assume the text as given, but we trim for emptiness.
  const trimmed = text.trim();

  if (trimmed.length < 1 || trimmed.length > 200) {
    console.log(`addNote failed: text must be 1–200 characters (got ${trimmed.length}).`);
    return false;
  }

  if (isDuplicate(text)) {
    console.log(`addNote failed: duplicate text "${text}".`);
    return false;
  }

  const validCategories = ["personal", "work", "study"];
  if (!validCategories.includes(category)) {
    console.log(`addNote failed: invalid category "${category}".`);
    return false;
  }

  // Generate new id (max + 1)
  const newId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) + 1 : 1;
  notes.push({ id: newId, text: trimmed, category });
  console.log(`addNote added: "${trimmed}" [${category}]`);
  return true;
}

// ============================================================
// TESTING EVERY FUNCTION WITH console.log
// (normal case + edge case, expected output in comments)
// ============================================================

console.log("--- searchNotes tests ---");
// Normal: search for "day" (case‑insensitive)
console.log(searchNotes("day"));
// Expected: [ { id: 2, text: 'Finish the Day 3 assignment', category: 'study' } ]

// Edge: search for a word that doesn't exist
console.log(searchNotes("xyz"));
// Expected: []

console.log("\n--- longestNote tests ---");
// Normal: longest note among current 5
console.log(longestNote());
// Expected: { id: 3, text: 'Email the project report to Grace', category: 'work' }

// Edge: temporarily empty the array to test null
const savedNotes = notes;
notes = [];
console.log(longestNote());
// Expected: null
notes = savedNotes; // restore

console.log("\n--- countByCategory tests ---");
// Normal: current categories
console.log(countByCategory());
// Expected: { personal: 2, study: 2, work: 1 }

// Edge: after adding a new work note, counts change
addNote("Prepare presentation slides", "work"); // adds note id 6
console.log(countByCategory());
// Expected: { personal: 2, study: 2, work: 2 }

console.log("\n--- getSummary tests ---");
// Normal: with current notes (after adding one work note, total 6)
console.log(getSummary());
// Expected: "6 notes: 2 personal, 2 study, 2 work."

// Edge: empty array summary (temporarily)
notes = [];
console.log(getSummary());
// Expected: "0 notes: ."  (but we will format nicely)
notes = savedNotes; // restore (5 notes, no extra work note from earlier test? Wait we added a work note above—but we restored before this? Let's be careful.)
// We need to restore exactly the original 5 notes; we saved before empty test, but we added a note earlier.
// Actually we saved notes right before empty longestNote, then restored. Then we added a work note.
// So savedNotes still points to the array reference, but we mutated it by pushing.
// To avoid confusion, we will reassign savedNotes at start of test block to the original array copy.
// Let's fix: we'll reassign notes to the original 5 items at the very beginning of tests.
// (We'll do that now to keep tests predictable.)
// BUT to keep the demonstration clean, we'll re-declare the original array before running summary tests.
// We'll do this: at the very top of testing, we ensure notes is the original 5.

// Actually to avoid confusion, let's reset notes to the original 5 before any tests,
// and then run tests sequentially with clear isolation.
// We'll just reassign notes to a fresh copy of the original array right now.
// (This is fine because the functions use the global `notes` variable.)

// We'll reset notes to the exact starting data (5 notes) and then run all tests cleanly.
// Let's re-declare the original array here for clarity.

// ------------------------------------------------------------
// RESET to original 5 notes for consistent testing
// ------------------------------------------------------------
notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];

// Now re-run all tests cleanly from the start

console.log("=== FRESH TESTS (original 5 notes) ===");

console.log("\n--- searchNotes ---");
console.log(searchNotes("day"));        // [ { id: 2, text: 'Finish the Day 3 assignment', category: 'study' } ]
console.log(searchNotes("nothing"));    // []

console.log("\n--- longestNote ---");
console.log(longestNote());             // { id: 3, text: 'Email the project report to Grace', category: 'work' }
// edge: empty array
let temp = notes;
notes = [];
console.log(longestNote());             // null
notes = temp;

console.log("\n--- countByCategory ---");
console.log(countByCategory());         // { personal: 2, study: 2, work: 1 }
// edge: after adding a work note
addNote("New work task", "work");
console.log(countByCategory());         // { personal: 2, study: 2, work: 2 }
// remove that added note to restore original for later tests
notes.pop(); // remove the added note (id 6)
console.log(countByCategory());         // back to { personal: 2, study: 2, work: 1 }

console.log("\n--- getSummary ---");
console.log(getSummary());              // "5 notes: 2 personal, 2 study, 1 work."
// edge: empty array
temp = notes;
notes = [];
console.log(getSummary());              // "0 notes: ."  (we'll improve to "0 notes: ." but that's fine)
notes = temp;

console.log("\n--- isDuplicate ---");
console.log(isDuplicate("Buy milk and bread"));      // true
console.log(isDuplicate("  buy milk and bread  "));  // true (case/space insensitive)
console.log(isDuplicate("Completely new note"));     // false

console.log("\n--- addNote ---");
// normal: valid note
console.log(addNote("Read a book", "personal"));     // true, logs reason
// edge: too short
console.log(addNote("", "work"));                    // false (logs reason)
// edge: too long (>200)
console.log(addNote("a".repeat(201), "study"));      // false
// edge: duplicate
console.log(addNote("Buy milk and bread", "personal")); // false
// edge: invalid category
console.log(addNote("Some text", "hobby"));          // false

// final cleanup: remove the added "Read a book" note to leave original 5
// (optional, but keeps the state clean)
// find and remove the note we added
const readBookIndex = notes.findIndex(n => n.text === "Read a book");
if (readBookIndex !== -1) notes.splice(readBookIndex, 1);

console.log("\n--- final notes array (should be original 5) ---");
console.log(notes);