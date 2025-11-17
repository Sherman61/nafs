import { useEffect, useMemo, useState } from 'react';
import {
  createProjectFromForm,
  getLaunchMetrics,
  isValidProjectForm
} from '../utils/projectUtils.js';

const STORAGE_KEY = 'medusah-admin-projects';
const defaultForm = {
  name: '',
  price: '',
  stripeLink: '',
  description: '',
  status: 'draft'
};

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

const getStoredProjects = () => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to read stored admin projects', error);
    return [];
  }
};

export default function AdminDashboard({ navigate }) {
  const [formData, setFormData] = useState(defaultForm);
  const [projects, setProjects] = useState(() => getStoredProjects());
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (error) {
      console.error('Failed to persist admin projects', error);
    }
  }, [projects]);

  const metrics = useMemo(() => getLaunchMetrics(projects), [projects]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setFeedback(null);
    if (!isValidProjectForm(formData)) {
      setFeedback({ type: 'error', message: 'Project name and price are required.' });
      return;
    }

    const newProject = createProjectFromForm(formData);

    setProjects((prev) => [newProject, ...prev]);
    setFormData(defaultForm);
    setFeedback({
      type: 'success',
      message: 'Project staged locally. Connect the API to persist it in your Medusa store.'
    });
  };

  return (
    <div className="min-h-screen bg-brand-light px-4 py-10 text-brand-dark">
      <div className="mx-auto flex max-w-5xl flex-col gap-10">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-dark/60">Admin</p>
            <h1 className="text-4xl font-display">Product launch control</h1>
            <p className="mt-2 text-brand-dark/70">
              Stage new ritual projects, price them, and drop a Stripe checkout URL before syncing with
              the production API.
            </p>
          </div>
          <button
            type="button"
            onClick={() => (navigate ? navigate('/') : (window.location.href = '/'))}
            className="inline-flex items-center justify-center rounded-full border border-brand-dark/20 px-5 py-2 text-sm font-semibold text-brand-dark"
          >
            ⬅ Back to storefront
          </button>
        </header>

        <section className="grid gap-6 rounded-[32px] bg-white p-6 shadow-sm md:grid-cols-3">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-dark/60">Total staged</p>
            <p className="mt-2 text-3xl font-display">
              {currencyFormatter.format(metrics.totalValue)}
            </p>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-dark/60">Live-ready</p>
            <p className="mt-2 text-3xl font-display">{metrics.liveProjects}</p>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-dark/60">Test mode</p>
            <p className="mt-2 text-3xl font-display">{metrics.testProjects}</p>
          </div>
        </section>

        <section className="grid gap-8 rounded-[32px] bg-white p-6 shadow-sm md:grid-cols-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold" htmlFor="name">
                Project name*
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 w-full rounded-2xl border border-brand-dark/20 px-4 py-2"
                placeholder="Moon Oil Mini"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-semibold" htmlFor="price">
                  Price (USD)*
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-2xl border border-brand-dark/20 px-4 py-2"
                  placeholder="129"
                />
              </div>
              <div>
                <label className="text-sm font-semibold" htmlFor="status">
                  Launch status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-2xl border border-brand-dark/20 px-4 py-2"
                >
                  <option value="draft">Draft</option>
                  <option value="test">Test</option>
                  <option value="live">Live</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold" htmlFor="stripeLink">
                Stripe checkout URL
              </label>
              <input
                id="stripeLink"
                name="stripeLink"
                type="url"
                value={formData.stripeLink}
                onChange={handleChange}
                className="mt-1 w-full rounded-2xl border border-brand-dark/20 px-4 py-2"
                placeholder="https://buy.stripe.com/..."
              />
            </div>
            <div>
              <label className="text-sm font-semibold" htmlFor="description">
                Internal notes
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="mt-1 w-full rounded-2xl border border-brand-dark/20 px-4 py-2"
                placeholder="What makes this launch special?"
              />
            </div>
            {feedback && (
              <p
                role="status"
                className={`rounded-2xl px-4 py-2 text-sm ${
                  feedback.type === 'error'
                    ? 'bg-red-50 text-red-700'
                    : 'bg-emerald-50 text-emerald-700'
                }`}
              >
                {feedback.message}
              </p>
            )}
            <button
              type="submit"
              className="w-full rounded-full bg-brand-dark px-6 py-3 text-white transition hover:bg-brand-dark/80"
            >
              Save project
            </button>
          </form>

          <div className="space-y-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-brand-dark/60">Launch queue</p>
              <h2 className="text-2xl font-display">{projects.length || 'No'} staged projects</h2>
            </div>
            {projects.length === 0 ? (
              <p className="text-brand-dark/70">
                Your queue is empty. Add a project on the left to simulate how you would prep a Medusa
                product before syncing it to the backend.
              </p>
            ) : (
              <ul className="space-y-3">
                {projects.map((project) => (
                  <li
                    key={project.id}
                    className="rounded-2xl border border-brand-dark/10 p-4"
                    data-testid="project-row"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-lg font-semibold">{project.name}</p>
                        <p className="text-sm text-brand-dark/70">{project.description || '—'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-display">
                          {currencyFormatter.format(Number(project.price || 0))}
                        </p>
                        <span className="text-xs uppercase tracking-wide text-brand-dark/60">
                          {project.status}
                        </span>
                      </div>
                    </div>
                    {project.stripeLink && (
                      <a
                        href={project.stripeLink}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-block text-sm font-semibold text-brand-dark underline"
                      >
                        Stripe checkout
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
