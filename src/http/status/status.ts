/**
 * Represents an HTTP status code and its description.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
 */
export interface Status {
  /** The HTTP status code (e.g., 200, 404, 500) */
  code: number
  /** Human-readable description of the status code */
  description: string
}

/**
 * Informational responses (100–199)
 * Indicates a provisional response, consisting of the Status-Line and optional headers,
 * and is terminated by an empty line.
 */

/**
 * The server has received the request headers and the client should proceed to send the request body.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/100
 */
export const Continue: Status = { code: 100, description: `Continue` } as const

/**
 * The server is switching protocols as requested by the client.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/101
 */
export const SwitchingProtocols: Status = { code: 101, description: `Switching Protocols` } as const

/**
 * The server has received and is processing the request, but no response is available yet.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/102
 */
export const Processing: Status = { code: 102, description: `Processing` } as const

/**
 * Intended to be used with the Link header, allowing the user agent to start preloading
 * resources while the server prepares a response.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/103
 */
export const EarlyHints: Status = { code: 103, description: `Early Hints` } as const

/**
 * Successful responses (200–299)
 * Indicates that the client's request was successfully received, understood, and accepted.
 */

/**
 * The request has succeeded.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200
 */
export const OK: Status = { code: 200, description: `OK` } as const

/**
 * The request has been fulfilled and resulted in a new resource being created.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201
 */
export const Created: Status = { code: 201, description: `Created` } as const

/**
 * The request has been accepted for processing, but the processing has not been completed.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/202
 */
export const Accepted: Status = { code: 202, description: `Accepted` } as const

/**
 * The server successfully processed the request, but is returning information that may be from another source.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/203
 */
export const NonAuthoritativeInformation: Status = { code: 203, description: `Non-Authoritative Information` } as const

/**
 * The server successfully processed the request, but is not returning any content.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204
 */
export const NoContent: Status = { code: 204, description: `No Content` } as const

/**
 * The server successfully processed the request, but is not returning any content. Unlike a 204 response,
 * this response requires that the requester reset the document view.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/205
 */
export const ResetContent: Status = { code: 205, description: `Reset Content` } as const

/**
 * The server is delivering only part of the resource due to a range header sent by the client.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/206
 */
export const PartialContent: Status = { code: 206, description: `Partial Content` } as const

/**
 * The message body that follows is an XML message and can contain a number of separate response codes,
 * depending on how many sub-requests were made.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/207
 */
export const MultiStatus: Status = { code: 207, description: `Multi-Status` } as const

/**
 * The members of a DAV binding have already been enumerated in a previous reply to this request,
 * and are not being included again.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/208
 */
export const AlreadyReported: Status = { code: 208, description: `Already Reported` } as const

/**
 * The server has fulfilled a GET request for the resource, and the response is a representation
 * of the result of one or more instance-manipulations applied to the current instance.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/226
 */
export const IMUsed: Status = { code: 226, description: `IM Used` } as const

/**
 * Redirection messages (300–399)
 * Indicates that further action needs to be taken by the user agent to fulfill the request.
 */

/**
 * The request has more than one possible response. The user agent or user should choose one of them.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/300
 */
export const MultipleChoices: Status = { code: 300, description: `Multiple Choices` } as const

/**
 * The URL of the requested resource has been changed permanently. The new URL is given in the response.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/301
 */
export const MovedPermanently: Status = { code: 301, description: `Moved Permanently` } as const

/**
 * This response code means that the URI of requested resource has been changed temporarily.
 * Further changes in the URI might be made in the future.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/302
 */
export const Found: Status = { code: 302, description: `Found` } as const

/**
 * The server sent this response to direct the client to get the requested resource at another URI with a GET request.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/303
 */
export const SeeOther: Status = { code: 303, description: `See Other` } as const

/**
 * This is used for caching purposes. It tells the client that the response has not been modified,
 * so the client can continue to use the same cached version of the response.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/304
 */
export const NotModified: Status = { code: 304, description: `Not Modified` } as const

/**
 * Defined in a previous version of the HTTP specification to indicate that a requested response must be accessed by a proxy.
 * @deprecated Due to security concerns, this status code is deprecated.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/305
 */
export const UseProxy: Status = { code: 305, description: `Use Proxy` } as const

/**
 * No longer used. This code is reserved for future use.
 * @deprecated
 */
export const SwitchProxy: Status = { code: 306, description: `Switch Proxy` } as const

/**
 * The server sends this response to direct the client to get the requested resource at another URI
 * with same method that was used in the prior request. This has the same semantics as the 302 Found HTTP response code.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/307
 */
export const TemporaryRedirect: Status = { code: 307, description: `Temporary Redirect` } as const

/**
 * This means that the resource is now permanently located at another URI, specified by the Location: HTTP Response header.
 * This has the same semantics as the 301 Moved Permanently HTTP response code.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/308
 */
export const PermanentRedirect: Status = { code: 308, description: `Permanent Redirect` } as const

/**
 * Client error responses (400–499)
 * Indicates that the client seems to have erred.
 */

/**
 * The server cannot or will not process the request due to something that is perceived to be a client error.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400
 */
export const BadRequest: Status = { code: 400, description: `Bad Request` } as const

/**
 * The request has not been applied because it lacks valid authentication credentials for the target resource.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401
 */
export const Unauthorized: Status = { code: 401, description: `Unauthorized` } as const

/**
 * Reserved for future use. The original intention was that this code might be used as part of some form of digital
 * cash or micropayment scheme, but that has not happened, and this code is not usually used.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/402
 */
export const PaymentRequired: Status = { code: 402, description: `Payment Required` } as const

/**
 * The client does not have access rights to the content; that is, it is unauthorized, so the server is refusing
 * to give the requested resource. Unlike 401, the client's identity is known to the server.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403
 */
export const Forbidden: Status = { code: 403, description: `Forbidden` } as const

/**
 * The server can not find the requested resource. In the browser, this means the URL is not recognized.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
 */
export const NotFound: Status = { code: 404, description: `Not Found` } as const

/**
 * The request method is known by the server but is not supported by the target resource.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/405
 */
export const MethodNotAllowed: Status = { code: 405, description: `Method Not Allowed` } as const

/**
 * The server cannot produce a response matching the list of acceptable values defined in the request's
 * proactive content negotiation headers, and the server is unwilling to supply a default representation.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/406
 */
export const NotAcceptable: Status = { code: 406, description: `Not Acceptable` } as const

/**
 * This is similar to 401 Unauthorized but authentication is needed to be done by a proxy.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/407
 */
export const ProxyAuthenticationRequired: Status = { code: 407, description: `Proxy Authentication Required` } as const

/**
 * This response is sent on an idle connection by some servers, even without any previous request by the client.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/408
 */
export const RequestTimeout: Status = { code: 408, description: `Request Timeout` } as const

/**
 * This response is sent when a request conflicts with the current state of the server.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/409
 */
export const Conflict: Status = { code: 409, description: `Conflict` } as const

/**
 * This response is sent when the requested content has been permanently deleted from server, with no forwarding address.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/410
 */
export const Gone: Status = { code: 410, description: `Gone` } as const

/**
 * Server rejected the request because the Content-Length header field is not defined and the server requires it.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/411
 */
export const LengthRequired: Status = { code: 411, description: `Length Required` } as const

/**
 * The client has indicated preconditions in its headers which the server does not meet.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/412
 */
export const PreconditionFailed: Status = { code: 412, description: `Precondition Failed` } as const

/**
 * Request entity is larger than limits defined by server. The server may close the connection or return a Retry-After header.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/413
 */
export const PayloadTooLarge: Status = { code: 413, description: `Payload Too Large` } as const

/**
 * The URI requested by the client is longer than the server is willing to interpret.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/414
 */
export const URITooLong: Status = { code: 414, description: `URI Too Long` } as const

/**
 * The media format of the requested data is not supported by the server, so the server is rejecting the request.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/415
 */
export const UnsupportedMediaType: Status = { code: 415, description: `Unsupported Media Type` } as const

/**
 * The range specified by the Range header field in the request cannot be fulfilled.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/416
 */
export const RangeNotSatisfiable: Status = { code: 416, description: `Range Not Satisfiable` } as const

/**
 * This response code means the expectation indicated by the Expect request header field cannot be met by the server.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/417
 */
export const ExpectationFailed: Status = { code: 417, description: `Expectation Failed` } as const

/**
 * The server refuses the attempt to brew coffee with a teapot. (RFC 2324)
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/418
 */
export const ImATeapot: Status = { code: 418, description: `I'm a teapot` } as const

/**
 * The request was directed at a server that is not able to produce a response.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/421
 */
export const MisdirectedRequest: Status = { code: 421, description: `Misdirected Request` } as const

/**
 * The request was well-formed but was unable to be followed due to semantic errors.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/422
 */
export const UnprocessableEntity: Status = { code: 422, description: `Unprocessable Entity` } as const

/**
 * The resource that is being accessed is locked.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/423
 */
export const Locked: Status = { code: 423, description: `Locked` } as const

/**
 * The request failed because it depended on another request and that request failed.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/424
 */
export const FailedDependency: Status = { code: 424, description: `Failed Dependency` } as const

/**
 * Indicates that the server is unwilling to risk processing a request that might be replayed.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/425
 */
export const TooEarly: Status = { code: 425, description: `Too Early` } as const

/**
 * The server refuses to perform the request using the current protocol but might be willing to do so after
 * the client upgrades to a different protocol.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/426
 */
export const UpgradeRequired: Status = { code: 426, description: `Upgrade Required` } as const

/**
 * The origin server requires the request to be conditional.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/428
 */
export const PreconditionRequired: Status = { code: 428, description: `Precondition Required` } as const

/**
 * The user has sent too many requests in a given amount of time ("rate limiting").
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429
 */
export const TooManyRequests: Status = { code: 429, description: `Too Many Requests` } as const

/**
 * The server is unwilling to process the request because its header fields are too large.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/431
 */
export const RequestHeaderFieldsTooLarge: Status = {
  code: 431,
  description: `Request Header Fields Too Large`,
} as const

/**
 * The user requests an illegal resource, such as a web page censored by a government.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/451
 */
export const UnavailableForLegalReasons: Status = { code: 451, description: `Unavailable For Legal Reasons` } as const

/**
 * Server error responses (500–599)
 * Indicates cases in which the server is aware that it has encountered an error or is otherwise incapable of performing the request.
 */

/**
 * The server has encountered a situation it doesn't know how to handle.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/500
 */
export const InternalServerError: Status = { code: 500, description: `Internal Server Error` } as const

/**
 * The request method is not supported by the server and cannot be handled.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/501
 */
export const NotImplemented: Status = { code: 501, description: `Not Implemented` } as const

/**
 * This error response means that the server, while working as a gateway to get a response needed to handle the request,
 * got an invalid response.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/502
 */
export const BadGateway: Status = { code: 502, description: `Bad Gateway` } as const

/**
 * The server is not ready to handle the request. Common causes are a server that is down for maintenance or that is overloaded.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/503
 */
export const ServiceUnavailable: Status = { code: 503, description: `Service Unavailable` } as const

/**
 * This error response is given when the server is acting as a gateway and cannot get a response in time.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/504
 */
export const GatewayTimeout: Status = { code: 504, description: `Gateway Timeout` } as const

/**
 * The HTTP version used in the request is not supported by the server.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/505
 */
export const HTTPVersionNotSupported: Status = { code: 505, description: `HTTP Version Not Supported` } as const

/**
 * The server has an internal configuration error: the chosen variant resource is configured to engage in
 * transparent content negotiation itself, and is therefore not a proper end point in the negotiation process.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/506
 */
export const VariantAlsoNegotiates: Status = { code: 506, description: `Variant Also Negotiates` } as const

/**
 * The method could not be performed on the resource because the server is unable to store the representation needed to successfully complete the request.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/507
 */
export const InsufficientStorage: Status = { code: 507, description: `Insufficient Storage` } as const

/**
 * The server detected an infinite loop while processing the request.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/508
 */
export const LoopDetected: Status = { code: 508, description: `Loop Detected` } as const

/**
 * Further extensions to the request are required for the server to fulfill it.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/510
 */
export const NotExtended: Status = { code: 510, description: `Not Extended` } as const

/**
 * The client needs to authenticate to gain network access.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/511
 */
export const NetworkAuthenticationRequired: Status = {
  code: 511,
  description: `Network Authentication Required`,
} as const
