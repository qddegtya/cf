import debugFactory from 'debug'
const debug = debugFactory('cf:core:inject')

const injectCommandFromClass = (cliEngine, CommandClass, config) => {
  const { command, alias = '', description} = CommandClass

  let instance = new CommandClass(config)

  debug('DO_INJECT:: command: %s | description: %s', command, description)

  // define command
  let commandInstance = cliEngine.command(command)

  // pass `commandInstance` to command instance
  // for example: initialize command options
  instance.init && instance.init(commandInstance)
  
  // alias & description
  commandInstance
    .alias(alias)
    .description(description)

  // bind action to command
  commandInstance.action(instance.action.bind(instance))
}

export default injectCommandFromClass
