export type BenefitItem = {
  mainGroup?: string;
  subBenefit?: string | null;

  limit?: number | null;
  limitUnit?: string | null;

  combinedSub?: number | null;
  combinedSubUnit?: string | null;

  combinedSubDay?: number | null;
  combinedSubDayUnit?: string | null;

  combined?: number | null;
  combinedUnit?: string | null;
};


export type ClaimBenefitItem = {
  mainGroup?: string;
  subBenefit?: string | null;

  limit?: number | null;
  limitUnit?: string | null;

  combinedSub?: number | null;
  combinedSubUnit?: string | null;

  combinedSubDay?: number | null;
  combinedSubDayUnit?: string | null;

  combined?: number | null;
  combinedUnit?: string | null;

  usage?: number | null;
  usageUnit?: string | null;

  remaining?: number | null;
  remainingUnit?: string | null;  

  combinedSubRemaining?: number | null;
  combinedSubRemainingUnit?: string | null; 

  combinedSubDayRemaining?: number | null;
  combinedSubDayRemainingUnit?: string | null;      

  combinedRemaining?: number | null;
  combinedRemainingUnit?: string | null;
};
