import { getAuth } from './get-auth'
import { getResourceIds } from './get-resourceIds'
import { getCourses } from './get-courses'
import { getSections } from './get-sections'
import { runTask } from './run-task'
import { store } from './store'
import { logger } from './logger'
import { LoginData, Type } from '../types/common'
import originLoginData from '../config/login-data.json'
import { loginDataList } from './login-data-list'

export class AutoWangda {
  loginData: LoginData
  courseId: string
  type: Type
  chunk_size?: number

  constructor(
    loginData: LoginData,
    courseId: string,
    type: Type,
    chunk_size?: number
  ) {
    this.loginData = Object.assign(originLoginData, loginData)
    this.courseId = courseId
    this.type = type
    this.chunk_size = chunk_size
  }

  async run(): Promise<void> {
    loginDataList.add(this.loginData)
    store.set('AUTH_TOKEN', this.loginData.authToken)
    store.set('LOGIN_DATA', this.loginData)
    logger.success('Logined')

    const resourceIds = await getResourceIds(this.courseId)
    logger.success('Got Resources', resourceIds, this.courseId)

    const courses = await getCourses(resourceIds)
    logger.success('Got Courses', courses)

    const sections = await getSections(courses)
    logger.success('Got Sections', sections)

    logger.info('Starting...')
    runTask(sections, this.type, this.chunk_size)
  }
}
