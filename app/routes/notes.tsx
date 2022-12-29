import NewNote, { links as newNoteLinks } from "~/components/new-note"
import NoteList , { links as noteListLinks } from "~/components/note-list"
import { ActionFunction, json, LoaderFunction, redirect } from "@remix-run/node"
import { getStoredNotes, storeNotes } from "~/data/notes"
import { Note, NotesResponse } from "~/types/notes.types"
import { useLoaderData } from "@remix-run/react"

export default function NotesPage() {
  const { notes } = useLoaderData()

  return (
    <main>
      <NewNote />
      <NoteList notes={notes} />
    </main>
  )
}

export const loader: LoaderFunction = async () => {
  const notes = await getStoredNotes()
  return json<NotesResponse>({ notes })
}

export const action: ActionFunction = async ({ request}) => {
  const formData = await request.formData()
  const noteData = {
    ...Object.fromEntries(formData),
    id: new Date().toISOString()
  } as Note // TODO: how can we enforce type here?

  // TODO: Improve the validation here...
  if (noteData.title.trim().length < 5) {
    return { message: 'Invalid title! Must be at least 5 characters long.' }
  }

  const existingNotes = await getStoredNotes()
  const updatedNotes = existingNotes.concat(noteData)

  await storeNotes(updatedNotes)

  return redirect('/notes')
}

export function links() {
  return [
    ...newNoteLinks(),
    ...noteListLinks()
  ]
}
