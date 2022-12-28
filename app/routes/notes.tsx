import NewNote, { links as newNoteLinks } from "~/components/new-note";
import NoteList , { links as noteListLinks } from "~/components/note-list";
import {ActionFunction, json, LoaderFunction, redirect} from "@remix-run/node";
import {getStoredNotes, storeNotes} from "~/data/notes";
import {Note} from "~/interfaces/note.interface";
import {useLoaderData} from "@remix-run/react";

type LoaderData = {
  notes: Awaited<ReturnType<typeof getStoredNotes>>
}

export default function NotesPage() {
  const {notes} = useLoaderData() as LoaderData
  return (
    <main>
      <NewNote />
      <NoteList notes={notes}/>
    </main>
  )
}

export const loader: LoaderFunction = async () => {
  const notes = await getStoredNotes()
  return json<LoaderData>({ notes })
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
  return [
    ...newNoteLinks(),
    ...noteListLinks()
  ]
}
