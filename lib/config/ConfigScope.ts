import { ConfigError } from './ConfigError'

export type EnvValueValidator<InputType> = (value: InputType) => boolean
export type EnvValueTransformer<InputType, OutputType> = (value: InputType) => OutputType

export type EnvType = {
  [key: string]: string | undefined
}

export class ConfigScope {
  private env: Record<string, string>

  constructor(envValues: Record<string, string>) {
    this.env = envValues
  }

  getMandatoryInteger(param: string): number {
    const rawValue = this.env[param]
    if (!rawValue) {
      throw new ConfigError({
        message: `Missing mandatory configuration parameter: ${param}`,
        errorCode: 'CONFIGURATION_ERROR',
      })
    }

    return validateNumber(
      Number.parseInt(rawValue),
      `Configuration parameter ${param}\` must be a number, but was ${rawValue}`,
    )
  }

  getMandatory(param: string): string {
    const result = this.env[param]
    if (!result) {
      throw new ConfigError({
        message: `Missing mandatory configuration parameter: ${param}`,
        errorCode: 'CONFIGURATION_ERROR',
      })
    }
    return result
  }

  getMandatoryOneOf<const T>(param: string, supportedValues: T[]): T {
    const result = this.getMandatory(param)
    return validateOneOf(
      result,
      supportedValues,
      `Unsupported ${param}: ${result}. Supported values: ${supportedValues.toString()}`,
    )
  }

  getOptionalNullable<T extends string | null | undefined>(
    param: string,
    defaultValue: T,
  ): T | string {
    return this.env[param] ?? defaultValue
  }

  getOptional(param: string, defaultValue: string): string {
    // Using the `||` operator instead of `??`, since '' is not a valid value, and 0 (number) is not expected here
    return this.env[param] || defaultValue
  }

  getOptionalInteger(param: string, defaultValue: number): number {
    const rawValue = this.env[param]
    if (!rawValue) {
      return defaultValue
    }
    return validateNumber(
      Number.parseInt(rawValue),
      `Configuration parameter ${param}\` must be a number, but was ${rawValue}`,
    )
  }

  getOptionalNullableInteger<T extends number | null | undefined>(
    param: string,
    defaultValue: T,
  ): T | number {
    const rawValue = this.env[param]
    if (!rawValue) {
      return defaultValue
    }
    return validateNumber(
      Number.parseInt(rawValue),
      `Configuration parameter ${param}\` must be a number, but was ${rawValue}`,
    )
  }

  getOptionalBoolean(param: string, defaultValue: boolean): boolean {
    const rawValue = this.env[param]?.toLowerCase()
    if (rawValue === undefined || rawValue === '') {
      return defaultValue
    }

    validateOneOf(rawValue, ['true', 'false'])

    return rawValue === 'true'
  }

  isProduction(): boolean {
    return this.env.NODE_ENV === 'production'
  }

  isDevelopment(): boolean {
    return this.env.NODE_ENV !== 'production'
  }

  isTest(): boolean {
    return this.env.NODE_ENV === 'test'
  }
}

export function validateOneOf<const T>(
  validatedEntity: unknown,
  expectedOneOfEntities: T[],
  errorText?: string,
): T {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  if (!expectedOneOfEntities.includes(validatedEntity as T)) {
    throw new ConfigError({
      message:
        errorText ||
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `Validated entity ${validatedEntity} is not one of: ${expectedOneOfEntities.toString()}`,
      errorCode: 'CONFIGURATION_ERROR',
    })
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return validatedEntity as T
}

export function validateNumber(validatedObject: unknown, errorText: string): number {
  if (!Number.isFinite(validatedObject)) {
    throw new ConfigError({
      message: errorText,
      errorCode: 'CONFIGURATION_ERROR',
    })
  }
  return validatedObject as number
}
