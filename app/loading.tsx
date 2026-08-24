export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-nexa-violet/30 border-t-nexa-violet rounded-full animate-spin mx-auto" />
        <p className="text-text-secondary text-sm">Loading arena...</p>
      </div>
    </div>
  )
}
