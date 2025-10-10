import { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react-native';

interface DatePickerProps {
  value?: Date;
  onChange: (date: Date) => void;
  placeholder?: string;
  minimumDate?: Date;
  maximumDate?: Date;
  className?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'Select date',
  minimumDate,
  maximumDate,
  className = '',
}: DatePickerProps) {
  const [isVisible, setIsVisible] = useState(false);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const [currentMonth, setCurrentMonth] = useState(value || new Date());

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    onChange(selectedDate);
    setIsVisible(false);
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const isDateSelectable = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);

    if (minimumDate && date < minimumDate) {
      return false;
    }

    if (maximumDate && date > maximumDate) {
      return false;
    }

    return true;
  };

  const isToday = (day: number) => {
    const today = new Date();
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (day: number) => {
    if (!value) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date.toDateString() === value.toDateString();
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <View className={className}>
      <TouchableOpacity
        onPress={() => setIsVisible(true)}
        className="flex-row items-center p-3 border border-border rounded-lg bg-card"
      >
        <Calendar size={20} className="text-muted-foreground" />
        <Text className="ml-3 flex-1 text-foreground">
          {value ? value.toLocaleDateString() : placeholder}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="w-80 bg-background rounded-lg p-4">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-4">
              <TouchableOpacity onPress={handlePreviousMonth}>
                <ChevronLeft size={24} className="text-foreground" />
              </TouchableOpacity>
              <Text className="text-lg font-semibold text-foreground">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </Text>
              <TouchableOpacity onPress={handleNextMonth}>
                <ChevronRight size={24} className="text-foreground" />
              </TouchableOpacity>
            </View>

            {/* Week days */}
            <View className="flex-row justify-between mb-2">
              {weekDays.map((day) => (
                <View key={day} className="w-10 items-center">
                  <Text className="text-xs text-muted-foreground font-medium">
                    {day}
                  </Text>
                </View>
              ))}
            </View>

            {/* Calendar days */}
            <View className="flex-row flex-wrap">
              {generateCalendarDays().map((day, index) => (
                <View key={index} className="w-10 h-10 items-center justify-center">
                  {day && (
                    <TouchableOpacity
                      onPress={() => handleDateSelect(day)}
                      disabled={!isDateSelectable(day)}
                      className={`w-8 h-8 rounded-full items-center justify-center ${
                        isSelected(day)
                          ? 'bg-primary'
                          : isToday(day)
                          ? 'bg-muted border border-primary'
                          : isDateSelectable(day)
                          ? ''
                          : 'opacity-30'
                      }`}
                    >
                      <Text
                        className={`text-sm ${
                          isSelected(day)
                            ? 'text-primary-foreground font-medium'
                            : isToday(day)
                            ? 'text-primary font-medium'
                            : isDateSelectable(day)
                            ? 'text-foreground'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {day}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>

            {/* Actions */}
            <View className="flex-row justify-end mt-4 pt-4 border-t border-border">
              <TouchableOpacity
                onPress={() => setIsVisible(false)}
                className="px-4 py-2"
              >
                <Text className="text-primary">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}