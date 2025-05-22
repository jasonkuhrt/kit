/*
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/MIME_types/Common_types
 */

export const applicationJson = `application/json`
export type applicationJson = typeof applicationJson

export const applicationGraphqlResponseJson = `application/graphql-response+json`
export type applicationGraphqlResponseJson = typeof applicationGraphqlResponseJson

export const multipartFormData = `multipart/form-data`
export type multipartFormData = typeof multipartFormData

export const textPlain = `text/plain`
export type textPlain = typeof textPlain

export const applicationJavascript = `application/javascript`
export type applicationJavascript = typeof applicationJavascript

export const applicationXml = `application/xml`
export type applicationXml = typeof applicationXml

export const applicationZip = `application/zip`
export type applicationZip = typeof applicationZip

export const applicationOctetStream = `application/octet-stream`
export type applicationOctetStream = typeof applicationOctetStream

export const applicationFormUrlEncoded = `application/x-www-form-urlencoded`
export type applicationFormUrlEncoded = typeof applicationFormUrlEncoded

export const applicationFormMultipart = `multipart/form-data`
export type applicationFormMultipart = typeof applicationFormMultipart

export const textHtml = `text/html`
export type textHtml = typeof textHtml

export const textCss = `text/css`
export type textCss = typeof textCss

export const textJavaScript = `text/javascript`
export type textJavaScript = typeof textJavaScript

export const textXml = `text/xml`
export type textXml = typeof textXml

export const textCsv = `text/csv`
export type textCsv = typeof textCsv

export const imageJpeg = `image/jpeg`
export type imageJpeg = typeof imageJpeg

export const imagePng = `image/png`
export type imagePng = typeof imagePng

export const imageGif = `image/gif`
export type imageGif = typeof imageGif

export const imageSvg = `image/svg+xml`
export type imageSvg = typeof imageSvg

export const imageWebp = `image/webp`
export type imageWebp = typeof imageWebp

export const fontWoff = `font/woff`
export type fontWoff = typeof fontWoff

export const fontWoff2 = `font/woff2`
export type fontWoff2 = typeof fontWoff2

export const fontTtf = `font/ttf`
export type fontTtf = typeof fontTtf

export const fontOtf = `font/otf`
export type fontOtf = typeof fontOtf

export const audioMp3 = `audio/mpeg`
export type audioMp3 = typeof audioMp3

export const audioWav = `audio/wav`
export type audioWav = typeof audioWav

export const audioOgg = `audio/ogg`
export type audioOgg = typeof audioOgg

export const videoMp4 = `video/mp4`
export type videoMp4 = typeof videoMp4

export const videoWebm = `video/webm`
export type videoWebm = typeof videoWebm

export const videoOgg = `video/ogg`
export type videoOgg = typeof videoOgg

/**
 * @see https://stackoverflow.com/questions/13827325/correct-mime-type-for-favicon-ico
 */
export const imageXIcon = `image/x-icon`
export type imageXIcon = typeof imageXIcon

export type Any =
  | applicationJson
  | applicationGraphqlResponseJson
  | multipartFormData
  | textPlain
  | applicationJavascript
  | applicationXml
  | applicationZip
  | applicationOctetStream
  | applicationFormUrlEncoded
  | applicationFormMultipart
  | textHtml
  | textCss
  | textJavaScript
  | textXml
  | textCsv
  | imageJpeg
  | imagePng
  | imageGif
  | imageSvg
  | imageWebp
  | fontWoff
  | fontWoff2
  | fontTtf
  | fontOtf
  | audioMp3
  | audioWav
  | audioOgg
  | videoMp4
  | videoWebm
  | videoOgg
  | imageXIcon
