import ansis from 'ansis'

export namespace Term {
  export const colors = {
    mute: (text: string) => ansis.gray(text),
    dim: (text: string) => ansis.dim(ansis.gray(text)),
    accent: (text: string) => ansis.yellow(text),
    alert: (text: string) => ansis.red(text),
    alertBoldBg: (text: string) => ansis.bgRedBright(text),
    positiveBold: (text: string) => ansis.bold(colors.positive(text)),
    positive: (text: string) => ansis.green(text),
    secondary: (text: string) => ansis.blue(text),
  }
}
