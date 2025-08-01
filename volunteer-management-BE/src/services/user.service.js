import jwt from 'jsonwebtoken'
import { slugify } from '~/utils/formatters'
import { hashPassword, comparePassword } from '~/utils/hash'
import { uploadImageToCloudinary, deleteImageFromCloudinary } from '~/utils/uploadImage'
import * as UserModel from '~/models/user.model'
import { env } from '~/config/environment'

const JWT_SECRET = env.JWT_SECRET || 'your-secret-key'

const createUser = async (data) => {
  const existingByEmail = await UserModel.findUserByEmail(data.email)
  if (existingByEmail) throw new Error('Email đã tồn tại.')

  const existingByPhone = await UserModel.findUserByPhone(data.phone)
  if (existingByPhone) throw new Error('Số điện thoại đã tồn tại.')

  const hashed = await hashPassword(data.password)

  // Upload avatar nếu có
  let avatarUrl = null
  if (data.avatar && data.avatar.startsWith('data:image')) {
    avatarUrl = await uploadImageToCloudinary(data.avatar)
  }

  const newUser = {
    ...data,
    avatar: avatarUrl || data.avatar || null,
    role: data.role || 'volunteer',
    status: data.status || 'active',
    password: hashed,
    slug: slugify(data.name)
  }

  const created = await UserModel.createUser(newUser)

  const token = jwt.sign(
    { id: created.id, email: created.email, role: created.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  )

  const { password: _, ...safeData } = created

  return {
    user: safeData,
    token
  }
}

const login = async ({ email, password }) => {
  const user = await UserModel.findUserByEmail(email)
  if (!user) throw new Error('Email không đúng')

  const isMatch = await comparePassword(password, user.password)
  if (!isMatch) throw new Error('Mật khẩu không đúng')

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  )

  const { password: _, ...safeData } = user

  return { user: safeData, token }
}

const getUserById = async (id) => await UserModel.findUserById(id)
const getUserByEmail = async (email) => await UserModel.findUserByEmail(email)
const getAllUsers = async () => await UserModel.findAllUsers()

// Thêm 2 method mới
const getAllVolunteers = async () => await UserModel.findVolunteers()
const getAllLeadersAndAdmins = async () => await UserModel.findLeadersAndAdmins()

const updateUserById = async (id, data) => {
  // Lọc ra các trường có giá trị (không phải undefined)
  const updatedUser = {}
  
  if (data.name !== undefined) updatedUser.name = data.name
  if (data.avatar !== undefined) updatedUser.avatar = data.avatar
  if (data.phone !== undefined) updatedUser.phone = data.phone
  if (data.email !== undefined) updatedUser.email = data.email
  if (data.role !== undefined) updatedUser.role = data.role
  if (data.status !== undefined) updatedUser.status = data.status

  if (data.password) {
    updatedUser.password = await hashPassword(data.password)
  }
  
  if (data.name) {
    updatedUser.slug = slugify(data.name)
  }
  
  // Đảm bảo status có giá trị mặc định
  if (!updatedUser.status) {
    updatedUser.status = 'active'
  }

  // Xử lý upload avatar mới
  if (data.avatar && data.avatar.startsWith('data:image')) {
    // Lấy avatar cũ để xóa
    const currentUser = await UserModel.findUserById(id)
    if (currentUser && currentUser.avatar && currentUser.avatar.includes('cloudinary')) {
      await deleteImageFromCloudinary(currentUser.avatar)
    }
    
    // Upload avatar mới
    const avatarUrl = await uploadImageToCloudinary(data.avatar)
    updatedUser.avatar = avatarUrl
  }

  return await UserModel.updateUser(id, updatedUser)
}

const deleteUserById = async (id) => {
  // Xóa avatar trên Cloudinary trước khi xóa user
  const user = await UserModel.findUserById(id)
  if (user && user.avatar && user.avatar.includes('cloudinary')) {
    await deleteImageFromCloudinary(user.avatar)
  }
  
  return await UserModel.deleteUser(id)
}

export const UserService = {
  createUser,
  login,
  getUserById,
  getUserByEmail,
  getAllUsers,
  getAllVolunteers,
  getAllLeadersAndAdmins,
  updateUserById,
  deleteUserById
}
