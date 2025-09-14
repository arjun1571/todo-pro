import React from 'react'

export default function Pagination({ page, total, limit, onChange }:{ page:number, total:number, limit:number, onChange:(p:number)=>void }) {
  const totalPages = Math.max(1, Math.ceil(total/limit))
  return (
    <div className="flex items-center gap-2">
      <button className="px-3 py-1 border rounded disabled:opacity-50" disabled={page<=1} onClick={()=>onChange(page-1)}>Prev</button>
      <span className="text-sm">Page {page} / {totalPages}</span>
      <button className="px-3 py-1 border rounded disabled:opacity-50" disabled={page>=totalPages} onClick={()=>onChange(page+1)}>Next</button>
    </div>
  )
}
