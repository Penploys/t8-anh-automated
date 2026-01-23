import { LimitUnit, LimitUnitTextMap } from '../constants/limit-unit';

export const detectLimitUnit = (text: string): LimitUnit | undefined => {
  return (Object.entries(LimitUnitTextMap) as [LimitUnit, string][])
    .find(([, uiText]) => text.includes(uiText))?.[0];
};

type ParsedLimit = {
  limit_amount?: string;
  amount_unit?: LimitUnit;
  limit_day?: string;
  day_unit?: LimitUnit;
};

export const parseLimitText = (text: string): ParsedLimit => {
  const result: ParsedLimit = {};

  // amount
  const amountMatch = text.match(/([\d,]+\.\d{2})/);
  if (amountMatch) {
    result.limit_amount = amountMatch[1];
    result.amount_unit = detectLimitUnit(text);
  }

  // day
  const dayMatch = text.match(/(\d+)\s+Day/i);
  if (dayMatch) {
    result.limit_amount = dayMatch[1];
    result.amount_unit = detectLimitUnit(text);
  }

  return result;
};
