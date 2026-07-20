export interface SignupValidationResult {
  isValid: boolean
  errors: string[]
}

export function validateSignupInput(input: {
  name?: string
  email?: string
  password?: string
  phone?: string
  role?: string
  city?: string
  bloodGroup?: string
}): SignupValidationResult {
  const errors: string[] = []

  if (!input.name || input.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long')
  }

  if (!input.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) {
    errors.push('Please enter a valid email address')
  }

  if (!input.password || input.password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  } else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/.test(input.password)) {
    errors.push('Password must include uppercase, lowercase, and a number')
  }

  if (!input.phone || !/^\+92[0-9]{10}$/.test(input.phone.replace(/\s+/g, '').trim())) {
    errors.push('Phone number must be a valid Pakistani number in format +92xxxxxxxxxx')
  }

  if (!input.role || !['donor', 'receiver', 'hospital'].includes(input.role)) {
    errors.push('Please select a valid account role')
  }

  if (!input.city || input.city.trim().length < 2) {
    errors.push('Please select a city')
  }

  if ((input.role === 'donor' || input.role === 'receiver') && !input.bloodGroup) {
    errors.push('Please select your blood group')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
