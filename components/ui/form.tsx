import React from 'react';
import { View } from 'react-native';
import { Controller, Control, FieldPath, FieldValues } from 'react-hook-form';
import { Text } from '@/components/ui/text';

// ─── FormField ────────────────────────────────────────────────────────────────

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  render: (props: {
    field: {
      onChange: (...event: unknown[]) => void;
      onBlur: () => void;
      value: unknown;
    };
  }) => React.ReactElement;
}

function FormField<T extends FieldValues>({
  control,
  name,
  render,
}: FormFieldProps<T>): React.ReactElement {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }): React.ReactElement => render({ field })}
    />
  );
}

// ─── FormItem ─────────────────────────────────────────────────────────────────

const FormItem = ({ children }: { children: React.ReactNode }): React.ReactElement => (
  <View className="gap-1.5">{children}</View>
);

// ─── FormLabel ────────────────────────────────────────────────────────────────

const FormLabel = ({ children }: { children: React.ReactNode }): React.ReactElement => (
  <Text className="text-sm font-medium text-foreground">{children}</Text>
);

// ─── FormControl ─────────────────────────────────────────────────────────────

const FormControl = ({ children }: { children: React.ReactNode }): React.ReactElement => (
  <View>{children}</View>
);

// ─── FormMessage ─────────────────────────────────────────────────────────────

const FormMessage = ({ message }: { message?: string }): React.ReactElement | null => {
  if (!message) return null;
  return <Text className="ml-1 text-xs text-destructive">{message}</Text>;
};

export { FormField, FormItem, FormLabel, FormControl, FormMessage };
