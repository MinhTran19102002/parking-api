import {slugify} from '~/utils/formatter'

const login = async (data) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const login = {
      ...data,
      slug: slugify(data.username)
    }
    return login
  } catch (error) {
    throw error
  }
}

export const userService = {
  login
}