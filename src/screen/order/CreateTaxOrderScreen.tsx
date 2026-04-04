import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useForm, useWatch, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { IncomeSource } from '@/src/services/orderApi';
import { useGetUserInfoQuery } from '@/src/services/auth';
import { useCreateTaxStepOneMutation } from '@/src/services/orderApi';
import ProtectedScreen from '@/src/navigation/ProtectedScreen';
import { CURRENT_YEAR, showToast } from '@/src/utils/commonFunction';
import TaxYearPicker from '@/src/components/order/TaxYearPicker';
import { globalErrorHandler } from '@/src/services/globalErrorHandler';
import { cn } from '@/lib/utils';

// ─── Schema ───────────────────────────────────────────────────────────────────

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Email is required'),
  mobile: z
    .string()
    .min(1, 'Mobile number is required')
    .regex(/^(\+8801|01)[3-9]\d{8}$/, 'Invalid mobile number format'),
  source_of_income: z
    .array(z.nativeEnum(IncomeSource))
    .min(1, 'Please select at least one source of income'),
  tax_year: z.string().min(1, 'Tax year is required'),
  income_from_ldt_company: z.boolean(),
  income_from_partnership_firm: z.boolean(),
  are_you_get_notice_from_tax_office: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

// ─── Constants ────────────────────────────────────────────────────────────────

const INCOME_SOURCES: { value: IncomeSource; label: string }[] = [
  { value: IncomeSource.GovtJob, label: 'Income from Govt. Job' },
  { value: IncomeSource.PrivateJob, label: 'Income from Private Job' },
  { value: IncomeSource.Business, label: 'Income from Business' },
  { value: IncomeSource.Rent, label: 'Income from Rent' },
  { value: IncomeSource.Agriculture, label: 'Income from Agriculture' },
  { value: IncomeSource.FinancialAsset, label: 'Income from Financial Asset' },
  { value: IncomeSource.CapitalGain, label: 'Income from Capital Gain' },
  { value: IncomeSource.OthersSource, label: 'Income from Other Source' },
  { value: IncomeSource.ForignRemitance, label: 'Income from Foreign Remittance' },
];

const QUERY_TAX_TYPE_TO_INCOME_SOURCE: Record<string, IncomeSource> = {
  income_tax: IncomeSource.PrivateJob,
  sales_tax: IncomeSource.Business,
  vat: IncomeSource.Business,
  value_added_tax: IncomeSource.Business,
  service_tax: IncomeSource.Business,
  import_duty: IncomeSource.Business,
  business_tax: IncomeSource.Business,
  excise_duty: IncomeSource.Business,
  customs_duty: IncomeSource.Business,
  entertainment_tax: IncomeSource.Business,
  environmental_tax: IncomeSource.Business,
  house_rental_tax: IncomeSource.Rent,
  property_tax: IncomeSource.Rent,
  capital_gains_tax: IncomeSource.CapitalGain,
  gift_tax: IncomeSource.OthersSource,
  inheritance_tax: IncomeSource.OthersSource,
  wealth_tax: IncomeSource.FinancialAsset,
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View className="gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
    <Text className="text-[17px] font-bold text-foreground">{title}</Text>
    {children}
  </View>
);

const FieldLabel = ({ label }: { label: string }) => (
  <Text className="mb-1 font-semibold text-foreground">{label}</Text>
);

const ErrorText = ({ message }: { message?: string }) =>
  message ? <Text className="mt-1 text-xs text-red-600">{message}</Text> : null;

const CheckboxItem = ({
  label,
  checked,
  onPress,
}: {
  label: string;
  checked: boolean;
  onPress: () => void;
}) => (
  <Pressable
    onPress={onPress}
    className={`flex-row items-center gap-3 rounded-xl border px-4 py-3 ${
      checked ? 'border-green-700 bg-green-700/10' : 'border-border bg-muted'
    }`}
    android_ripple={{ color: '#d1fae5' }}>
    <View
      className={`h-5 w-5 items-center justify-center rounded-[5px] border-2 ${
        checked ? 'border-green-700 bg-green-700' : 'border-mutedForeground bg-card'
      }`}>
      {checked && <Text className="text-xs font-bold text-white">✓</Text>}
    </View>
    <Text
      className={cn(
        'flex-1 text-[13.5px] text-gray-700',
        checked ? 'text-green-700' : 'text-mutedForeground'
      )}>
      {label}
    </Text>
  </Pressable>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────

const CreateTaxOrderScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const taxType: string = route.params?.taxType ?? '';

  const { data } = useGetUserInfoQuery();
  const profileData = data?.data;
  const [createTaxStepOne, { isLoading: isCreatingOrder }] = useCreateTaxStepOneMutation();

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      mobile: '',
      source_of_income: [],
      tax_year: `${CURRENT_YEAR}-${CURRENT_YEAR + 1}`,
      income_from_ldt_company: false,
      income_from_partnership_firm: false,
      are_you_get_notice_from_tax_office: false,
    },
  });

  useEffect(() => {
    if (!profileData) return;
    const p = profileData;
    if (p?.name && !getValues('name')) setValue('name', p.name);
    if (p?.email && !getValues('email')) setValue('email', p.email);
    if (p?.mobile && !getValues('mobile')) setValue('mobile', p.mobile);
  }, [profileData]);

  useEffect(() => {
    const mapped = QUERY_TAX_TYPE_TO_INCOME_SOURCE[taxType];
    if (mapped && getValues('source_of_income').length === 0) {
      setValue('source_of_income', [mapped]);
    }
  }, [taxType]);

  const selectedIncomeSources = useWatch({ control, name: 'source_of_income' });
  const selectedTaxYear = useWatch({ control, name: 'tax_year' });

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await createTaxStepOne({
        personal_iformation: {
          name: values.name,
          email: values.email,
          phone: values.mobile,
          are_you_student: false,
          are_you_house_wife: false,
        },
        tax_year: values.tax_year,
        source_of_income: values.source_of_income,
        income_from_ldt_company: values.income_from_ldt_company,
        income_from_partnership_firm: values.income_from_partnership_firm,
        are_you_get_notice_from_tax_office: values.are_you_get_notice_from_tax_office,
      }).unwrap();
      const orderId = res?.data?.tax_order?._id;
      if (!orderId) {
        showToast({ message: 'Order Not Found' });
        return;
      }

      navigation.navigate('RequireDocuments', { taxId: orderId });
      // navigation.navigate('UploadDocuments', { orderId });
    } catch (error: any) {
      globalErrorHandler(error);
    }
  };

  return (
    <ProtectedScreen redirectTo={{ screen: 'CreateTaxOrder' }}>
      <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
        {/* Header */}
        <View className="flex-row items-start gap-3 px-4 py-4">
          <Pressable
            className="mt-1 h-10 w-10 items-center justify-center rounded-xl border border-border bg-card shadow-sm"
            onPress={() => navigation.goBack()}>
            <Text className="text-xl text-foreground">←</Text>
          </Pressable>

          <View className="flex-1">
            <View className="mb-1.5 self-start rounded-full border border-green-100 bg-green-50 px-3 py-0.5">
              <Text className="text-[11px] font-bold text-green-700">TAX STEP 1</Text>
            </View>
            <Text className="text-2xl font-extrabold tracking-tight text-foreground">
              Create Tax Order
            </Text>
            <Text className="mt-0.5 text-[13px] text-mutedForeground">
              Submit step-1 details to create your tax order draft.
            </Text>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerClassName="px-4 gap-4 pb-10"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {/* Personal Information */}
          <SectionCard title="Personal Information">
            <View className="gap-4">
              {/* Name */}
              <View>
                <FieldLabel label="Full Name" />
                <Controller
                  control={control}
                  name="name"
                  render={({ field: { value, onChange } }) => (
                    <TextInput
                      className="rounded-xl border border-border bg-muted px-4 py-3 text-sm text-mutedForeground"
                      value={value}
                      onChangeText={onChange}
                      editable={false}
                      placeholder="Your full name"
                      placeholderClassName="text-mutedForeground"
                    />
                  )}
                />
                <ErrorText message={errors.name?.message} />
              </View>

              {/* Email */}
              <View>
                <FieldLabel label="Email" />
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { value, onChange } }) => (
                    <TextInput
                      className="rounded-xl border border-border bg-muted px-4 py-3 text-sm text-mutedForeground"
                      value={value}
                      onChangeText={onChange}
                      editable={false}
                      placeholder="Your email"
                      placeholderClassName="text-mutedForeground"
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  )}
                />
                <ErrorText message={errors.email?.message} />
              </View>

              {/* Mobile */}
              <View>
                <FieldLabel label="Mobile Number" />
                <Controller
                  control={control}
                  name="mobile"
                  render={({ field: { value, onChange } }) => (
                    <TextInput
                      className="rounded-xl border border-border bg-muted px-4 py-3 text-sm text-foreground"
                      value={value}
                      onChangeText={onChange}
                      placeholder="e.g. 01712345678"
                      placeholderClassName="text-mutedForeground"
                      keyboardType="phone-pad"
                    />
                  )}
                />
                <ErrorText message={errors.mobile?.message} />
              </View>

              {/* Tax Year */}
              <View>
                <FieldLabel label="Tax Filing Year" />
                <Controller
                  control={control}
                  name="tax_year"
                  render={({ field: { value, onChange } }) => (
                    <TaxYearPicker value={value} onChange={onChange} />
                  )}
                />
                <ErrorText message={errors.tax_year?.message} />
              </View>
            </View>
          </SectionCard>

          {/* Source of Income */}
          <SectionCard title="Source of Income">
            <Controller
              control={control}
              name="source_of_income"
              render={({ field: { value, onChange } }) => (
                <View className="gap-2.5">
                  {INCOME_SOURCES.map((source) => {
                    const checked = value.includes(source.value);
                    return (
                      <CheckboxItem
                        key={source.value}
                        label={source.label}
                        checked={checked}
                        onPress={() => {
                          if (checked) {
                            onChange(value.filter((v) => v !== source.value));
                          } else {
                            onChange([...value, source.value]);
                          }
                        }}
                      />
                    );
                  })}
                </View>
              )}
            />
            <ErrorText message={errors.source_of_income?.message} />
          </SectionCard>

          {/* Additional Information */}
          <SectionCard title="Additional Information">
            <View className="gap-3">
              {(
                [
                  { name: 'income_from_ldt_company', label: 'Income from LTD company' },
                  { name: 'income_from_partnership_firm', label: 'Income from partnership firm' },
                  {
                    name: 'are_you_get_notice_from_tax_office',
                    label: 'Received notice from tax office',
                  },
                ] as const
              ).map((opt) => (
                <Controller
                  key={opt.name}
                  control={control}
                  name={opt.name}
                  render={({ field: { value, onChange } }) => (
                    <CheckboxItem
                      label={opt.label}
                      checked={value}
                      onPress={() => onChange(!value)}
                    />
                  )}
                />
              ))}
            </View>
          </SectionCard>

          {/* Order Summary */}
          <View className="gap-3 rounded-3xl border border-border bg-card p-6">
            <Text className="text-[18px] font-bold text-white">Order Summary</Text>
            <Text className="-mt-1 text-[13px] text-mutedForeground">
              Step 1 will create a draft order.
            </Text>

            <View className="flex-row justify-between">
              <Text className="text-[13px] text-mutedForeground">Income sources</Text>
              <Text className="text-[13px] font-bold text-white">
                {selectedIncomeSources.length} selected
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-[13px] text-mutedForeground">Tax year</Text>
              <Text className="text-[13px] font-bold text-white">{selectedTaxYear}</Text>
            </View>

            <TouchableOpacity
              className={`mt-1 items-center rounded-2xl bg-primary py-4 ${
                isCreatingOrder ? 'opacity-70' : ''
              }`}
              onPress={handleSubmit(onSubmit)}
              disabled={isCreatingOrder}
              activeOpacity={0.85}>
              {isCreatingOrder ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-base font-bold text-primaryForeground">Next ✓</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </ProtectedScreen>
  );
};

export default CreateTaxOrderScreen;
