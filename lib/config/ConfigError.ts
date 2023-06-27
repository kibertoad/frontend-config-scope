type ErrorParams = {
  message: string
  errorCode: string
}

export class ConfigError extends Error {
  public readonly errorCode: string

  constructor(params: ErrorParams) {
    super(params.message)
    this.name = 'ConfigError'
    this.errorCode = params.errorCode
  }
}
