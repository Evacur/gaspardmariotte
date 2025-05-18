export default function VideoBlock({ video }: { video: any }) {
  if (!video?.asset?.url) return null

  return (
    <div className="w-full max-h-[600px] overflow-hidden mb-12 px-6 sm:px-4 max-w-screen-lg">
      <video
        src={video.asset.url}
        controls
        className="w-full h-full object-cover rounded-lg shadow"
      />
    </div>
  )
}
