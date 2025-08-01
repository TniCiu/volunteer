import bcrypt from 'bcrypt'

// Hàm mã hóa mật khẩu
export const hashPassword = async (plainPassword) => {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(plainPassword, salt)
}

// Hàm so sánh mật khẩu
export const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword)
}
