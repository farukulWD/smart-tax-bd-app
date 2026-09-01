import React, { useEffect, useRef } from 'react';
import { View, ScrollView, TouchableOpacity, Pressable, ActivityIndicator } from 'react-native';
import AppText from '@/src/components/common/AppText';
import { useForm, useWatch, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { IncomeSource } from '@/src/services/orderApi';
import { useGetUserInfoQuery } from '@/src/services/auth';
import { useCreateTaxStepOneMutation } from '@/src/services/orderApi';
import { useGetAllIncomeSourcesQuery } from '@/src/services/publicApi';
import { readLocalized, toLocale } from '@/src/utils/localize';
import ProtectedScreen from '@/src/navigation/ProtectedScreen';
import { CURRENT_YEAR } from '@/src/utils/commonFunction';
import { toast } from '@/src/utils/ToastConfig';
import TaxYearPicker from '@/src/components/order/TaxYearPicker';
import { BackButton } from '@/src/components/global/BackButton';
import { globalErrorHandler } from '@/src/services/globalErrorHandler';
import { useThemeColors } from '@/src/theme/useThemeColors';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/src/redux/hooks';
import { setUser } from '@/src/redux/slices/authSlice';
import { logger } from '@/src/utils/logger';

const formSchema = z.object({
  source_of_income: z.array(z.string()).min(1, 'Please select at least one source of income'),
  tax_year: z.string().min(1, 'Tax year is required'),
});

type FormValues = z.infer<typeof formSchema>;

const QUERY_TAX_TYPE_TO_INCOME_SOURCE: Record<string, IncomeSource> = {
  income_tax: IncomeSource.PrivateJob,
  income_tax_government: IncomeSource.GovtJob,
  income_tax_non_government: IncomeSource.PrivateJob,
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
  agriculture_tax_return: IncomeSource.Agriculture,
  non_resident_bangladeshis: IncomeSource.ForignRemitance,
  housewife_tax_return: IncomeSource.OthersSource,
};

const CARD_GUTTER = 5;

const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View className="gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
    <AppText className="text-17 font-bold text-foreground">{title}</AppText>
    {children}
  </View>
);

const ErrorText = ({ message }: { message?: string }) =>
  message ? <AppText className="mt-1 text-xs text-destructive">{message}</AppText> : null;

const IncomeSourceCard = ({
  label,
  checked,
  onPress,
}: {
  label: string;
  checked: boolean;
  onPress: () => void;
}) => {
  const { colors } = useThemeColors();

  return (
    <Pressable
      onPress={onPress}
      className="h-26"
      style={{ flex: 1, margin: CARD_GUTTER, minWidth: 130, maxWidth: '48%' }}
      android_ripple={{ color: colors.muted }}>
      <View
        className={cn(
          'flex-1 justify-center rounded-xl border p-3',
          checked ? 'border-success bg-success/10' : 'border-border bg-muted'
        )}>
        <View
          className={cn(
            'absolute right-2 top-2 h-5 w-5 items-center justify-center rounded-full border',
            checked ? 'border-success bg-success' : 'border-mutedForeground bg-card'
          )}>
          {checked && <AppText className="text-11 font-bold text-white">✓</AppText>}
        </View>
        <AppText
          className={cn(
            'px-1 text-center text-13 font-semibold leading-5',
            checked ? 'text-success' : 'text-mutedForeground'
          )}
          numberOfLines={3}
          ellipsizeMode="tail">
          {label}
        </AppText>
      </View>
    </Pressable>
  );
};

const CreateTaxOrderForm = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const taxType: string = route.params?.taxType ?? '';

  const dispatch = useAppDispatch();
  const cachedUser = useAppSelector((state) => state.auth.user);

  const { data } = useGetUserInfoQuery();
  const profileData = data?.data;
  const profile = profileData ?? cachedUser;
  const [createTaxStepOne, { isLoading: isCreatingOrder }] = useCreateTaxStepOneMutation();

  const { i18n } = useTranslation();
  const locale = toLocale(i18n.language);
  const { data: incomeSourcesResponse, isLoading: isIncomeSourcesLoading } =
    useGetAllIncomeSourcesQuery(undefined, { refetchOnMountOrArgChange: true });
  const visibleIncomeSources = (incomeSourcesResponse?.data ?? [])
    .filter((source) => source.isActive)
    .sort((a, b) => a.order - b.order);

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      source_of_income: [],
      tax_year: `${CURRENT_YEAR}-${CURRENT_YEAR + 1}`,
    },
  });

  useEffect(() => {
    if (!profileData) return;
    dispatch(setUser(profileData));
  }, [profileData]);

  const preselectApplied = useRef(false);
  useEffect(() => {
    if (preselectApplied.current || isIncomeSourcesLoading) return;

    preselectApplied.current = true;

    const mapped = QUERY_TAX_TYPE_TO_INCOME_SOURCE[taxType];
    if (!mapped) return;

    const inCatalog = visibleIncomeSources.some((source) => source.value === mapped);
    if (inCatalog && getValues('source_of_income').length === 0) {
      setValue('source_of_income', [mapped]);
    }
  }, [taxType, isIncomeSourcesLoading, visibleIncomeSources]);

  const selectedIncomeSources = useWatch({ control, name: 'source_of_income' });
  const selectedTaxYear = useWatch({ control, name: 'tax_year' });

  const onSubmit = async (values: FormValues) => {
    if (!profile?.name || !profile?.mobile) {
      toast.error('Complete your profile before creating an order');
      return;
    }

    try {
      const res = await createTaxStepOne({
        personal_information: {
          name: profile.name,
          ...(profile.email ? { email: profile.email } : {}),
          phone: profile.mobile,
          are_you_student: false,
          are_you_house_wife: false,
        },
        tax_year: values.tax_year,
        source_of_income: values.source_of_income,
      }).unwrap();
      const orderId = res?.data?.tax_order?._id;
      if (!orderId) {
        toast.error('Order Not Found');
        return;
      }

      navigation.navigate('RequireDocuments', { taxId: orderId });
    } catch (error: any) {
      logger.log('error', JSON.stringify(error, null, 2));
      globalErrorHandler(error);
    }
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-start gap-3 px-4 py-4">
        <BackButton />

        <View className="flex-1">
          <View className="mb-1.5 self-start rounded-full border border-success/30 bg-success/10 px-3 py-0.5">
            <AppText className="text-11 font-bold text-success">TAX STEP 1</AppText>
          </View>
          <AppText className="text-2xl font-extrabold tracking-tight text-foreground">
            Create Tax Order
          </AppText>
          <AppText className="mt-0.5 text-13 text-mutedForeground">
            Submit step-1 details to create your tax order draft.
          </AppText>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 gap-4 pb-10"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <SectionCard title="Tax Filing Year">
          <Controller
            control={control}
            name="tax_year"
            render={({ field: { value, onChange } }) => (
              <TaxYearPicker value={value} onChange={onChange} />
            )}
          />
          <ErrorText message={errors.tax_year?.message} />
        </SectionCard>

        <SectionCard title="Source of Income">
          <Controller
            control={control}
            name="source_of_income"
            render={({ field: { value, onChange } }) => {
              if (isIncomeSourcesLoading) {
                return (
                  <AppText className="text-13 text-mutedForeground">
                    Loading income sources...
                  </AppText>
                );
              }

              if (visibleIncomeSources.length === 0) {
                return (
                  <AppText className="text-13 text-mutedForeground">
                    No income sources available right now.
                  </AppText>
                );
              }

              return (
                <View className="flex-row flex-wrap" style={{ margin: -CARD_GUTTER }}>
                  {visibleIncomeSources.map((source) => {
                    const checked = value.includes(source.value);
                    return (
                      <IncomeSourceCard
                        key={source._id}
                        label={readLocalized(source.title, locale) || source.value}
                        checked={checked}
                        onPress={() =>
                          onChange(
                            checked
                              ? value.filter((v) => v !== source.value)
                              : [...value, source.value]
                          )
                        }
                      />
                    );
                  })}
                </View>
              );
            }}
          />
          <ErrorText message={errors.source_of_income?.message} />
        </SectionCard>

        <View className="gap-3 rounded-3xl border border-border bg-card p-6">
          <AppText className="text-lg font-bold text-foreground">Order Summary</AppText>
          <AppText className="-mt-1 text-13 text-mutedForeground">
            Step 1 will create a draft order.
          </AppText>

          <View className="flex-row justify-between">
            <AppText className="text-13 text-mutedForeground">Income sources</AppText>
            <AppText className="text-13 font-bold text-foreground">
              {selectedIncomeSources.length} selected
            </AppText>
          </View>

          <View className="flex-row justify-between">
            <AppText className="text-13 text-mutedForeground">Tax year</AppText>
            <AppText className="text-13 font-bold text-foreground">{selectedTaxYear}</AppText>
          </View>

          <TouchableOpacity
            className={`mt-1 h-10 items-center justify-center rounded-2xl bg-primary ${
              isCreatingOrder ? 'opacity-70' : ''
            }`}
            onPress={handleSubmit(onSubmit)}
            disabled={isCreatingOrder}
            activeOpacity={0.85}>
            {isCreatingOrder ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <AppText className="text-base font-bold text-primaryForeground">Next ✓</AppText>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const CreateTaxOrderScreen = () => (
  <ProtectedScreen>
    <CreateTaxOrderForm />
  </ProtectedScreen>
);

export default CreateTaxOrderScreen;
