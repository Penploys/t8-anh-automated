export enum LimitUnit {
  AMOUNT_PER_DAY = 'AMOUNT_PER_DAY',
  DAY_PER_DISABILITY = 'DAY_PER_DISABILITY',
  AMOUNT_PER_DISABILITY = 'AMOUNT_PER_DISABILITY',
  VISIT_PER_YEAR = 'VISIT_PER_YEAR',
  AMOUNT_PER_VISIT = 'AMOUNT_PER_VISIT',
  VISIT_PER_DAY = 'VISIT_PER_DAY',
  AMOUNT_PER_YEAR = 'AMOUNT_PER_YEAR',
  PERCENTAGE = 'PERCENTAGE',
  DAY_PER_YEAR = 'DAY_PER_YEAR',
}

export const LimitUnitTextMap: Record<LimitUnit, string> = {
  [LimitUnit.AMOUNT_PER_DAY]: 'THB per day',
  [LimitUnit.DAY_PER_DISABILITY]: 'Day per disability',
  [LimitUnit.AMOUNT_PER_DISABILITY]: 'THB per disability',
  [LimitUnit.VISIT_PER_YEAR]: 'Visit per year',  
  [LimitUnit.AMOUNT_PER_VISIT]: 'THB per visit', 
  [LimitUnit.VISIT_PER_DAY]: 'Visit per day',
  [LimitUnit.AMOUNT_PER_YEAR]: 'THB per year',
  [LimitUnit.DAY_PER_YEAR]: 'Day per year',    
  [LimitUnit.PERCENTAGE]: ':', 
};