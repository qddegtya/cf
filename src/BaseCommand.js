import co from 'co'
import tpl from './utils/tpl'

export default class BaseCommand {
  constructor(config) {
    this.config = config

    this.setup()
  }

  setup() {
    this.context = {
      env: process.env,
      cwd: process.cwd()
    }

    this.helper = {}
    this.helper.tpl = tpl
  }

  action () {
    co(this.do.bind(this))
      .catch((err) => {
        // global error handler
        throw err
      })
  }
}
