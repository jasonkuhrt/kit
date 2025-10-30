import { Test } from '#test'
import { escape } from './html.js'

// dprint-ignore
Test.on(escape)
  .cases(
    // No escaping needed
    [['hello world'],                                                    'hello world'],
    [[''],                                                               ''],

    // Angle brackets (generic types)
    [['Array<T>'],                                                       'Array&lt;T&gt;'],
    [['Record<K, V>'],                                                   'Record&lt;K, V&gt;'],
    [['Promise<string> or Map<string, number>'],                         'Promise&lt;string&gt; or Map&lt;string, number&gt;'],

    // Quotes
    [['Say "hello"'],                                                    'Say &quot;hello&quot;'],
    [["It's mine"],                                                      'It&#39;s mine'],

    // Ampersand
    [['Tom & Jerry'],                                                    'Tom &amp; Jerry'],

    // XSS prevention
    [['<script>alert("xss")</script>'],                                  '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'],

    // All characters combined
    [['<div class="foo" data-value=\'bar\'>A & B</div>'],               '&lt;div class=&quot;foo&quot; data-value=&#39;bar&#39;&gt;A &amp; B&lt;/div&gt;'],

    // Non-string coercion
    [[42],                                                               '42'],
    [[null],                                                             'null'],
    [[undefined],                                                        'undefined'],
  )
  .test()
