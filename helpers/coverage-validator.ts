
import { Locator, expect } from '@playwright/test';
import type { BenefitItem, ClaimBenefitItem } from '../types/benefit-item';

export const validateBenefitSection = (
  policyItems: BenefitItem[] = [],
  coverageItems: any[] = []
) => {
  const normalize = (v: string) => v.trim().toLowerCase();
  const toDash = (v: any) => v == null ? '-' : v;
  const formatNumber = (value: number | string | null | undefined) => {
    if (value == null || value === '') return '-';
    const num = typeof value === 'string' ? Number(value) : value;
    if (Number.isNaN(num)) return String(value);
    return num.toLocaleString('en-US');
  };
  expect(policyItems.length).toBe(coverageItems.length);

  for (let i = 0; i < policyItems.length; i++) {
    const policy = policyItems[i];
    const coverage = coverageItems[i];

    // ---------- Main Group ----------
    expect(normalize(policy.mainGroup ?? ''))
      .toBe(normalize(coverage.mainGroup));

    // ---------- Sub Benefit ----------
    expect(normalize(toDash(policy.subBenefit)))
      .toBe(normalize(coverage.subBenefit));

    // ---------- Limit ----------
    if (policy.limit != null) {
      expect(coverage.limit)
        .toContain(formatNumber(policy.limit));
    }

    // ---------- Limit Unit ----------
    if (policy.limitUnit) {
      expect(coverage.limit)
        .toContain(policy.limitUnit);
    }

    // ---------- Combined Sub ----------
    if (policy.combinedSub != null) {
      expect(coverage.combinedSub)
        .toContain(formatNumber(policy.combinedSub));
    }

    if (policy.combinedSubUnit) {
      expect(coverage.combinedSub)
        .toContain(policy.combinedSubUnit);
    }

    // ---------- Combined Sub Day ----------
    if (policy.combinedSubDay && policy.combinedSubDay !== 0) {
      expect(coverage.combinedSub)
        .toContain(formatNumber(policy.combinedSubDay));
    }

    if (policy.combinedSubDayUnit) {
      expect(coverage.combinedSub)
        .toContain(policy.combinedSubDayUnit);
    }

    // ---------- Combined ----------
    if (policy.combined != null) {
      expect(coverage.combined)
        .toContain(formatNumber(policy.combined));
    }

    if (policy.combinedUnit) {
      expect(coverage.combined)
        .toContain(policy.combinedUnit);
    }
  }
};

export const validateHospitalBenefitSection = (
  policyItems: any[] = [],
  coverageItems: any[] = []
) => {
  const normalize = (v: string) => v.trim().toLowerCase();
  const toDash = (v: any) => v == null ? '-' : v;
  const formatNumber = (value: number | string | null | undefined) => {
    if (value == null || value === '') return '-';
    const num = typeof value === 'string' ? Number(value) : value;
    if (Number.isNaN(num)) return String(value);
    return num.toLocaleString('en-US');
  };
  expect(policyItems.length).toBe(coverageItems.length);

  for (let i = 0; i < policyItems.length; i++) {
    const policy = policyItems[i];
    const coverage = coverageItems[i];

    // ---------- Main Group ----------
    expect(normalize(policy.mainGroup ?? ''))
      .toBe(normalize(coverage.mainGroup));

    // ---------- Sub Benefit ----------
    expect(normalize(toDash(policy.subBenefit)))
      .toBe(normalize(coverage.subBenefit));

    // ---------- Limit ----------
    if (policy.limit != null) {
      expect(coverage.limit)
        .toContain(formatNumber(policy.limit));
    }

    // ---------- Limit Unit ----------
    if (policy.limitUnit) {
      expect(coverage.limit)
        .toContain(policy.limitUnit);
    }
  }
};

export const validateClaimBenefitSection = (
  policyItems: any[] = [],
  coverageItems: any[] = []
) => {
  const normalize = (v: string) => v.trim().toLowerCase();
  const toDash = (v: any) => v == null ? '-' : v;
  const formatNumber = (value: number | string | null | undefined) => {
    if (value == null || value === '') return '-';
    const num = typeof value === 'string' ? Number(value) : value;
    if (Number.isNaN(num)) return String(value);
    return num.toLocaleString('en-US');
  };
  expect(policyItems.length).toBe(coverageItems.length);

  for (let i = 0; i < policyItems.length; i++) {
    const policy = policyItems[i];
    const coverage = coverageItems[i];

    // ---------- Main Group ----------
    expect(normalize(policy.mainGroup ?? ''))
      .toBe(normalize(coverage.mainGroup));

    // ---------- Sub Benefit ----------
    expect(normalize(toDash(policy.subBenefit)))
      .toBe(normalize(coverage.subBenefit));

    // ---------- Limit ----------
    if (policy.limit != null) {
      expect(coverage.limit)
        .toContain(formatNumber(policy.limit));
    }

    // ---------- Limit Unit ----------
    if (policy.limitUnit) {
      expect(coverage.limit)
        .toContain(policy.limitUnit);
    }

    // ---------- Usage ----------
    if (policy.usage != null) {
      expect(coverage.usage)
        .toContain(formatNumber(policy.usage));
    }

    // ---------- Remaining ----------
    if (policy.remaining != null) {
      expect(coverage.remaining)
        .toContain(formatNumber(policy.remaining));
    }

    // ---------- Combined Sub ----------
    if (policy.combinedSub != null) {
      expect(coverage.combinedSub)
        .toContain(formatNumber(policy.combinedSub));
    }

    if (policy.combinedSubUnit) {
      expect(coverage.combinedSub)
        .toContain(policy.combinedSubUnit);
    }

    // ---------- Combined Sub Remaining ----------
    if (policy.combinedSubRemaining != null) {
      expect(coverage.combinedSubRemaining)
        .toContain(formatNumber(policy.combinedSubRemaining));
    }

    if (policy.combinedSubRemainingUnit) {
      expect(coverage.combinedSubRemaining)
        .toContain(policy.combinedSubRemainingUnit);
    }    

    // ---------- Combined Sub Day ----------
    if (policy.combinedSubDay && policy.combinedSubDay !== 0) {
      expect(coverage.combinedSub)
        .toContain(formatNumber(policy.combinedSubDay));
    }

    if (policy.combinedSubDayUnit) {
      expect(coverage.combinedSub)
        .toContain(policy.combinedSubDayUnit);
    }

    // ---------- Combined Sub Day Remaining ----------
    if (policy.combinedSubDayRemaining && policy.combinedSubDayRemaining !== 0) {
      expect(coverage.combinedSubRemaining)
        .toContain(formatNumber(policy.combinedSubDayRemaining));
    }

    if (policy.combinedSubDayRemainingUnit) {
      expect(coverage.combinedSubRemaining)
        .toContain(policy.combinedSubDayRemainingUnit);
    }    

    // ---------- Combined ----------
    if (policy.combined != null) {
      expect(coverage.combined)
        .toContain(formatNumber(policy.combined));
    }

    if (policy.combinedUnit) {
      expect(coverage.combined)
        .toContain(policy.combinedUnit);
    }

    // ---------- Combined Remaining----------
    if (policy.combinedRemaining != null) {
      expect(coverage.combinedRemaining)
        .toContain(formatNumber(policy.combinedRemaining));
    }

    if (policy.combinedRemainingUnit) {
      expect(coverage.combinedRemaining)
        .toContain(policy.combinedRemainingUnit);
    }
  }
};

export const validateHospitalClaimBenefitSection = (
  policyItems: any[] = [],
  coverageItems: any[] = []
) => {
  const normalize = (v: string) => v.trim().toLowerCase();
  const toDash = (v: any) => v == null ? '-' : v;
  const formatNumber = (value: number | string | null | undefined) => {
    if (value == null || value === '') return '-';
    const num = typeof value === 'string' ? Number(value) : value;
    if (Number.isNaN(num)) return String(value);
    return num.toLocaleString('en-US');
  };
  expect(policyItems.length).toBe(coverageItems.length);

  for (let i = 0; i < policyItems.length; i++) {
    const policy = policyItems[i];
    const coverage = coverageItems[i];

    // ---------- Main Group ----------
    expect(normalize(policy.mainGroup ?? ''))
      .toBe(normalize(coverage.mainGroup));

    // ---------- Sub Benefit ----------
    expect(normalize(toDash(policy.subBenefit)))
      .toBe(normalize(coverage.subBenefit));

    // ---------- Limit ----------
    if (policy.limit != null) {
      expect(coverage.limit)
        .toContain(formatNumber(policy.limit));
    }

    // ---------- Limit Unit ----------
    if (policy.limitUnit) {
      expect(coverage.limit)
        .toContain(policy.limitUnit);
    }

    // ---------- Usage ----------
    if (policy.usage != null) {
      expect(coverage.usage)
        .toContain(formatNumber(policy.usage));
    }

    // ---------- Remaining ----------
    if (policy.remaining != null) {
      expect(coverage.remaining)
        .toContain(formatNumber(policy.remaining));
    }
  }
};

export const validateClaimBenefitNotUsageRemainingSection = (
  policyItems: any[] = [],
  coverageItems: any[] = []
) => {
  const normalize = (v: string) => v.trim().toLowerCase();
  const toDash = (v: any) => v == null ? '-' : v;
  const formatNumber = (value: number | string | null | undefined) => {
    if (value == null || value === '') return '-';
    const num = typeof value === 'string' ? Number(value) : value;
    if (Number.isNaN(num)) return String(value);
    return num.toLocaleString('en-US');
  };
  expect(policyItems.length).toBe(coverageItems.length);

  for (let i = 0; i < policyItems.length; i++) {
    const policy = policyItems[i];
    const coverage = coverageItems[i];

    console.log(policy.subBenefit);

    // ---------- Main Group ----------
    expect(normalize(policy.mainGroup ?? ''))
      .toBe(normalize(coverage.mainGroup));

    // ---------- Sub Benefit ----------
    expect(normalize(toDash(policy.subBenefit)))
      .toBe(normalize(coverage.subBenefit));

    // ---------- Limit ----------
    if (policy.limit != null) {
      expect(coverage.limit)
        .toContain(formatNumber(policy.limit));
    }

    // ---------- Limit Unit ----------
    if (policy.limitUnit) {
      expect(coverage.limit)
        .toContain(policy.limitUnit);
    }

    // ---------- Combined Sub ----------
    if (policy.combinedSub != null) {
      expect(coverage.combinedSub)
        .toContain(formatNumber(policy.combinedSub));
    }

    if (policy.combinedSubUnit) {
      expect(coverage.combinedSub)
        .toContain(policy.combinedSubUnit);
    }

    // ---------- Combined Sub Day ----------
    if (policy.combinedSubDay && policy.combinedSubDay !== 0) {
      expect(coverage.combinedSub)
        .toContain(formatNumber(policy.combinedSubDay));
    }

    if (policy.combinedSubDayUnit) {
      expect(coverage.combinedSub)
        .toContain(policy.combinedSubDayUnit);
    }

    // ---------- Combined ----------
    if (policy.combined != null) {
      expect(coverage.combined)
        .toContain(formatNumber(policy.combined));
    }

    if (policy.combinedUnit) {
      expect(coverage.combined)
        .toContain(policy.combinedUnit);
    }
  }
};


export const validateHospitalClaimCoverageNotUsageRemainingDetail = (
  policyItems: any[] = [],
  coverageItems: any[] = []
) => {
  const normalize = (v: string) => v.trim().toLowerCase();
  const toDash = (v: any) => v == null ? '-' : v;
  const formatNumber = (value: number | string | null | undefined) => {
    if (value == null || value === '') return '-';
    const num = typeof value === 'string' ? Number(value) : value;
    if (Number.isNaN(num)) return String(value);
    return num.toLocaleString('en-US');
  };
  expect(policyItems.length).toBe(coverageItems.length);

  for (let i = 0; i < policyItems.length; i++) {
    const policy = policyItems[i];
    const coverage = coverageItems[i];

    // ---------- Main Group ----------
    expect(normalize(policy.mainGroup ?? ''))
      .toBe(normalize(coverage.mainGroup));

    // ---------- Sub Benefit ----------
    expect(normalize(toDash(policy.subBenefit)))
      .toBe(normalize(coverage.subBenefit));

    // ---------- Limit ----------
    if (policy.limit != null) {
      expect(coverage.limit)
        .toContain(formatNumber(policy.limit));
    }

    // ---------- Limit Unit ----------
    if (policy.limitUnit) {
      expect(coverage.limit)
        .toContain(policy.limitUnit);
    }

  }
};