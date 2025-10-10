import { View, type ViewProps, type ViewStyle } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
}

export function Card({ children, className = '', style, ...props }: CardProps) {
  return (
    <View
      className={`rounded-lg border border-border bg-card ${className}`}
      style={style}
      {...props}
    >
      {children}
    </View>
  );
}

export function CardHeader({ children, className = '', style, ...props }: CardProps) {
  return (
    <View
      className={`p-4 pb-0 ${className}`}
      style={style}
      {...props}
    >
      {children}
    </View>
  );
}

export function CardContent({ children, className = '', style, ...props }: CardProps) {
  return (
    <View
      className={`p-4 ${className}`}
      style={style}
      {...props}
    >
      {children}
    </View>
  );
}

export function CardFooter({ children, className = '', style, ...props }: CardProps) {
  return (
    <View
      className={`p-4 pt-0 ${className}`}
      style={style}
      {...props}
    >
      {children}
    </View>
  );
}