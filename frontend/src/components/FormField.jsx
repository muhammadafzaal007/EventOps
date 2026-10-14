function FormField({ label, error, ...inputProps }) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-slate-700">{label}</span>
      <input
        {...inputProps}
        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none file:mr-3 file:rounded file:border-0 file:bg-slate-100 file:px-3 file:py-1"
      />
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  )
}

export default FormField
