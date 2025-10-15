/**
 * 비밀번호 해시 유틸리티
 * bcrypt 대신 Web Crypto API 사용
 */

export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  
  // SHA-256으로 해시
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  
  // 솔트 생성 (현재 시간 + 랜덤)
  const salt = new Uint8Array(16);
  crypto.getRandomValues(salt);
  
  // 솔트와 해시를 결합
  const combined = new Uint8Array(hashBuffer.length + salt.length);
  combined.set(salt);
  combined.set(new Uint8Array(hashBuffer), salt.length);
  
  // Base64로 인코딩
  return btoa(String.fromCharCode.apply(null, combined));
}

export async function verifyPassword(password, hashedPassword) {
  try {
    // Base64 디코딩
    const combined = new Uint8Array(
      atob(hashedPassword).split('').map(char => char.charCodeAt(0))
    );
    
    // 솔트와 해시 분리
    const salt = combined.slice(0, 16);
    const storedHash = combined.slice(16);
    
    // 입력된 비밀번호 해시
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    
    // 솔트와 해시 결합
    const combinedInput = new Uint8Array(hashBuffer.length + salt.length);
    combinedInput.set(salt);
    combinedInput.set(new Uint8Array(hashBuffer), salt.length);
    
    // 해시 비교
    return arrayEquals(combinedInput, combined);
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}

function arrayEquals(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
