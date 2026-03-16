import { CSSProperties, ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  style?: CSSProperties;
}

const Card = ({
  children,
  hover = false,
  padding = 'md',
  className = '',
  onClick,
  style
}: CardProps) => {
  const paddingStyles: Record<string, string> = {
    none: '0',
    sm: 'var(--space-4)',
    md: 'var(--space-6)',
    lg: 'var(--space-8)',
  };

  const baseStyles: CSSProperties = {
    backgroundColor: 'white',
    borderRadius: 'var(--radius-xl)',
    padding: paddingStyles[padding],
    boxShadow: 'var(--shadow-sm)',
    border: '1px solid var(--gray-200)',
    transition: 'all var(--transition-base)',
    cursor: onClick ? 'pointer' : 'default',
    ...style,
  };

  return (
    <div
      className={className}
      onClick={onClick}
      style={baseStyles}
      onMouseEnter={(e) => {
        if (hover) {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
        }
      }}
      onMouseLeave={(e) => {
        if (hover) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
        }
      }}
    >
      {children}
    </div>
  );
};

export default Card;
