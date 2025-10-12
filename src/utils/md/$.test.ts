import { Test } from '#test'
import { demoteHeadings } from './md.js'

// dprint-ignore
Test.on(demoteHeadings)
  .cases(
    [['## Case Formats\n\nSome content', 2],                             '#### Case Formats\n\nSome content'],
    [['## First\n\nContent\n\n## Second\n\nMore content', 2],            '#### First\n\nContent\n\n#### Second\n\nMore content'],
    [['# H1\n## H2\n### H3', 2],                                         '### H1\n#### H2\n##### H3'],
    [['## Heading', 0],                                                  '## Heading'],
    [['', 2],                                                            ''],
  )
  .test()
