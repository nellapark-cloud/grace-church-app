const colors = [
  'bg-rose-100 text-rose-700',
  'bg-amber-100 text-amber-700',
  'bg-green-100 text-green-700',
  'bg-sky-100 text-sky-700',
  'bg-violet-100 text-violet-700',
]

function colorFor(name: string) {
  const code = name.charCodeAt(0) || 0
  return colors[code % colors.length]
}

export function Avatar({
  name,
  photoUrl,
  size = 'md',
}: {
  name: string
  photoUrl?: string
  size?: 'sm' | 'md' | 'lg'
}) {
  const dimension = size === 'lg' ? 'h-16 w-16 text-xl' : size === 'md' ? 'h-9 w-9 text-sm' : 'h-7 w-7 text-xs'

  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={name}
        className={`${dimension} shrink-0 rounded-full object-cover`}
      />
    )
  }

  return (
    <div
      className={`${dimension} flex shrink-0 items-center justify-center rounded-full font-medium ${colorFor(name)}`}
    >
      {name.charAt(0)}
    </div>
  )
}
