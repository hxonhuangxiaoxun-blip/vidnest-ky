// Only automatic focus refreshes are limited. Explicit actions still start a
// fresh request, and failures remain eligible for an immediate focus retry.
export function createFocusRefreshGate(
  now: () => number = () => performance.now(),
) {
  let generation = 0;
  let pending = false;
  let lastSuccess: number | null = null;
  return {
    requestFocus(visibility: string) {
      if (
        visibility === "hidden" ||
        pending ||
        (lastSuccess !== null && now() - lastSuccess < 5000)
      )
        return false;
      pending = true;
      return true;
    },
    begin() {
      const current = ++generation;
      pending = true;
      let settled = false;
      return (success: boolean) => {
        if (settled || current !== generation) return;
        settled = true;
        pending = false;
        lastSuccess = success ? now() : null;
      };
    },
  };
}
