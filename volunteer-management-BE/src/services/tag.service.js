import * as TagModel from '~/models/tag.model'

const createTag = async (data) => {
  return await TagModel.createTag(data)
}

const getTagById = async (id) => await TagModel.findTagById(id)
const getAllTags = async () => await TagModel.findAllTags()

const updateTagById = async (id, data) => {
  return await TagModel.updateTag(id, data)
}

const deleteTagById = async (id) => await TagModel.deleteTag(id)

export const TagService = {
  createTag,
  getTagById,
  getAllTags,
  updateTagById,
  deleteTagById
} 