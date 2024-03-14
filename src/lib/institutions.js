import { AUTH_FLOWS, AUTH_STEPS } from "./constants";

export const institutionsCounts = (items) =>
  [
    ...items
      .filter(({ institution }) => institution)
      .reduce((institutions, item) => {
        const institutionCounts = institutions.get(item.institution) || {
          id: item.institution,
          total: 0,
          completed: 0,
        };
        institutionCounts.total++;
        if (
          item.steps.includes(AUTH_STEPS.EXECUTED) ||
          (item.flow === AUTH_FLOWS.EMBEDDED &&
            item.steps.includes(AUTH_STEPS.AUTHORISATION_UPDATED))
        ) {
          institutionCounts.completed++;
        }
        institutions.set(item.institution, institutionCounts);
        return institutions;
      }, new Map())
      .values(),
  ].sort((a, b) => b.total - a.total);
