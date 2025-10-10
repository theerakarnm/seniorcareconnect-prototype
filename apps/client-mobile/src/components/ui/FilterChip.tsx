import { TouchableOpacity, Text, type ViewStyle } from 'react-native';

interface FilterChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  className?: string;
  style?: ViewStyle;
}

export function FilterChip({ label, selected, onPress, className = '', style }: FilterChipProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`rounded-full px-4 py-2 mr-2 mb-2 ${
        selected
          ? 'bg-primary'
          : 'bg-muted border border-border'
      } ${className}`}
      style={style}
    >
      <Text
        className={`text-sm ${
          selected
            ? 'text-primary-foreground'
            : 'text-muted-foreground'
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}