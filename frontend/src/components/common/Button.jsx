function Button({ 
  children, 
  variant = 'primary', 
  onClick, 
  disabled = false, 
  className = '',
  type = 'button',
  ...props 
}) {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    ghost: 'btn-ghost'
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
