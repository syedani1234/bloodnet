async function test() {
  const base = 'http://localhost:3001'
  const loginEmail = process.env.TEST_EMAIL
  const loginPassword = process.env.TEST_PASSWORD
  const loginRole = process.env.TEST_ROLE || 'donor'

  const health = await fetch(`${base}/api/health`).then((r) => r.json())
  console.log('Health:', JSON.stringify(health, null, 2))

  const donors = await fetch(`${base}/api/donors?city=Karachi&bloodGroup=O+`).then((r) => r.json())
  console.log('Karachi O+ donors:', donors.total)

  if (!loginEmail || !loginPassword) {
    console.log('Set TEST_EMAIL and TEST_PASSWORD to verify login against your own user account.')
    return
  }

  const login = await fetch(`${base}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: loginEmail,
      password: loginPassword,
      role: loginRole,
    }),
  }).then((r) => r.json())
  console.log('Login:', login.success ? login.user.name : login.error)
}

test().catch(console.error)
