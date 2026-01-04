import styles from './YearBadge.module.css';

interface YearBadgeProps {
  year: string;
  className?: string;
}

export function YearBadge({ year, className }: YearBadgeProps) {
  return <span class={`${styles.yearBadge} ${className || ''}`}>{year}</span>;
}
