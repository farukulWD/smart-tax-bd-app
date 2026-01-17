import FaqItem from '@/src/components/faq/FaqItem';
import Header from '@/src/components/global/Header';
import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';

export type FAQItem = {
  question: string;
  answer: string;
  note?: string;
};

type FAQData = {
  country: string;
  tax_year_reference: string;
  faqs: FAQItem[];
  verification_note?: string;
};

const data: FAQData = {
  country: 'Bangladesh',
  tax_year_reference:
    'Finance Ordinance 2025 (Applicable for Assessment Years 2026-2027 and 2027-2028)',
  faqs: [
    {
      question: 'What is the meaning of income tax?',
      answer:
        'In Bangladesh, income tax is levied on the income of the taxpayer. According to the Income Tax Act-2023 (as amended), this tax includes not only the income tax due under the act but also additional tax, surplus tax, fines, interest, or any recoverable amounts. In essence, income tax is a mandatory contribution to the government, intended to help cover state expenses for the benefit of all citizens.',
    },
    {
      question: 'What is E-TIN?',
      answer: 'E-TIN stands for Electronic Tax Identification Number.',
    },
    {
      question: 'Who is eligible for the income tax return in Bangladesh?',
      answer:
        'With a few exceptions, any individual with an E-TIN (Electronic Taxpayer Identification Number) is required to submit a tax return.',
    },
    {
      question: 'Who will pay income tax in Bangladesh?',
      answer:
        'Individuals whose income exceeds the minimum taxable thresholds are required to pay income tax. The thresholds vary by category: BDT 375,000 for general taxpayers (males), BDT 425,000 for women and senior citizens aged 65 or above, BDT 500,000 for third gender and physically challenged persons, BDT 525,000 for gazetted war-wounded freedom fighters.',
    },
    {
      question: 'What are the sources of income for income tax?',
      answer:
        'According to the Income Tax Act-2023, the sources of income are as follows: 1. Income from Employment, 2. Income from Rent, 3. Income from Agriculture, 4. Income from Business, 5. Income from Capital Gain, 6. Income from Financial Assets, 7. Income from Other Sources.',
    },
    {
      question: 'What is Tax Deducted at Source (TDS)?',
      answer:
        'The tax deducted from income before payment is referred to as Tax Deducted at Source (TDS).',
    },
    {
      question: 'How do I apply for E-TIN?',
      answer: 'To get your E-TIN, please visit the website incometax.gov.bd',
    },
    {
      question: 'When do I have to file my income tax return?',
      answer:
        'Individual taxpayers must submit their income tax returns between July 1st and November 30th each year.',
    },
    {
      question: 'Where to submit the income tax return?',
      answer:
        'You must submit your income tax return to the respective tax circle mentioned on your E-TIN.',
    },
    {
      question: 'What is the zero-income tax return?',
      answer:
        'If the taxable income does not exceed the minimum threshold (varying by category: BDT 375,000 for general, BDT 425,000 for women/seniors, etc.), the individual is eligible to submit a zero-income tax return.',
    },
    {
      question: 'What is the income tax rate in Bangladesh?',
      answer:
        'For general taxpayers (e.g., males under 65):\n- First BDT 375,000: 0%\n- Next BDT 300,000: 10%\n- Next BDT 400,000: 15%\n- Next BDT 500,000: 20%\n- Next BDT 2,000,000: 25%\n- On the remaining: 30%\n\nFor women, third gender, or individuals aged 65 or above (adjusted thresholds apply, but rates are progressive similarly starting from their higher exemption limit). Note: Special categories have higher initial exemptions as listed in eligibility questions.',
      note: 'Progressive slab rates applied on total income. These rates are updated for AY 2026-2027 and 2027-2028.',
    },
    {
      question: 'What is the minimum tax?',
      answer:
        'When taxable income exceeds the tax-free limit, the taxpayer must pay a flat minimum tax of BDT 5,000 nationwide (regardless of location). For new taxpayers, the minimum tax is BDT 1,000 for AY 2026-2027 and 2027-2028.',
    },
  ],
  verification_note:
    'The provided FAQ data from the screenshots references the Income Tax Act-2023. As of January 2026, updates from the Finance Ordinance 2025 have revised thresholds, tax slabs (removing the 5% slab and adjusting others), and minimum tax to a flat rate. No major changes to sources of income, filing deadlines, or E-TIN processes were found. Data verified from official and reputable sources including PwC, KPMG, and NBR publications.',
};

const FAQScreen = () => {
  const headerTitle = useMemo(() => `FAQ • ${data.country}`, []);

  const renderItem = ({ item }: { item: FAQItem; index: number }) => {
    return <FaqItem item={item} />;
  };

  return (
    <View className="flex-1 bg-background px-3 pt-3">
      <Header />
      {/* Header */}
      <View className="my-3 rounded-xl border border-border bg-card px-3 py-3">
        <Text className="text-[16px] font-bold text-foreground">{headerTitle}</Text>
        <Text className="mt-1 text-[12px] text-mutedForeground">{data.tax_year_reference}</Text>
      </View>

      {/* List */}
      <FlatList
        data={data.faqs}
        keyExtractor={(item, idx) => `${idx}-${item.question}`}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 12 }}
      />

      {/* Footer Note (tight spacing) */}
      {!!data.verification_note && (
        <View className="mb-3 rounded-xl border border-border bg-card px-3 py-3">
          <Text className="text-[12px] font-semibold text-foreground">Verification note</Text>
          <Text className="mt-1 text-xs text-mutedForeground">{data.verification_note}</Text>
        </View>
      )}
    </View>
  );
};

export default FAQScreen;
