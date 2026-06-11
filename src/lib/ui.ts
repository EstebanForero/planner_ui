// Shared Tailwind class fragments so every section of the app looks consistent.

export const card = "bg-zinc-900 border border-zinc-800 rounded-xl shadow-lg shadow-black/20 p-4"

export const sectionTitle = "text-2xl font-bold text-white tracking-tight"
export const sectionSubtitle = "text-sm text-zinc-400 mt-1"

export const inputClass = "rounded-lg bg-zinc-950 border border-zinc-700 px-3 py-2 text-white " +
  "placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 " +
  "focus:border-transparent transition disabled:opacity-50"

export const labelClass = "text-xs font-medium text-zinc-400 uppercase tracking-wide"

export const primaryButton = "rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium " +
  "px-4 py-2 transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-violet-600"

export const secondaryButton = "rounded-lg border border-zinc-700 text-zinc-200 hover:bg-zinc-800 " +
  "font-medium px-4 py-2 transition disabled:opacity-40 disabled:cursor-not-allowed"

export const dangerButton = "rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/10 " +
  "font-medium px-3 py-1.5 text-sm transition disabled:opacity-40"

export const badge = "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"

export const badgeViolet = `${badge} bg-violet-500/15 text-violet-300 border border-violet-500/30`
export const badgeGreen = `${badge} bg-green-500/15 text-green-300 border border-green-500/30`
export const badgeYellow = `${badge} bg-yellow-500/15 text-yellow-300 border border-yellow-500/30`
export const badgeGray = `${badge} bg-zinc-700/40 text-zinc-300 border border-zinc-600/50`
