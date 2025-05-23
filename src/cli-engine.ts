import { cac } from 'cac'
import { prompt } from 'enquirer'
import { AutoWangda } from '.'

const cli = cac('autoWangda')

interface CLIOptions {
  '--'?: string[]
  authToken?: string
  subjectId?: string
  series?: boolean
  s?: boolean
  limit?: number
}

cli
  .command('')
  .alias('parallel')
  .option(
    '--authToken <authToken>',
    '授权Token,在专题学习页面获取，详见 ./使用指南.jpg'
  )
  .option(
    '--subjectId <subjectId>',
    '专题ID, 在专题学习页面的链接里获取，详见 ./使用指南.jpg  e.g. `xxx-xxx-xxx-xxx` in #/study/subject/detail/xxx-xxx-xxx-xxx'
  )
  .option('-s, --series', 'Serial request means request one by one in order')
  .option('--limit <limit>', 'The maximum number of async operations at a time')
  .action(async (options: CLIOptions) => {
    let { authToken, subjectId } = options
    const { series, limit = 10 } = options

    if (!authToken) {
      const { u } = (await prompt({
        name: 'u',
        type: 'input',
        message: '请输入授权token，e.g. `xxx-xxx-xxx-xxx',
        validate: (v) => /\S+/.test(v)
      })) as { u: string }
      authToken = u.trim()
    }

    if (!subjectId) {
      const { s } = (await prompt({
        name: 's',
        type: 'input',
        message:
          '请输入专题ID，e.g. `xxx-xxx-xxx-xxx` in #/study/subject/detail/xxx-xxx-xxx-xxx',
        validate: (v) => /\S+/.test(v)
      })) as { s: string }
      subjectId = s.trim()
    }
    const autoWangda = new AutoWangda(
      {
        authToken
      },
      subjectId,
      series ? 'series' : 'parallel',
      limit
    )
    autoWangda.run()
    return
  })
cli.help()
cli.version(require('../../package.json').version)
cli.parse()
