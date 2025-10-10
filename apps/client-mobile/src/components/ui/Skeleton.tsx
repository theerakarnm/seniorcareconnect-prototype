import { View, type ViewStyle } from 'react-native';
import { useColorScheme } from 'nativewind';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: ViewStyle;
  variant?: 'default' | 'circle' | 'rounded';
}

export function Skeleton({
  width = '100%',
  height = 20,
  className = '',
  style,
  variant = 'default',
}: SkeletonProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const baseStyle: ViewStyle = {
    width,
    height,
    backgroundColor: isDark ? '#27272a' : '#e5e7eb',
  };

  const variantStyles = {
    default: {},
    circle: {
      borderRadius: 9999,
    },
    rounded: {
      borderRadius: 8,
    },
  };

  return (
    <View
      className={`animate-pulse ${className}`}
      style={[baseStyle, variantStyles[variant], style]}
    />
  );
}

export function CardSkeleton() {
  return (
    <View className="border border-border bg-card p-4 rounded-lg">
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <Skeleton width="80%" height={20} className="mb-2" />
          <Skeleton width="60%" height={16} />
        </View>
        <Skeleton width={60} height={24} variant="rounded" />
      </View>

      <View className="space-y-2">
        <Skeleton width="100%" height={16} />
        <Skeleton width="90%" height={16} />
        <Skeleton width="70%" height={16} />
      </View>

      <View className="flex-row justify-between items-center mt-4 pt-3 border-t border-border">
        <Skeleton width={80} height={20} />
        <Skeleton width={20} height={20} variant="circle" />
      </View>
    </View>
  );
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <View className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </View>
  );
}