import * as Logger from './logger.js'
import * as Settings from './settings.js'

export type SettingsManager = Settings.Data & {
  (newSettings: Settings.Input): RootLogger
}

export type Options = Settings.Input

export type RootLogger = Logger.Logger & {
  settings: SettingsManager
}

export type State = {
  settings: SettingsManager
}

/**
 * Create a root logger with hierarchical namespacing and powerful filtering.
 *
 * @remarks
 *
 * The Log module provides structured logging with six levels (trace, debug, info, warn, error, fatal),
 * hierarchical namespacing via child loggers, context propagation, and advanced pattern-based filtering.
 *
 * **Features:**
 * - **Hierarchical logging**: Create child loggers with {@link Logger.child} to organize logs by namespace
 * - **Context propagation**: Add context with {@link Logger.addToContext} that flows to all children
 * - **Powerful filtering**: Control log output via `LOG_FILTER` environment variable with rich pattern syntax
 * - **Six log levels**: `fatal` (6), `error` (5), `warn` (4), `info` (3), `debug` (2), `trace` (1)
 * - **Dual output modes**: Pretty terminal formatting (development) or JSON (production)
 * - **Environment integration**: Respects `LOG_FILTER`, `LOG_LEVEL`, `LOG_PRETTY`, `NODE_ENV`
 *
 * **Environment Variables:**
 * - `LOG_FILTER` - Pattern to filter logs (e.g., `"app:*"`, `"*@info+"`, `"*,!internal:*"`)
 * - `LOG_LEVEL` - Default log level (e.g., `"info"`, `"debug"`)
 * - `LOG_PRETTY` - Enable/disable pretty output (default: auto-detect based on NODE_ENV)
 * - `NODE_ENV` - When `"production"`, defaults to JSON output and info level
 *
 * **Filter Pattern Syntax:**
 *
 * Patterns control which logs are output based on path and level:
 * - `*` - All paths at default level
 * - `app` - Logs from `app` namespace
 * - `app:router` - Logs from `app:router` namespace
 * - `app:*` - Logs from `app` and all descendants
 * - `app::*` - Logs from `app` descendants only (excludes `app` itself)
 * - `*@info` - All paths at info level exactly
 * - `*@warn+` - All paths at warn level or higher (warn, error, fatal)
 * - `*@debug-` - All paths at debug level or lower (trace, debug)
 * - `!app` - Exclude logs from `app` namespace
 * - `*,!app` - All paths except `app`
 * - `app,!app@debug` - Logs from `app` except debug level
 *
 * @example
 * **Basic usage:**
 * ```typescript
 * import { Log } from '@wollybeard/kit/log'
 *
 * const log = Log.create()
 *
 * log.info('Application started')
 * log.debug('Configuration loaded', { config: { port: 3000 } })
 * log.warn('Deprecated API usage')
 * log.error('Failed to connect', { error: new Error('Connection timeout') })
 * ```
 *
 * @example
 * **Hierarchical logging:**
 * ```typescript
 * const log = Log.create()
 * const appLog = log.child('app')
 * const routerLog = appLog.child('router')
 *
 * log.info('Root logger')           // Logs as "root"
 * appLog.info('App logger')         // Logs as "app"
 * routerLog.info('Router logger')   // Logs as "app:router"
 * ```
 *
 * @example
 * **Context propagation:**
 * ```typescript
 * const requestLog = log.child('request')
 * requestLog.addToContext({ requestId: 'abc123', userId: 'user456' })
 *
 * requestLog.info('Processing request')  // Includes requestId and userId
 * requestLog.debug('Cache miss')         // Context automatically included
 *
 * const dbLog = requestLog.child('db')
 * dbLog.info('Query executed')           // Inherits parent context
 * ```
 *
 * @example
 * **Filtering examples:**
 * ```bash
 * # Show all logs from app namespace
 * LOG_FILTER="app:*" node app.js
 *
 * # Show info level and higher
 * LOG_FILTER="*@info+" node app.js
 *
 * # Show everything except internal namespace
 * LOG_FILTER="*,!internal:*" node app.js
 *
 * # Show app:router at debug or higher
 * LOG_FILTER="app:router@debug+" node app.js
 * ```
 *
 * @param opts - Optional configuration for logger behavior
 * @returns A root logger instance with all logging methods and child creation
 */
export const create = (opts?: Options): RootLogger => {
  const settings = Settings.create(opts)
  const settingsManager = ((newSettings) => {
    settings(newSettings)
    Object.assign(settingsManager, settings)
    return logger
  }) as SettingsManager
  Object.assign(settingsManager, settings)
  const loggerLink = Logger.create({ settings: settingsManager }, null, undefined)
  const logger = loggerLink.logger as RootLogger
  logger.settings = settingsManager
  return logger
}
