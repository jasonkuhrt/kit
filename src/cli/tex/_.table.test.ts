import { Test } from '#test'
import { Tex } from './_.js'

Test
  .on(Tex.render)
  .snapshots({ arguments: false })
  .describeInputs(`text`, [
    Tex.Tex().table($ =>
      $
        .headers([`a`, `b`])
        .rows([
          [Tex.block('a1'), Tex.block('b2')],
        ])
    ),
    Tex.Tex().table($ =>
      $
        .headers([`a`, `b`])
        .rows([
          [
            Tex.block({ border: { edges: { char: 'x' } } }, 'a1'),
            Tex.block('b2'),
          ],
        ])
    ),
  ])
  .test()
