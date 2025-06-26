/**
 * Checks if a command line argument is a named parameter (flag or option).
 *
 * Named parameters are arguments that start with a hyphen (-), including
 * both short flags (-v) and long options (--verbose).
 *
 * @param arg - The argument string to check
 * @returns true if the argument starts with '-', false otherwise
 *
 * @example
 * isNamedParameter('-v')        // true
 * isNamedParameter('--verbose') // true
 * isNamedParameter('--help')    // true
 * isNamedParameter('build')     // false
 * isNamedParameter('123')       // false
 */
export const isNamedParameter = (arg: string): boolean => arg.startsWith(`-`)
