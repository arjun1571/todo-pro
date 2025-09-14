import React from 'react'
export default function EmptyState({ title='Nothing here', subtitle='Try adding something new.' }){
  return (
    <div className="text-center py-16 text-zinc-600 dark:text-zinc-300">
      <div className="text-6xl mb-3">🗒️</div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-sm">{subtitle}</p>
    </div>
  )
}
