import { Deduction } from '../types';

export const getTaxesForCountry = (country: string): Omit<Deduction, 'id'>[] => {
  switch (country) {
    case 'Philippines':
      return [
        { 
          name: 'BIR Income Tax',
          type: 'progressive',
          brackets: [
            { min: 0, max: 250000, rate: 0 },
            { min: 250000, max: 400000, rate: 15 },
            { min: 400000, max: 800000, rate: 20 },
            { min: 800000, max: 2000000, rate: 25 },
            { min: 2000000, max: 8000000, rate: 30 },
            { min: 8000000, max: null, rate: 35 }
          ]
        },
        { name: 'Social Security System (SSS)', type: 'percentage', value: 4.5 },
        { name: 'Philippine Health (PhilHealth)', type: 'percentage', value: 2.5 },
        { name: 'Home Development Mutual Fund (Pag-IBIG)', type: 'fixed', value: 2400, frequency: 'annual' },
      ];
    case 'United States':
      return [
        { 
          name: 'Federal Income Tax',
          type: 'progressive',
          brackets: [
            { min: 0, max: 11600, rate: 10 },
            { min: 11600, max: 47150, rate: 12 },
            { min: 47150, max: 100525, rate: 22 },
            { min: 100525, max: 191950, rate: 24 },
            { min: 191950, max: 243725, rate: 32 },
            { min: 243725, max: 609350, rate: 35 },
            { min: 609350, max: null, rate: 37 }
          ]
        },
        { name: 'State Income Tax (Average)', type: 'percentage', value: 4 },
        { name: 'Social Security (FICA)', type: 'percentage', value: 6.2 },
        { name: 'Medicare (FICA)', type: 'percentage', value: 1.45 },
      ];
    case 'United Kingdom':
      return [
        { name: 'HM Revenue & Customs (HMRC) Income Tax', type: 'percentage', value: 20 },
        { name: 'National Insurance Contributions (NICs)', type: 'percentage', value: 8 },
      ];
    case 'Australia':
      return [
        { name: 'Australian Taxation Office (ATO) Income Tax', type: 'percentage', value: 32.5 },
        { name: 'Medicare Levy', type: 'percentage', value: 2 },
      ];
    case 'Canada':
      return [
        { name: 'Federal Income Tax (CRA)', type: 'percentage', value: 15 },
        { name: 'Provincial Income Tax', type: 'percentage', value: 5.05 },
        { name: 'Canada Pension Plan (CPP)', type: 'percentage', value: 5.95 },
        { name: 'Employment Insurance (EI)', type: 'percentage', value: 1.63 },
      ];
    case 'Germany':
      return [
        { name: 'Lohnsteuer (Income Tax)', type: 'percentage', value: 14 },
        { name: 'Rentenversicherung (Pension Insurance)', type: 'percentage', value: 9.3 },
        { name: 'Krankenversicherung (Health Insurance)', type: 'percentage', value: 7.3 },
        { name: 'Arbeitslosenversicherung (Unemployment)', type: 'percentage', value: 1.3 },
        { name: 'Pflegeversicherung (Care Insurance)', type: 'percentage', value: 1.7 },
      ];
    case 'France':
      return [
        { name: 'Impôt sur le revenu (Income Tax)', type: 'percentage', value: 11 },
        { name: 'CSG/CRDS (Social Contributions)', type: 'percentage', value: 9.7 },
      ];
    case 'India':
      return [
        { name: 'Income Tax (TDS)', type: 'percentage', value: 10 },
        { name: 'Employees Provident Fund (EPF)', type: 'percentage', value: 12 },
        { name: 'Health & Education Cess', type: 'percentage', value: 4 },
      ];
    case 'Japan':
      return [
        { name: 'Shotokuzei (National Income Tax)', type: 'percentage', value: 10 },
        { name: 'Juminzei (Inhabitant Tax)', type: 'percentage', value: 10 },
        { name: 'Kenko Hoken (Health Insurance)', type: 'percentage', value: 5 },
        { name: 'Kosei Nenkin (Pension Insurance)', type: 'percentage', value: 9.15 },
        { name: 'Koyo Hoken (Employment Insurance)', type: 'percentage', value: 0.3 },
      ];
    case 'Singapore':
      return [
        { name: 'IRAS Income Tax', type: 'percentage', value: 7 },
        { name: 'Central Provident Fund (CPF)', type: 'percentage', value: 20 },
      ];
    case 'Brazil':
      return [
        { name: 'Imposto de Renda Retido na Fonte (IRRF)', type: 'percentage', value: 15 },
        { name: 'Instituto Nacional do Seguro Social (INSS)', type: 'percentage', value: 9 },
      ];
    case 'Mexico':
      return [
        { name: 'Impuesto Sobre la Renta (ISR)', type: 'percentage', value: 20 },
        { name: 'Instituto Mexicano del Seguro Social (IMSS)', type: 'percentage', value: 2.5 },
      ];
    case 'Nigeria':
      return [
        { name: 'Pay-As-You-Earn (PAYE) Tax', type: 'percentage', value: 15 },
        { name: 'Pension Fund Administration (PFA)', type: 'percentage', value: 8 },
        { name: 'National Housing Fund (NHF)', type: 'percentage', value: 2.5 },
      ];
    case 'South Africa':
      return [
        { name: 'Pay-As-You-Earn (PAYE) Tax', type: 'percentage', value: 26 },
        { name: 'Unemployment Insurance Fund (UIF)', type: 'percentage', value: 1 },
      ];
    case 'China':
      return [
        { name: 'Individual Income Tax (IIT)', type: 'percentage', value: 10 },
        { name: 'Basic Pension Insurance', type: 'percentage', value: 8 },
        { name: 'Basic Medical Insurance', type: 'percentage', value: 2 },
        { name: 'Unemployment Insurance', type: 'percentage', value: 0.5 },
        { name: 'Housing Provident Fund', type: 'percentage', value: 7 },
      ];
    case 'Hong Kong':
      return [
        { name: 'Salaries Tax', type: 'percentage', value: 15 },
        { name: 'Mandatory Provident Fund (MPF)', type: 'percentage', value: 5 },
      ];
    case 'Indonesia':
      return [
        { name: 'Pajak Penghasilan (PPh 21)', type: 'percentage', value: 15 },
        { name: 'BPJS Kesehatan (Health Insurance)', type: 'percentage', value: 1 },
        { name: 'BPJS Ketenagakerjaan (Pension/JHT)', type: 'percentage', value: 2 },
      ];
    case 'Malaysia':
      return [
        { name: 'Monthly Tax Deduction (MTD/PCB)', type: 'percentage', value: 10 },
        { name: 'Employees Provident Fund (EPF)', type: 'percentage', value: 11 },
        { name: 'Social Security Organization (SOCSO)', type: 'percentage', value: 0.5 },
      ];
    case 'South Korea':
      return [
        { name: 'National Income Tax', type: 'percentage', value: 15 },
        { name: 'Local Income Tax', type: 'percentage', value: 1.5 },
        { name: 'National Pension', type: 'percentage', value: 4.5 },
        { name: 'National Health Insurance', type: 'percentage', value: 3.545 },
      ];
    case 'Taiwan':
      return [
        { name: 'Individual Income Tax', type: 'percentage', value: 12 },
        { name: 'Labor Insurance (LI)', type: 'percentage', value: 2.4 },
        { name: 'National Health Insurance (NHI)', type: 'percentage', value: 1.56 },
      ];
    case 'Thailand':
      return [
        { name: 'Personal Income Tax (PIT)', type: 'percentage', value: 10 },
        { name: 'Social Security Fund (SSF)', type: 'percentage', value: 5 },
      ];
    case 'Vietnam':
      return [
        { name: 'Personal Income Tax (PIT)', type: 'percentage', value: 10 },
        { name: 'Social Insurance (SI)', type: 'percentage', value: 8 },
        { name: 'Health Insurance (HI)', type: 'percentage', value: 1.5 },
        { name: 'Unemployment Insurance (UI)', type: 'percentage', value: 1 },
      ];
    default:
      return [
        { name: 'Estimated Income Tax', type: 'percentage', value: 15 },
      ];
  }
};
