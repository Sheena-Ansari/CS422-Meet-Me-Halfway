// Owner: Malika

export default function Chip({ children, selected, onClick }) {
  return (
    <button
      type="button"
      className={`chip ${selected ? 'selected' : ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
