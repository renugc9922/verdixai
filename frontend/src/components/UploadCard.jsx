import { ImagePlus, UploadCloud, X } from 'lucide-react'

export default function UploadCard({
  uploadedCrop,
  errorMessage,
  onBrowse,
  onChange,
  onRemove,
  onDrop,
  onDragOver,
  onDragLeave,
  fileInputRef,
  isDragging,
  actions,
}) {
  return (
    <div
      className={`mt-5 rounded-[1.8rem] border-2 border-dashed p-5 transition sm:p-6 ${
        isDragging ? 'border-emerald-300 bg-emerald-400/10' : 'border-emerald-300/20 bg-white/5'
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <input ref={fileInputRef} type="file" accept=".png,.jpg,.jpeg,image/png,image/jpeg" className="hidden" onChange={onChange} />

      {!uploadedCrop ? (
        <button type="button" onClick={onBrowse} className="flex w-full flex-col items-center justify-center rounded-[1.5rem] border border-white/10 bg-black/10 px-4 py-10 text-center transition hover:border-emerald-300/25 hover:bg-white/5">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-emerald-300/20 bg-emerald-400/10 text-emerald-300">
            <ImagePlus className="h-8 w-8" />
          </div>
          <p className="mt-5 font-display text-2xl text-white">Upload Crop Leaf Image</p>
          <p className="mt-2 text-sm text-emerald-100/60">PNG, JPG, JPEG supported</p>
          <p className="mt-4 inline-flex items-center gap-2 text-sm text-emerald-300">
            <UploadCloud className="h-4 w-4" />
            Drag & drop or click to browse
          </p>
        </button>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
          <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/20">
            <img src={uploadedCrop.previewUrl} alt={uploadedCrop.cropType} className="h-64 w-full object-cover sm:h-72" />
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 backdrop-blur-md">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-emerald-100/55">Selected Image</p>
                <h3 className="mt-2 font-display text-2xl text-white">{uploadedCrop.cropType}</h3>
              </div>
              <button type="button" onClick={onRemove} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-emerald-100/75 transition hover:bg-white/10">
                <X className="h-4 w-4" />
                Remove
              </button>
            </div>
            <p className="mt-2 text-sm text-emerald-100/65">{uploadedCrop.fileName}</p>
            <div className="mt-5 space-y-3 text-sm text-emerald-100/70">
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/10 px-4 py-3">
                <span>Upload date</span>
                <span className="text-white">{uploadedCrop.uploadedAt}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/10 px-4 py-3">
                <span>File type</span>
                <span className="text-white">PNG / JPG / JPEG</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {errorMessage ? (
        <p className="mt-4 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">{errorMessage}</p>
      ) : null}

      {actions ? <div className="mt-5 flex flex-col gap-3 sm:flex-row">{actions}</div> : null}
    </div>
  )
}
