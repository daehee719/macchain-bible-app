import { test, expect } from '@playwright/test';

test.describe('MacChain Frontend', () => {
  test('should load the main page', async ({ page }) => {
    await page.goto('/');
    
    // Check if the page loads
    await expect(page).toHaveTitle(/MacChain/);
    
    // Check if main content is visible
    await expect(page.locator('body')).toBeVisible();
  });

  test('should navigate to different pages', async ({ page }) => {
    await page.goto('/');
    
    // Test navigation to reading plan
    await page.click('a[href="/reading-plan"]');
    await expect(page).toHaveURL(/reading-plan/);
    
    // Test navigation to login
    await page.click('a[href="/login"]');
    await expect(page).toHaveURL(/login/);
  });

  test('should handle protected routes', async ({ page }) => {
    // Try to access protected route without login
    await page.goto('/ai-analysis');
    
    // Should redirect to login or show login form
    const loginForm = page.locator('form');
    const isLoginPage = await page.url().includes('/login');
    const isFormVisible = await loginForm.isVisible();
    
    expect(isFormVisible || isLoginPage).toBeTruthy();
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone size
    await page.goto('/');
    
    // Check if content is still visible on mobile
    await expect(page.locator('body')).toBeVisible();
    
    // Check if navigation works on mobile
    await page.click('a[href="/reading-plan"]');
    await expect(page).toHaveURL(/reading-plan/);
  });
});
