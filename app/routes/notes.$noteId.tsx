import { Link, useLoaderData } from "@remix-run/react"
import styles from '~/styles/note-details.css'
import { getStoredNotes } from "~/data/notes"
import { json, LoaderFunction } from "@remix-run/node"
import { Note } from "~/types/notes.types"

export default function NoteDetailsPage() {
  const note: Note = useLoaderData()

  return (
    <main id="note-details">
      <header>
        <nav>
          <Link to="/notes">Back To All Notes</Link>
        </nav>
        <h1>{note.title}</h1>
      </header>
      <p id="note-details-content">
        {note.content}
      </p>
    </main>
  )
}

export const loader: LoaderFunction = async ({params}) => {
  const notes = await getStoredNotes()
  const noteId = params.noteId
  const selectedNote = notes.find(note => note.id === noteId)

  if (!selectedNote) {
    throw json(
      { message: `Could not find note for id ${noteId}` },
      { status: 404 }
      )
  }

  return selectedNote
}

export function links() {
  return [
    { rel: 'stylesheet', href: styles }
  ]
}
