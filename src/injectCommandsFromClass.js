import debugFactory from 'debug'
import { COMMANDS_STORE } from './host'

const debug = debugFactory('cf:core:inject')

const injectCommandFromClass = (cliEngine, CommandClass, config) => {
  const { command, alias = '', description} = CommandClass

  let instance = new CommandClass(config)
  CommandClass.prototype.conflict = cmd => COMMANDS_STORE.includes(cmd)

  debug('DO_INJECT:: command: %s | description: %s', command, description)
  
  // for debugging
  if (instance.conflict(command))
    throw new Error(
      `[${command}] has already been injected, `
      + `please check the \`command\` static property of ${CommandClass.name}.`
    )

  // define command
  let commandInstance = cliEngine.command(command)
  COMMANDS_STORE.push(command)

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
