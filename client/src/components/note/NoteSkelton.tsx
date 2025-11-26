import { Skeleton } from '../ui/skeleton'

const NoteSkelton = () => {
  return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
              <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
      </div>
  )
}

export default NoteSkelton