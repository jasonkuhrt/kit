/**
 * Example demonstrating the new Log module - a replacement for Debug
 * that supports both development debugging and production logging.
 */

import { Log } from '../src/utils/log/_.js'

// Create a root logger
const log = Log.create()

// Basic logging
log.info(`Application started`)
log.debug(`Configuration loaded`)
log.warn(`Deprecated API usage detected`)

// Hierarchical logging with child loggers
const appLog = log.child(`app`)
const routerLog = appLog.child(`router`)

appLog.info(`App module initialized`)
routerLog.debug(`Route registered`, { path: `/users/:id`, method: `GET` })

// Context propagation
const requestLog = log.child(`request`)
requestLog.addToContext({ requestId: `abc123`, userId: `user456` })
requestLog.info(`Processing request`)
requestLog.debug(`Cache miss`) // context automatically included

// Filtering via LOG_FILTER environment variable
// Examples:
//   LOG_FILTER="app:*"          - All logs from app namespace
//   LOG_FILTER="*@info+"        - All logs at info level or higher
//   LOG_FILTER="*,!internal:*"  - Everything except internal namespace
//   LOG_FILTER="app:router@debug+" - App router at debug or higher

// Six log levels: trace, debug, info, warn, error, fatal
log.trace(`Detailed trace information`)
log.debug(`Debug information`)
log.info(`General information`)
log.warn(`Warning message`)
log.error(`Error occurred`, { error: new Error(`Something failed`) })
log.fatal(`Critical failure`)
