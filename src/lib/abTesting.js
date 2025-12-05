export const assignVariant = (experiment) => {
  if (!experiment || !experiment.variants || experiment.variants.length === 0)
    return null;

  const totalWeight = experiment.variants.reduce(
    (acc, v) => acc + (v.weight || 0),
    0
  );
  let random = Math.random() * totalWeight;

  for (const variant of experiment.variants) {
    if (random < variant.weight) {
      return variant.name;
    }
    random -= variant.weight;
  }

  return experiment.variants[0].name; // Fallback
};

export const getExperimentAssignment = (experimentId) => {
  if (typeof window === "undefined") return null;
  const storageKey = `ab_exp_${experimentId}`;
  return localStorage.getItem(storageKey);
};

export const setExperimentAssignment = (experimentId, variant) => {
  if (typeof window === "undefined") return;
  const storageKey = `ab_exp_${experimentId}`;
  localStorage.setItem(storageKey, variant);
};

export const trackExperiment = async (
  experimentId,
  variant,
  type = "impression"
) => {
  try {
    await fetch("/api/admin/experiments/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ experimentId, variant, type }),
    });
  } catch (error) {
    console.error("Failed to track experiment:", error);
  }
};
