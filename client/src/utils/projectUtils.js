const defaultIdGenerator = () => {
  if (typeof globalThis.crypto !== 'undefined' && typeof globalThis.crypto.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }
  return `project-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const defaultTimestampFactory = () => new Date().toISOString();

export const sanitizeFormData = (formData = {}) => ({
  name: (formData.name ?? '').trim(),
  price: Number(formData.price ?? 0),
  stripeLink: (formData.stripeLink ?? '').trim(),
  description: (formData.description ?? '').trim(),
  status: formData.status ?? 'draft'
});

export const isValidProjectForm = (formData = {}) => {
  const name = (formData.name ?? '').trim();
  const priceInput = formData.price ?? '';
  const priceAsString = typeof priceInput === 'string' ? priceInput : String(priceInput);
  const trimmedPrice = priceAsString.trim();
  const priceValue = Number(trimmedPrice);
  const hasPrice = trimmedPrice !== '' && !Number.isNaN(priceValue);
  return Boolean(name) && hasPrice;
};

export const createProjectFromForm = (
  formData,
  { idGenerator = defaultIdGenerator, timestampFactory = defaultTimestampFactory } = {}
) => {
  const sanitized = sanitizeFormData(formData);
  return {
    id: idGenerator(),
    ...sanitized,
    createdAt: timestampFactory()
  };
};

export const getLaunchMetrics = (projects = []) => {
  return projects.reduce(
    (acc, project) => {
      const price = Number(project.price ?? 0);
      acc.totalValue += Number.isFinite(price) ? price : 0;
      if (project.status === 'live') acc.liveProjects += 1;
      if (project.status === 'test') acc.testProjects += 1;
      return acc;
    },
    { totalValue: 0, liveProjects: 0, testProjects: 0 }
  );
};

export { defaultIdGenerator };
