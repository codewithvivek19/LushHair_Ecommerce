import { LoadingSpinner } from "@/components/ui/LoadingSpinner"

export default function NewProductLoading() {
  return (
    <div className="flex h-[70vh] items-center justify-center">
      <LoadingSpinner size="large" />
    </div>
  )
} 