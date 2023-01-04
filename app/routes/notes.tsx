import NewNote, { links as newNoteLinks } from "~/components/NewNote"
import NoteList , { links as noteListLinks } from "~/components/NoteList"
import { ActionFunction, json, LoaderFunction, redirect } from "@remix-run/node"
import { getStoredNotes, storeNotes } from "~/data/notes"
import { Note, NotesResponse } from "~/types/notes.types"
import {
  Link,
  useCatch,
  useLoaderData
} from "@remix-run/react"

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
  if (!notes || notes.length < 1) {
    throw json(
      { message: 'Could not find any notes.' },
      {
        status: 404,
        statusText: 'Not Found'
      }
    )
  }
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

export function CatchBoundary() {
  const caughtResponse = useCatch()
  const msg = caughtResponse.data?.message ?? 'Data not found.'

  return (
    <main>
      <NewNote />
      <p className="info-message">{msg}</p>
    </main>
  )
}

export function ErrorBoundary({error}: {error: Error}) {
  return (
    <main className="error">
      <h1>An error related to your notes occurred!</h1>
      <p>{error.message}</p>
      <p>Back to <Link to="/">safety</Link>!</p>
    </main>
  )
}
