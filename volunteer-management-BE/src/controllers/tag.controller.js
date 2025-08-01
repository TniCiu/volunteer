import { StatusCodes } from 'http-status-codes'
import { TagService } from '~/services/tag.service'

const createNew = async (req, res, next) => {
  try {
    const result = await TagService.createTag(req.body)
    res.status(StatusCodes.CREATED).json(result)
  } catch (error) {
    next(error)
  }
}

const getDetails = async (req, res, next) => {
  try {
    const tag = await TagService.getTagById(req.params.id)
    if (!tag) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Tag not found' })
    }
    res.status(StatusCodes.OK).json(tag)
  } catch (error) {
    next(error)
  }
}

const getAll = async (req, res, next) => {
  try {
    const tags = await TagService.getAllTags()
    res.status(StatusCodes.OK).json(tags)
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const tag = await TagService.updateTagById(req.params.id, req.body)
    res.status(StatusCodes.OK).json(tag)
  } catch (error) {
    next(error)
  }
}

const deleteOne = async (req, res, next) => {
  try {
    const result = await TagService.deleteTagById(req.params.id)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const tagController = {
  createNew,
  getDetails,
  getAll,
  update,
  deleteOne
} 