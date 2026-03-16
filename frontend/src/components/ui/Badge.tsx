import { CSSProperties, ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'success' | 'danger' | 'warning' | 'info' | 'default';
  size?: 'sm' | 'md';
}

const Badge = ({ children, variant = 'default', size = 'md' }: BadgeProps) => {
  const variantStyles: Record<string, CSSProperties> = {
    success: {
      backgroundColor: 'var(--success-50)',
      color: 'var(--success-700)',
    },
    danger: {
      backgroundColor: 'var(--danger-50)',
      color: 'var(--danger-700)',
    },
    warning: {
      backgroundColor: 'var(--warning-50)',
      color: 'var(--warning-700)',
    },
    info: {
      backgroundColor: 'var(--primary-50)',
      color: 'var(--primary-700)',
    },
    default: {
      backgroundColor: 'var(--gray-100)',
      color: 'var(--gray-700)',
    },
  };

  const sizeStyles: Record<string, CSSProperties> = {
    sm: {
      padding: 'var(--space-1) var(--space-2)',
      fontSize: 'var(--text-xs)',
    },
    md: {
      padding: 'var(--space-2) var(--space-3)',
      fontSize: 'var(--text-sm)',
    },
  };

  const baseStyles: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: 'var(--radius-full)',
    fontWeight: 'var(--font-medium)',
    ...sizeStyles[size],
    ...variantStyles[variant],
  };

  return <span style={baseStyles}>{children}</span>;
};

export default Badge;
