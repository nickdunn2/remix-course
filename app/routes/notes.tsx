import NewNote, { links as newNoteLinks } from "~/components/new-note";
import {ActionFunction, redirect} from "@remix-run/node";
import {getStoredNotes, storeNotes} from "~/data/notes";
import {Note} from "~/interfaces/note.interface";

export default function NotesPage() {
  return (
    <main>
      <NewNote />
    </main>
  )
}

export const action: ActionFunction = async ({ request}) => {
  const formData = await request.formData()
  const noteData = {
    ...Object.fromEntries(formData),
    id: new Date().toISOString()
  } as Note // TODO: how can we enforce type here?

  // TODO: Add some validation here...

  const existingNotes = await getStoredNotes()
  const updatedNotes = existingNotes.concat(noteData)

  await storeNotes(updatedNotes)

  return redirect('/notes')
}

export function links() {
  return [...newNoteLinks()]
}
