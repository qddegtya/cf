import co from 'co'

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
  }

  action () {
    co(this.do.bind(this))
      .catch((err) => {
        // global error handler
        throw err
      })
  }
}
