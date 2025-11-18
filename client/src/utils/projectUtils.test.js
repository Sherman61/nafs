import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createProjectFromForm,
  getLaunchMetrics,
  isValidProjectForm,
  sanitizeFormData
} from './projectUtils.js';

test('createProjectFromForm trims values and adds metadata', () => {
  const project = createProjectFromForm(
    {
      name: '  Moon Oil  ',
      price: '129',
      stripeLink: ' https://stripe.test/pay ',
      description: ' Limited batch ',
      status: 'live'
    },
    {
      idGenerator: () => 'id-123',
      timestampFactory: () => '2024-01-01T00:00:00.000Z'
    }
  );

  assert.deepStrictEqual(project, {
    id: 'id-123',
    name: 'Moon Oil',
    price: 129,
    stripeLink: 'https://stripe.test/pay',
    description: 'Limited batch',
    status: 'live',
    createdAt: '2024-01-01T00:00:00.000Z'
  });
});

test('getLaunchMetrics sums revenue and status counts', () => {
  const metrics = getLaunchMetrics([
    { price: 129, status: 'live' },
    { price: '49', status: 'test' },
    { price: 0, status: 'draft' },
    { price: '150', status: 'live' }
  ]);

  assert.equal(metrics.totalValue, 328);
  assert.equal(metrics.liveProjects, 2);
  assert.equal(metrics.testProjects, 1);
});

test('isValidProjectForm ensures both name and price', () => {
  assert.equal(isValidProjectForm({ name: 'Moon Oil', price: '10' }), true);
  assert.equal(isValidProjectForm({ name: '   ', price: '10' }), false);
  assert.equal(isValidProjectForm({ name: 'Moon Oil', price: '' }), false);
  assert.equal(isValidProjectForm({ name: 'Moon Oil', price: 'abc' }), false);
});

test('sanitizeFormData normalizes defaults', () => {
  assert.deepStrictEqual(sanitizeFormData({}), {
    name: '',
    price: 0,
    stripeLink: '',
    description: '',
    status: 'draft'
  });
});
