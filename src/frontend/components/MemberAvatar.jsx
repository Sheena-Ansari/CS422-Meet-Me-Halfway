// Owner: Sheena

export default function MemberAvatar({ name }) {
  return (
    <span className="avatar" title={name}>
      {(name || '?')[0].toUpperCase()}
    </span>
  )
}
