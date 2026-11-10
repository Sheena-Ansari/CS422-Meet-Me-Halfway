export default function PageState({ loaded, group, message }) {
  return (
    <div className="empty">
      {message ||
        (!loaded
          ? 'Loading group...'
          : !group
            ? 'Group not found.'
            : 'Loading...')}
    </div>
  )
}

// Also supports named imports
export { PageState }