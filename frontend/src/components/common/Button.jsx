function Button({ 
  children, 
  variant = 'primary', 
  onClick, 
  disabled = false, 
  className = '',
  type = 'button',
  ...props 
}) {
  const baseClasses = 'font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-primary hover:bg-primary/90 text-white hover:scale-105 active:scale-95',
    secondary: 'bg-secondary hover:bg-secondary/90 text-white hover:scale-105 active:scale-95',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white hover:scale-105 active:scale-95',
    ghost: 'text-text/70 hover:text-text hover:bg-surface/50'
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
