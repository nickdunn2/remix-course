import {getStoredNotes} from "~/data/notes";

export interface Note {
  id: string
  title: string
  content: string
}

export type NotesResponse = {
  notes: Awaited<ReturnType<typeof getStoredNotes>>
}
