// const timeout = 5000;

// describe(
//   '/ (Home Page)',
//   () => {
//     let page;
//     beforeAll(async () => {
//       page = await globalThis.__BROWSER_GLOBAL__
//       await page.goto('https://google.com');
//     }, timeout);

//     it('should load without error', async () => {
//       const text = await page.evaluate(() => document.body.textContent);
//       expect(text).toContain('google');
//     });
//   },
//   timeout
// );
describe('Google', () => {
  beforeAll(async () => {
    await page.goto('https://google.com');
  });

  it('should be titled "Google"', async () => {
    await expect(page.title()).resolves.toMatch('Google');
  });
});