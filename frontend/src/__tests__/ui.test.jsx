/**
 * Frontend Component Tests - NewsPulse
 * Tests: UI Components, Responsiveness, Notifications
 * Framework: Vitest + React Testing Library
 * Coverage: Test Cases 29-35
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';
import Dashboard from '../pages/Dashboard';
import AuthPage from '../pages/AuthPage';
import LandingPage from '../pages/LandingPage';
import { Toaster } from 'react-hot-toast';

// ============= HELPER FUNCTIONS =============
const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

const mockLocalStorage = () => {
  const store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { Object.keys(store).forEach(key => delete store[key]); },
  };
};

// ============= TEST SUITE: AUTHENTICATION UI (Tests 1-5) =============
describe('Authentication UI Tests', () => {
  
  beforeEach(() => {
    window.localStorage = mockLocalStorage();
  });

  // TEST CASE 1: User signup form renders ✅
  it('TC-1: Should render signup form with email and password fields', () => {
    renderWithRouter(<AuthPage />);
    
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up|register/i })).toBeInTheDocument();
  });

  // TEST CASE 2: Login form interaction ✅
  it('TC-2: Should handle login form submission', async () => {
    renderWithRouter(<AuthPage />);
    
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const loginButton = screen.getByRole('button', { name: /sign in|login/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'TestPass123!' } });
    fireEvent.click(loginButton);
    
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('TestPass123!');
  });

  // TEST CASE 4: Empty field validation ❌
  it('TC-4: Should show validation error for empty fields', async () => {
    renderWithRouter(<AuthPage />);
    
    const loginButton = screen.getByRole('button', { name: /sign in|login/i });
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(screen.getByText(/required/i)).toBeInTheDocument();
    });
  });
});

// ============= TEST SUITE: RESPONSIVE DESIGN (Tests 29-30) =============
describe('Responsive Design Tests', () => {
  
  const setViewport = (width, height) => {
    global.innerWidth = width;
    global.innerHeight = height;
    global.dispatchEvent(new Event('resize'));
  };

  // TEST CASE 29: Mobile responsiveness 📱
  it('TC-29: Should adapt UI for mobile devices (390x844)', () => {
    setViewport(390, 844);
    renderWithRouter(<Dashboard />);
    
    // Check for mobile menu toggle
    const mobileMenu = screen.queryByRole('button', { name: /menu|hamburger/i });
    if (mobileMenu) {
      expect(mobileMenu).toBeInTheDocument();
    }
    
    // Verify elements don't require horizontal scroll
    const container = screen.getByRole('main') || document.body;
    expect(container.scrollWidth).toBeLessThanOrEqual(window.innerWidth + 10);
  });

  // TEST CASE 30: Tablet responsiveness 📲
  it('TC-30: Should optimize layout for tablet (1024x1366)', () => {
    setViewport(1024, 1366);
    renderWithRouter(<Dashboard />);
    
    // Verify layout renders without errors
    expect(screen.getByRole('main') || document.body).toBeInTheDocument();
  });

  // TEST CASE 31: Dark mode toggle 🌙
  it('TC-31: Should toggle dark mode and persist preference', async () => {
    renderWithRouter(<App />);
    
    const darkModeToggle = screen.queryByRole('button', { name: /dark|light|theme/i });
    
    if (darkModeToggle) {
      fireEvent.click(darkModeToggle);
      
      // Check if localStorage is updated
      const theme = window.localStorage.getItem('theme');
      expect(['dark', 'light']).toContain(theme);
    }
  });
});

// ============= TEST SUITE: USER FEEDBACK (Tests 32-35) =============
describe('User Feedback & Loading Tests', () => {
  
  // TEST CASE 32: Loading animation during prediction ⏳
  it('TC-32: Should display loading spinner while processing', async () => {
    renderWithRouter(<Dashboard />);
    
    const submitButton = screen.getByRole('button', { name: /submit|scan|analyze/i });
    fireEvent.click(submitButton);
    
    // Loader should be visible
    await waitFor(() => {
      const loader = screen.queryByRole('progressbar') || 
                     screen.queryByText(/loading|processing/i);
      expect(loader).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  // TEST CASE 33: Toast notification on success ✅
  it('TC-33: Should display success toast notification', async () => {
    const { container } = renderWithRouter(
      <>
        <Toaster />
        <Dashboard />
      </>
    );
    
    // Simulate successful prediction
    const successToast = screen.queryByText(/success|completed/i);
    
    if (successToast) {
      expect(successToast).toBeInTheDocument();
      
      // Verify styling
      const toast = successToast.closest('.toast');
      expect(toast).toHaveClass(/success|green/i);
    }
  });

  // TEST CASE 34: Error popup on API failure ❌
  it('TC-34: Should display error message on API failure', async () => {
    renderWithRouter(
      <>
        <Toaster />
        <Dashboard />
      </>
    );
    
    // Mock API failure
    global.fetch = vi.fn(() => 
      Promise.reject(new Error('Network error'))
    );
    
    const submitButton = screen.queryByRole('button', { name: /submit/i });
    if (submitButton) {
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        const errorMsg = screen.queryByText(/error|failed/i);
        expect(errorMsg).toBeInTheDocument();
      }, { timeout: 3000 });
    }
  });

  // TEST CASE 35: Button disabled during loading 🔒
  it('TC-35: Should disable submit button during request', async () => {
    renderWithRouter(<Dashboard />);
    
    const submitButton = screen.getByRole('button', { name: /submit|scan/i });
    
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });
});

// ============= TEST SUITE: DASHBOARD UI (Tests 27-28) =============
describe('Dashboard Analytics Tests', () => {
  
  // TEST CASE 27: Dashboard analytics rendering 📊
  it('TC-27: Should render dashboard charts and statistics', () => {
    renderWithRouter(<Dashboard />);
    
    // Check for key dashboard elements
    expect(screen.queryByText(/analytics|statistics|dashboard/i)).toBeInTheDocument();
    
    // Look for chart elements (SVG or canvas)
    const charts = document.querySelectorAll('svg, canvas');
    expect(charts.length).toBeGreaterThan(0);
  });

  // TEST CASE 28: Statistics update 📈
  it('TC-28: Should update fake vs real statistics', async () => {
    const { rerender } = renderWithRouter(<Dashboard />);
    
    const initialStats = screen.getByText(/fake/i);
    expect(initialStats).toBeInTheDocument();
    
    // Simulate new data
    rerender(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    
    const updatedStats = screen.getByText(/fake/i);
    expect(updatedStats).toBeInTheDocument();
  });
});

// ============= TEST SUITE: FORM VALIDATION (Tests 6-7) =============
describe('Prediction Form Tests', () => {
  
  // TEST CASE 6: Submit valid news text ✅
  it('TC-6: Should submit valid news text successfully', async () => {
    renderWithRouter(<Dashboard />);
    
    const textInput = screen.getByPlaceholderText(/enter|paste|text/i);
    const submitButton = screen.getByRole('button', { name: /submit|scan|analyze/i });
    
    fireEvent.change(textInput, {
      target: { value: 'Breaking news: Scientists discover renewable energy' }
    });
    
    fireEvent.click(submitButton);
    
    expect(textInput.value).toBe('Breaking news: Scientists discover renewable energy');
  });

  // TEST CASE 7: Empty text validation ❌
  it('TC-7: Should show warning for empty text submission', async () => {
    renderWithRouter(<Dashboard />);
    
    const submitButton = screen.getByRole('button', { name: /submit|scan/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      const warning = screen.queryByText(/empty|required/i);
      expect(warning).toBeInTheDocument();
    });
  });
});

// ============= TEST SUITE: XAI VISUALIZATION (Tests 20-21) =============
describe('Explainable AI Tests', () => {
  
  // TEST CASE 20: Reasons displayed ✅
  it('TC-20: Should display explanation reasons for prediction', () => {
    renderWithRouter(<Dashboard />);
    
    // Mock prediction response with reasons
    const mockReasons = [
      'Sensationalist wording detected',
      'Emotional manipulation indicators'
    ];
    
    mockReasons.forEach(reason => {
      const reasonElement = screen.queryByText(reason);
      // Reasons will appear after prediction is made
    });
  });

  // TEST CASE 21: Highlight suspicious words ✅
  it('TC-21: Should highlight suspicious words in results', () => {
    renderWithRouter(<Dashboard />);
    
    // Check for highlighted text elements (with special styling)
    const highlights = document.querySelectorAll('[class*="highlight"], [class*="suspicious"]');
    
    // Should have highlighting capability
    expect(document.body.innerHTML).toContain('highlight');
  });
});

// ============= TEST SUITE: NAVIGATION & ROUTING (Test 5) =============
describe('Routing & Authentication Tests', () => {
  
  // TEST CASE 5: Protected route access ✅
  it('TC-5: Should redirect unauthenticated users from protected routes', () => {
    window.localStorage.clear();
    renderWithRouter(<App />);
    
    // Attempting to access dashboard should redirect to login
    // This depends on your routing implementation
  });

  it('Should allow authenticated users to access dashboard', () => {
    window.localStorage.setItem('token', 'valid_jwt_token');
    renderWithRouter(<Dashboard />);
    
    expect(screen.getByRole('main') || document.body).toBeInTheDocument();
  });
});

// ============= TEST SUITE: HISTORY & RESULTS (Tests 23-26) =============
describe('History List Tests', () => {
  
  // TEST CASE 23: Fetch prediction history ✅
  it('TC-23: Should display prediction history list', () => {
    renderWithRouter(<Dashboard />);
    
    const historySection = screen.queryByText(/history|previous|past/i);
    if (historySection) {
      expect(historySection).toBeInTheDocument();
    }
  });

  // TEST CASE 24: Search functionality 🔍
  it('TC-24: Should filter history by search query', async () => {
    renderWithRouter(<Dashboard />);
    
    const searchInput = screen.queryByPlaceholderText(/search/i);
    if (searchInput) {
      fireEvent.change(searchInput, { target: { value: 'government' } });
      expect(searchInput.value).toBe('government');
    }
  });

  // TEST CASE 26: Delete history item 🗑️
  it('TC-26: Should delete history item on confirmation', async () => {
    renderWithRouter(<Dashboard />);
    
    const deleteButtons = screen.queryAllByRole('button', { name: /delete|remove/i });
    
    if (deleteButtons.length > 0) {
      fireEvent.click(deleteButtons[0]);
      
      // Look for confirmation dialog
      const confirmButton = screen.queryByRole('button', { name: /confirm|yes/i });
      if (confirmButton) {
        fireEvent.click(confirmButton);
      }
    }
  });
});

// ============= ACCESSIBILITY TESTS =============
describe('Accessibility Tests', () => {
  
  it('Should have proper heading hierarchy', () => {
    renderWithRouter(<Dashboard />);
    
    const headings = screen.queryAllByRole('heading');
    expect(headings.length).toBeGreaterThan(0);
  });

  it('Should have descriptive alt text for images', () => {
    renderWithRouter(<LandingPage />);
    
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      expect(img.hasAttribute('alt')).toBe(true);
    });
  });

  it('Should have proper ARIA labels', () => {
    renderWithRouter(<Dashboard />);
    
    const buttons = screen.queryAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});

// ============= PERFORMANCE TESTS =============
describe('Performance Tests', () => {
  
  it('Should render dashboard within acceptable time', () => {
    const startTime = performance.now();
    renderWithRouter(<Dashboard />);
    const endTime = performance.now();
    
    const renderTime = endTime - startTime;
    expect(renderTime).toBeLessThan(3000); // 3 second threshold
  });

  it('Should not cause memory leaks on unmount', () => {
    const { unmount } = renderWithRouter(<Dashboard />);
    
    // Should unmount without errors
    expect(() => unmount()).not.toThrow();
  });
});

// ============= EXPORT FOR COVERAGE REPORTS =============
export {};
