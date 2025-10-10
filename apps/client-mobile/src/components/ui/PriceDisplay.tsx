import { Text } from 'react-native';

interface PriceDisplayProps {
  amount: number;
  currency?: string;
  period?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeStyles = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

export function PriceDisplay({
  amount,
  currency = '฿',
  period = '',
  size = 'md',
  className = '',
}: PriceDisplayProps) {
  const formattedAmount = amount.toLocaleString('th-TH', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return (
    <Text className={`font-semibold text-primary ${sizeStyles[size]} ${className}`}>
      {currency}{formattedAmount}
      {period && <Text className="text-sm text-muted-foreground">/{period}</Text>}
    </Text>
  );
}