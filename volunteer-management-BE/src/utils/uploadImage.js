import cloudinary from '~/config/cloudinary'

export const uploadImageToCloudinary = async (imageData) => {
  try {
    // Nếu là base64 string
    if (imageData.startsWith('data:image')) {
      const result = await cloudinary.uploader.upload(imageData, {
        folder: 'volunteer-avatars',
        transformation: [
          { width: 400, height: 400, crop: 'fill' },
          { quality: 'auto' }
        ]
      })
      return result.secure_url
    }
    
    // Nếu là file buffer hoặc stream
    const result = await cloudinary.uploader.upload_stream({
      folder: 'volunteer-avatars',
      transformation: [
        { width: 400, height: 400, crop: 'fill' },
        { quality: 'auto' }
      ]
    }, (error, result) => {
      if (error) throw error
      return result.secure_url
    })
    
    return result
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error)
    throw new Error('Không thể upload ảnh lên Cloudinary')
  }
}

export const deleteImageFromCloudinary = async (imageUrl) => {
  try {
    if (!imageUrl) return
    
    // Lấy public_id từ URL
    const publicId = imageUrl.split('/').pop().split('.')[0]
    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error)
  }
} 