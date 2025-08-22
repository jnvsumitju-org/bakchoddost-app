export function renderTemplate(rawText: string, userName: string, friendNames: string[]): string {
  let output = (rawText || "").replaceAll("{{userName}}", userName || "आप");
  for (let i = 0; i < 10; i += 1) {
    const token = `{{friendName${i + 1}}}`;
    output = output.replaceAll(token, friendNames?.[i] || `दोस्त${i + 1}`);
  }
  return output;
}


