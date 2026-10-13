import { expect, test, type Page } from '@playwright/test'

/** A tiny placeholder image so tests never depend on the real Dog CEO API. */
const PIXEL = Buffer.from(
  '<svg xmlns="http://www.w3.org/2000/svg" width="4" height="3"><rect width="4" height="3" fill="#c98b4a"/></svg>',
)

async function mockDogApi(page: Page) {
  await page.route('https://dog.ceo/api/breeds/list/all', (route) =>
    route.fulfill({ json: { status: 'success', message: { akita: [], shepherd: ['australian'] } } }),
  )
  await page.route('https://dog.ceo/api/breed/**/images/random', (route) =>
    route.fulfill({ json: { status: 'success', message: 'https://images.test/dog.svg' } }),
  )
  await page.route('https://images.test/**', (route) =>
    route.fulfill({ body: PIXEL, contentType: 'image/svg+xml' }),
  )
}

/** Pins the A/B group before the app assigns one at random. */
async function startAs(page: Page, group: 'A' | 'B') {
  await mockDogApi(page)
  await page.addInitScript((g) => {
    if (!sessionStorage.getItem('e2e-init')) {
      localStorage.clear()
      localStorage.setItem('pet-meal-planner.ab-group', g)
      sessionStorage.setItem('e2e-init', '1')
    }
  }, group)
  await page.goto('./')
  await page.getByRole('link', { name: 'Start the questionnaire' }).click()
}

async function answerCommonSteps(page: Page) {
  await page.getByLabel('Breed').selectOption({ label: 'Australian Shepherd' })
  await expect(page.getByRole('img', { name: 'A Australian Shepherd' })).toBeVisible()
  await page.getByRole('button', { name: 'Continue' }).click()

  await expect(page.getByRole('heading', { name: "What's your Australian Shepherd's name?" })).toBeVisible()
  await page.getByLabel('Name').fill('Luna')
  await page.getByRole('button', { name: 'Continue' }).click()

  await page.getByLabel('Age').fill('3')
  await page.getByRole('button', { name: 'Continue' }).click()

  await page.getByLabel('Weight').fill('18,5')
  await page.getByRole('button', { name: 'Continue' }).click()

  await page.getByRole('radio', { name: /Stay in shape/ }).check()
  await page.getByRole('button', { name: 'Continue' }).click()

  await page.getByRole('radio', { name: /Greedy/ }).check()
  await page.getByRole('button', { name: 'Continue' }).click()
}

test('group A answers the activity question and submits', async ({ page }) => {
  await startAs(page, 'A')
  await answerCommonSteps(page)

  await expect(page.getByRole('heading', { name: 'How active is Luna?' })).toBeVisible()
  await page.getByRole('radio', { name: /High/ }).check()
  await page.getByRole('button', { name: 'Continue' }).click()

  const summary = page.locator('dl')
  await expect(summary).toContainText('Australian Shepherd')
  await expect(summary).toContainText('18.5 kg')
  await expect(summary).toContainText('Activity')
  await expect(page.getByText('Step 8 of 8')).toBeVisible()

  await page.getByRole('button', { name: 'Get the plan' }).click()
  await expect(page.getByTestId('success-message')).toContainText("Luna's plan is on its way.")

  const events = await page.evaluate(() => window.dataLayer?.map((e) => e.event))
  expect(events).toContain('form_completed')
})

test('group B skips the activity question', async ({ page }) => {
  await startAs(page, 'B')
  await answerCommonSteps(page)

  await expect(page.getByRole('heading', { name: "Here's Luna's profile" })).toBeVisible()
  await expect(page.locator('dl')).not.toContainText('Activity')
  await expect(page.getByText('Step 7 of 7')).toBeVisible()
})

test('shows errors instead of moving on with invalid answers', async ({ page }) => {
  await startAs(page, 'A')
  await page.getByRole('button', { name: 'Continue' }).click()
  await expect(page.getByText('Choose a breed to continue.')).toBeVisible()

  await page.getByLabel('Breed').selectOption({ label: 'Akita' })
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.getByLabel('Name').fill('Kira')
  await page.getByRole('button', { name: 'Continue' }).click()

  await page.getByLabel('Age').fill('45')
  await page.getByRole('button', { name: 'Continue' }).click()
  await expect(page.getByLabel('Age')).toHaveAttribute('aria-invalid', 'true')
  await expect(page.getByText('Enter a whole number from 0 to 30.')).toBeVisible()
})

test('keeps progress after a reload and lets the user go back', async ({ page }) => {
  await startAs(page, 'A')
  await page.getByLabel('Breed').selectOption({ label: 'Akita' })
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.getByLabel('Name').fill('Kira')
  await page.getByRole('button', { name: 'Continue' }).click()

  await page.reload()
  await expect(page.getByRole('heading', { name: 'How old is Kira?' })).toBeVisible()

  await page.getByRole('button', { name: 'Back' }).click()
  await expect(page.getByLabel('Name')).toHaveValue('Kira')
})
