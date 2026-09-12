import { useEffect, useState } from 'react'
import { fetchTable, subscribeTable } from './dataService'

/**
 * Rows from `table`, kept current via realtime. INSERTs land at the front,
 * UPDATEs replace in place — so the map and feeds move without a refetch.
 */
export function useLiveTable(table) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true

    fetchTable(table).then((data) => {
      if (!alive) return
      setRows(data)
      setLoading(false)
    })

    const unsubscribe = subscribeTable(table, ({ eventType, new: row }) => {
      if (!row) return
      setRows((prev) => {
        if (eventType === 'INSERT') {
          if (prev.some((r) => r.id === row.id)) return prev
          return [row, ...prev]
        }
        if (eventType === 'UPDATE') return prev.map((r) => (r.id === row.id ? { ...r, ...row } : r))
        if (eventType === 'DELETE') return prev.filter((r) => r.id !== row.id)
        return prev
      })
    })

    return () => {
      alive = false
      unsubscribe()
    }
  }, [table])

  return { rows, loading }
}
