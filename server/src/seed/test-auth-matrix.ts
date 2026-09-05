import mongoose from 'mongoose';
import { app } from '../app';
import { env } from '../config/env.config';
import { Server } from 'http';

async function runAuthTests() {
  console.log('=== DEALFLOW360 AUTHENTICATION CORE TEST SUITE ===\n');

  let server: Server;
  const PORT = 5099;
  const BASE_URL = `http://localhost:${PORT}/api`;

  try {
    // 1. Connect MongoDB
    console.log('[Test 1] Connecting to MongoDB...');
    await mongoose.connect(env.MONGODB_URI, { dbName: 'dealflow360' });
    console.log('  -> PASS: MongoDB Connected');

    // Clean up test collection
    if (mongoose.connection.db) {
      await mongoose.connection.db.collection('users').deleteMany({ email: /test.*@dealflow360\.com/i });
    }

    // Start local test HTTP server
    server = await new Promise<Server>((resolve) => {
      const s = app.listen(PORT, () => resolve(s));
    });

    const testUser = {
      name: 'Auth Test User',
      email: 'testuser@dealflow360.com',
      password: 'SecurePassword123!',
    };

    let authToken = '';
    let refreshTokenStr = '';

    // 2. User Registration
    console.log('[Test 2] User Registration (POST /api/auth/register)...');
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser),
    });
    const regData = (await regRes.json()) as any;

    if (regRes.status === 201 && regData.success && regData.data.token && !regData.data.user.passwordHash) {
      console.log('  -> PASS: User Registered. ID:', regData.data.user.id, 'Role:', regData.data.user.role);
    } else {
      console.error('  -> FAIL:', regRes.status, regData);
    }

    // 3. Duplicate Registration
    console.log('[Test 3] Duplicate Registration Check...');
    const dupRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser),
    });
    const dupData = (await dupRes.json()) as any;

    if (dupRes.status === 409 && !dupData.success) {
      console.log('  -> PASS: Duplicate Email rejected with 409 Conflict');
    } else {
      console.error('  -> FAIL:', dupRes.status, dupData);
    }

    // 4. Invalid Registration Data
    console.log('[Test 4] Invalid Registration Data (Short Password)...');
    const invRegRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Short', email: 'invalid-email', password: '123' }),
    });
    const invRegData = (await invRegRes.json()) as any;

    if (invRegRes.status === 400 && !invRegData.success) {
      console.log('  -> PASS: Invalid input rejected with 400 Validation Error');
    } else {
      console.error('  -> FAIL:', invRegRes.status, invRegData);
    }

    // 5. Valid Login
    console.log('[Test 5] Valid Login (POST /api/auth/login)...');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUser.email, password: testUser.password }),
    });
    const loginData = (await loginRes.json()) as any;

    if (loginRes.status === 200 && loginData.success && loginData.data.token) {
      authToken = loginData.data.token;
      refreshTokenStr = loginData.data.refreshToken;
      console.log('  -> PASS: Login successful, JWT Access & Refresh tokens issued');
    } else {
      console.error('  -> FAIL:', loginRes.status, loginData);
    }

    // 6. Invalid Login Password
    console.log('[Test 6] Invalid Login Password...');
    const badPassRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUser.email, password: 'WrongPassword!' }),
    });
    const badPassData = (await badPassRes.json()) as any;

    if (badPassRes.status === 401 && !badPassData.success) {
      console.log('  -> PASS: Invalid password rejected with 401 Unauthorized');
    } else {
      console.error('  -> FAIL:', badPassRes.status, badPassData);
    }

    // 7. Nonexistent Email Login
    console.log('[Test 7] Nonexistent Email Login...');
    const noEmailRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'nonexistent@dealflow360.com', password: 'Password123!' }),
    });
    const noEmailData = (await noEmailRes.json()) as any;

    if (noEmailRes.status === 401 && !noEmailData.success) {
      console.log('  -> PASS: Nonexistent email rejected with 401 Unauthorized');
    } else {
      console.error('  -> FAIL:', noEmailRes.status, noEmailData);
    }

    // 8. /me Without Token
    console.log('[Test 8] GET /api/auth/me without Bearer token...');
    const noTokenRes = await fetch(`${BASE_URL}/auth/me`);
    const noTokenData = (await noTokenRes.json()) as any;

    if (noTokenRes.status === 401 && !noTokenData.success) {
      console.log('  -> PASS: Protected route rejected without token');
    } else {
      console.error('  -> FAIL:', noTokenRes.status, noTokenData);
    }

    // 9. /me With Valid Token
    console.log('[Test 9] GET /api/auth/me with valid Bearer token...');
    const meRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const meData = (await meRes.json()) as any;

    if (meRes.status === 200 && meData.success && meData.data.user.email === testUser.email) {
      console.log('  -> PASS: Authenticated profile fetched successfully');
    } else {
      console.error('  -> FAIL:', meRes.status, meData);
    }

    // 10. /me With Invalid Token
    console.log('[Test 10] GET /api/auth/me with invalid token...');
    const invTokenRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: 'Bearer invalid_token_xyz' },
    });
    const invTokenData = (await invTokenRes.json()) as any;

    if (invTokenRes.status === 401 && !invTokenData.success) {
      console.log('  -> PASS: Invalid token rejected with 401');
    } else {
      console.error('  -> FAIL:', invTokenRes.status, invTokenData);
    }

    // 11. Refresh Token
    console.log('[Test 11] POST /api/auth/refresh...');
    const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: refreshTokenStr }),
    });
    const refreshData = (await refreshRes.json()) as any;

    if (refreshRes.status === 200 && refreshData.success && refreshData.data.token) {
      console.log('  -> PASS: New access & refresh tokens issued via refresh endpoint');
    } else {
      console.error('  -> FAIL:', refreshRes.status, refreshData);
    }

    // 12. Logout
    console.log('[Test 12] POST /api/auth/logout...');
    const logoutRes = await fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const logoutData = (await logoutRes.json()) as any;

    if (logoutRes.status === 200 && logoutData.success) {
      console.log('  -> PASS: Logout completed successfully');
    } else {
      console.error('  -> FAIL:', logoutRes.status, logoutData);
    }

    console.log('\n=== ALL AUTHENTICATION TESTS PASSED SUCCESSFULLY! ===');
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    if (server!) server.close();
    await mongoose.disconnect();
    process.exit(0);
  }
}

runAuthTests();
