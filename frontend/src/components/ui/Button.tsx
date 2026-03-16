import { CSSProperties, ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  style?: CSSProperties;
}

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  style
}: ButtonProps) => {
  const baseStyles: CSSProperties = {
    fontFamily: 'var(--font-sans)',
    fontWeight: 'var(--font-semibold)',
    borderRadius: 'var(--radius-lg)',
    border: 'none',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: 'all var(--transition-base)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-2)',
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled || loading ? 0.6 : 1,
    position: 'relative',
  };

  const sizeStyles: Record<string, CSSProperties> = {
    sm: {
      padding: 'var(--space-2) var(--space-4)',
      fontSize: 'var(--text-sm)',
    },
    md: {
      padding: 'var(--space-3) var(--space-6)',
      fontSize: 'var(--text-base)',
    },
    lg: {
      padding: 'var(--space-4) var(--space-8)',
      fontSize: 'var(--text-lg)',
    },
  };

  const variantStyles: Record<string, CSSProperties> = {
    primary: {
      backgroundColor: 'var(--primary-600)',
      color: 'white',
    },
    secondary: {
      backgroundColor: 'var(--gray-200)',
      color: 'var(--gray-800)',
    },
    success: {
      backgroundColor: 'var(--success-500)',
      color: 'white',
    },
    danger: {
      backgroundColor: 'var(--danger-500)',
      color: 'white',
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'var(--primary-600)',
      border: '2px solid var(--primary-600)',
    },
  };

  const hoverStyles: CSSProperties = {
    ...(variant === 'primary' && !disabled && !loading && { 
      backgroundColor: 'var(--primary-700)' 
    }),
    ...(variant === 'success' && !disabled && !loading && { 
      backgroundColor: 'var(--success-700)' 
    }),
    ...(variant === 'danger' && !disabled && !loading && { 
      backgroundColor: 'var(--danger-700)' 
    }),
    ...(variant === 'secondary' && !disabled && !loading && { 
      backgroundColor: 'var(--gray-300)' 
    }),
    ...(variant === 'outline' && !disabled && !loading && { 
      backgroundColor: 'var(--primary-50)' 
    }),
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        ...baseStyles,
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          Object.assign(e.currentTarget.style, hoverStyles);
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading) {
          Object.assign(e.currentTarget.style, variantStyles[variant]);
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
    >
      {loading ? (
        <>
          <div style={{
            width: '16px',
            height: '16px',
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite',
          }} />
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
          Chargement...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
