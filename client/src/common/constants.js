// The set of assignment types supported by the API is fixed, so it's possible to just write them down.
// This is not an ideal solution, as addition of new assignment types will require changes to this code.
// Nevertheless, it's a simple enough approach for now.
export const ASSIGNMENT_TYPES = [
  "Practice",
  "Homework",
  "Lab",
  "Report",
  "Project",
  "Test",
  "Presentation",
  "Other",
].map(it => ({
  label: it,
  value: it.toUpperCase(), // The API expects types in enum-constant notation.
}));
