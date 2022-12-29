import fs from 'fs/promises'
import { Note } from "~/types/notes.types"

export async function getStoredNotes(): Promise<ReadonlyArray<Note>> {
  const rawFileContent = await fs.readFile('notes.json', { encoding: 'utf-8' });
  const data = JSON.parse(rawFileContent);
  const storedNotes = data.notes ?? [];
  return storedNotes;
}

export function storeNotes(notes: ReadonlyArray<Note>) {
  return fs.writeFile('notes.json', JSON.stringify({ notes: notes || [] }));
}
