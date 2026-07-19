const base = 'http://localhost:3001'

async function get(path) {
  const res = await fetch(`${base}${path}`)
  return res.json()
}

async function post(path, body) {
  const res = await fetch(`${base}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return { status: res.status, data: await res.json() }
}

async function main() {
  const results = []

  const health = await get('/api/health')
  results.push(['Health', health.status === 'ok' ? 'PASS' : 'FAIL', `${health.databases?.bloodnet_karachi?.donors} Karachi donors`])

  const allDonors = await get('/api/donors?city=Karachi')
  results.push(['Karachi donors', allDonors.total > 0 ? 'PASS' : 'FAIL', `${allDonors.total} donors`])

  const oPlusDonors = await get('/api/donors?city=Karachi&bloodGroup=' + encodeURIComponent('O+'))
  results.push(['Karachi O+ filter', oPlusDonors.total > 0 ? 'PASS' : 'FAIL', `${oPlusDonors.total} donors`])

  const lahoreDonors = await get('/api/donors?city=Lahore')
  results.push(['Lahore donors', lahoreDonors.total > 0 ? 'PASS' : 'FAIL', `${lahoreDonors.total} donors`])

  const users = await get('/api/users')
  results.push(['Users API', users.total > 0 ? 'PASS' : 'FAIL', `${users.total} users`])

  const loginEmail = process.env.TEST_EMAIL
  const loginPassword = process.env.TEST_PASSWORD
  const loginRole = process.env.TEST_ROLE || 'donor'

  if (loginEmail && loginPassword) {
    const { status, data } = await post('/api/auth/login', { email: loginEmail, password: loginPassword, role: loginRole })
    results.push(['Login check', status === 200 && data.success ? 'PASS' : 'FAIL', data.user?.name || data.error])

    const badLogin = await post('/api/auth/login', { email: loginEmail, password: 'wrong', role: loginRole })
    results.push(['Bad password rejected', badLogin.status === 401 ? 'PASS' : 'FAIL', badLogin.data.error])
  } else {
    results.push(['Login check', 'SKIP', 'Set TEST_EMAIL and TEST_PASSWORD to verify login'])
  }

  console.log('\nBloodNet MongoDB Verification\n' + '='.repeat(50))
  for (const [name, status, detail] of results) {
    console.log(`${status.padEnd(5)} | ${name} — ${detail}`)
  }
  const failed = results.filter((r) => r[1] === 'FAIL').length
  console.log('='.repeat(50))
  console.log(failed === 0 ? 'All checks passed.' : `${failed} check(s) failed.`)
}

main().catch((err) => {
  console.error('Verification failed:', err.message)
  process.exit(1)
})
