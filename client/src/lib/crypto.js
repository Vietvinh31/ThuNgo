function bufToB64(buf) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
}

function b64ToBuf(b64) {
  const bin = atob(b64)
  const buf = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i)
  return buf
}

async function deriveKey(password, saltBuf) {
  const enc = new TextEncoder()
  const baseKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    'PBKDF2',
    false,
    ['deriveKey'],
  )
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: saltBuf,
      iterations: 100_000,
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )
}

async function generateKey() {
  return crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, [
    'encrypt',
    'decrypt',
  ])
}

async function exportKey(key) {
  const raw = await crypto.subtle.exportKey('raw', key)
  return bufToB64(raw)
}

async function importKey(b64) {
  return crypto.subtle.importKey('raw', b64ToBuf(b64), 'AES-GCM', false, [
    'encrypt',
    'decrypt',
  ])
}

export async function encryptMessage(plaintext, password) {
  const enc = new TextEncoder()
  const iv = crypto.getRandomValues(new Uint8Array(12))
  let key
  let saltB64 = null

  if (password?.trim()) {
    const salt = crypto.getRandomValues(new Uint8Array(16))
    key = await deriveKey(password.trim(), salt)
    saltB64 = bufToB64(salt)
  } else {
    key = await generateKey()
  }

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(plaintext),
  )

  const keyFragment = password?.trim() ? null : await exportKey(key)

  return {
    contentEncrypted: bufToB64(ciphertext),
    iv: bufToB64(iv),
    salt: saltB64,
    keyFragment,
  }
}

export async function decryptMessage(
  contentEncrypted,
  iv,
  salt,
  password,
  keyFragment,
) {
  const dec = new TextDecoder()
  let key

  if (salt && password) {
    key = await deriveKey(password, b64ToBuf(salt))
  } else if (keyFragment) {
    key = await importKey(keyFragment)
  } else {
    throw new Error('Thiếu khóa giải mã')
  }

  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: b64ToBuf(iv) },
    key,
    b64ToBuf(contentEncrypted),
  )

  return dec.decode(plaintext)
}
