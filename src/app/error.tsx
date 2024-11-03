'use client' // Error boundaries must be Client Components
 
import { useEffect } from 'react'
import {ErrorPage } from "@maany_shr/rage-ui-kit"

export default function Error(props: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(props.error)
  }, [props.error])
 
  return (
    <div>
      <ErrorPage error={{
        message: props.error.message,
        digest: props.error.digest
      }}/>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => props.reset()
        }
      >
        Try again
      </button>
    </div>
  )
}