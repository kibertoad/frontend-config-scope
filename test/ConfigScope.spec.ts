import type { EnvValueTransformer, EnvValueValidator } from '../lib/config/ConfigScope.js'
import { ConfigScope } from '../lib/config/ConfigScope.js'

export const createRangeValidator = (
  greaterOrEqualThan: number,
  lessOrEqualThan: number,
): EnvValueValidator<number> => {
  return (value) => {
    return value >= greaterOrEqualThan && value <= lessOrEqualThan
  }
}

export const ensureClosingSlashTransformer: EnvValueTransformer<
  string | undefined | null,
  string
> = (value) => {
  if (!value) {
    return ''
  }

  const lastChar = value.at(-1)
  if (lastChar !== '/') {
    return `${value}/`
  }
  return value
}

describe('ConfigScope', () => {
  describe('getMandatoryInteger', () => {
    it('accepts an integer', () => {
      const configEnv = {
        value: '123',
      }
      const configScope = new ConfigScope(configEnv)

      const resolvedValue = configScope.getMandatoryInteger('value')

      expect(resolvedValue).toBe(123)
    })

    it('throws an error on non-number', () => {
      const configEnv = {
        value: 'abc',
      }
      const configScope = new ConfigScope(configEnv)

      expect(() => configScope.getMandatoryInteger('value')).toThrow(/must be a number/)
    })

    it('throws an error on missing value', () => {
      const configEnv = {}
      const configScope = new ConfigScope(configEnv)

      expect(() => configScope.getMandatoryInteger('value')).toThrow(
        /Missing mandatory configuration parameter/,
      )
    })
  })

  describe('getMandatory', () => {
    it('accepts an integer', () => {
      const configEnv = {
        value: '123',
      }
      const configScope = new ConfigScope(configEnv)

      const resolvedValue = configScope.getMandatory('value')

      expect(resolvedValue).toBe('123')
    })

    it('throws an error on missing value', () => {
      const configEnv = {}
      const configScope = new ConfigScope(configEnv)

      expect(() => configScope.getMandatory('value')).toThrow(
        /Missing mandatory configuration parameter/,
      )
    })
  })

  describe('getMandatoryOneOf', () => {
    it('accepts item from given list', () => {
      const configEnv = {
        value: 'g',
      }
      const configScope = new ConfigScope(configEnv)

      const resolvedValue = configScope.getMandatoryOneOf('value', ['a', 'g', 'b'])

      expect(resolvedValue).toBe('g')
    })

    it('throws an error on item not from list', () => {
      const configEnv = {
        value: 'c',
      }
      const configScope = new ConfigScope(configEnv)

      expect(() => configScope.getMandatoryOneOf('value', ['a', 'g', 'b'])).toThrow(
        /Unsupported value/,
      )
    })

    it('throws an error on missing value', () => {
      const configEnv = {}
      const configScope = new ConfigScope(configEnv)

      expect(() => configScope.getMandatoryOneOf('value', ['a'])).toThrow(
        /Missing mandatory configuration parameter/,
      )
    })
  })

  describe('getOptionalNullable', () => {
    it('accepts value', () => {
      const configEnv = {
        value: 'val',
      }
      const configScope = new ConfigScope(configEnv)

      const resolvedValue = configScope.getOptionalNullable('value', 'def')

      expect(resolvedValue).toBe('val')
    })

    it('uses default value if not set', () => {
      const configEnv = {}
      const configScope = new ConfigScope(configEnv)

      const resolvedValue = configScope.getOptionalNullable('value', 'def')

      expect(resolvedValue).toBe('def')
    })

    it('keeps null if preferred', () => {
      const configEnv = {}
      const configScope = new ConfigScope(configEnv)

      const resolvedValue = configScope.getOptionalNullable('value', null)

      expect(resolvedValue).toBeNull()
    })
  })

  describe('getOptional', () => {
    it('accepts value', () => {
      const configEnv = {
        value: 'val',
      }
      const configScope = new ConfigScope(configEnv)

      const resolvedValue = configScope.getOptional('value', 'def')

      expect(resolvedValue).toBe('val')
    })

    it('uses default value if not set', () => {
      const configEnv = {}
      const configScope = new ConfigScope(configEnv)

      const resolvedValue = configScope.getOptional('value', 'def')

      expect(resolvedValue).toBe('def')
    })

    // This case can happen when variable is in .env file, but is left empty.
    // Just like this:
    // VAR1=
    it('uses default value if set to empty string', () => {
      const configEnv = {
        value: '',
      }
      const configScope = new ConfigScope(configEnv)

      const resolvedValue = configScope.getOptional('value', 'def')

      expect(resolvedValue).toBe('def')
    })

    it('returns false if set to false', () => {
      const configEnv = {
        value: 'false',
      }
      const configScope = new ConfigScope(configEnv)

      const resolvedValue = configScope.getOptional('value', 'def')

      expect(resolvedValue).toBe('false')
    })

    it('returns 0 if set to 0', () => {
      const configEnv = {
        value: '0',
      }
      const configScope = new ConfigScope(configEnv)

      const resolvedValue = configScope.getOptional('value', 'def')

      expect(resolvedValue).toBe('0')
    })

    it('returns undefined if set to undefined', () => {
      const configEnv = {
        value: 'undefined',
      }
      const configScope = new ConfigScope(configEnv)

      const resolvedValue = configScope.getOptional('value', 'def')

      expect(resolvedValue).toBe('undefined')
    })

    it('returns null if set to null', () => {
      const configEnv = {
        value: 'null',
      }
      const configScope = new ConfigScope(configEnv)

      const resolvedValue = configScope.getOptional('value', 'def')

      expect(resolvedValue).toBe('null')
    })
  })

  describe('getOptionalInteger', () => {
    it('accepts value', () => {
      const configEnv = {
        value: '3',
      }
      const configScope = new ConfigScope(configEnv)

      const resolvedValue = configScope.getOptionalInteger('value', 1)

      expect(resolvedValue).toBe(3)
    })

    it('uses default value if not set', () => {
      const configEnv = {}
      const configScope = new ConfigScope(configEnv)

      const resolvedValue = configScope.getOptionalInteger('value', 1)

      expect(resolvedValue).toBe(1)
    })
  })

  describe('getOptionalNullableInteger', () => {
    it('accepts value', () => {
      const configEnv = {
        value: '3',
      }
      const configScope = new ConfigScope(configEnv)

      const resolvedValue = configScope.getOptionalNullableInteger('value', 1)

      expect(resolvedValue).toBe(3)
    })

    it('uses default value if not set', () => {
      const configEnv = {}
      const configScope = new ConfigScope(configEnv)

      const resolvedValue = configScope.getOptionalNullableInteger('value', 1)

      expect(resolvedValue).toBe(1)
    })

    it('uses default undefined value if not set', () => {
      const configEnv = {}
      const configScope = new ConfigScope(configEnv)

      const resolvedValue = configScope.getOptionalNullableInteger('value', undefined)

      expect(resolvedValue).toBeUndefined()
    })

    it('uses default null value if not set', () => {
      const configEnv = {}
      const configScope = new ConfigScope(configEnv)

      const resolvedValue = configScope.getOptionalNullableInteger('value', null)

      expect(resolvedValue).toBeNull()
    })
  })

  describe('getOptionalBoolean', () => {
    it('accepts true', () => {
      const configEnv = {
        value: 'true',
      }
      const configScope = new ConfigScope(configEnv)

      const resolvedValue = configScope.getOptionalBoolean('value', false)

      expect(resolvedValue).toBe(true)
    })

    it('accepts false', () => {
      const configEnv = {
        value: 'false',
      }
      const configScope = new ConfigScope(configEnv)

      const resolvedValue = configScope.getOptionalBoolean('value', true)

      expect(resolvedValue).toBe(false)
    })

    it('uses default value if not set', () => {
      const configEnv = {}
      const configScope = new ConfigScope(configEnv)

      const resolvedValue = configScope.getOptionalBoolean('value', true)

      expect(resolvedValue).toBe(true)
    })

    it('uses default value if empty string', () => {
      const configEnv = {
        value: '',
      }
      const configScope = new ConfigScope(configEnv)

      const resolvedValue = configScope.getOptionalBoolean('value', true)

      expect(resolvedValue).toBe(true)
    })

    it('throws an error if not a boolean', () => {
      const configEnv = {
        value: '1',
      }
      const configScope = new ConfigScope(configEnv)

      expect(() => configScope.getOptionalBoolean('value', false)).toThrow(
        /Validated entity 1 is not one of: true,false/,
      )
    })
  })

  describe('isProduction', () => {
    it('returns true if set to production', () => {
      const configEnv = {
        NODE_ENV: 'production',
      }
      const configScope = new ConfigScope(configEnv)

      expect(configScope.isProduction()).toBe(true)
    })

    it('returns true if set to development', () => {
      const configEnv = {
        NODE_ENV: 'development',
      }
      const configScope = new ConfigScope(configEnv)

      expect(configScope.isProduction()).toBe(false)
    })

    it('returns true if set to test', () => {
      const configEnv = {
        NODE_ENV: 'test',
      }
      const configScope = new ConfigScope(configEnv)

      expect(configScope.isProduction()).toBe(false)
    })
  })

  describe('isDevelopment', () => {
    it('returns true if set to production', () => {
      const configEnv = {
        NODE_ENV: 'production',
      }
      const configScope = new ConfigScope(configEnv)

      expect(configScope.isDevelopment()).toBe(false)
    })

    it('returns true if set to development', () => {
      const configEnv = {
        NODE_ENV: 'development',
      }
      const configScope = new ConfigScope(configEnv)

      expect(configScope.isDevelopment()).toBe(true)
    })

    it('returns true if set to test', () => {
      const configEnv = {
        NODE_ENV: 'test',
      }
      const configScope = new ConfigScope(configEnv)

      expect(configScope.isDevelopment()).toBe(true)
    })
  })

  describe('isTest', () => {
    it('returns true if set to production', () => {
      const configEnv = {
        NODE_ENV: 'production',
      }
      const configScope = new ConfigScope(configEnv)

      expect(configScope.isTest()).toBe(false)
    })

    it('returns true if set to development', () => {
      const configEnv = {
        NODE_ENV: 'development',
      }
      const configScope = new ConfigScope(configEnv)

      expect(configScope.isTest()).toBe(false)
    })

    it('returns true if set to test', () => {
      const configEnv = {
        NODE_ENV: 'test',
      }
      const configScope = new ConfigScope(configEnv)

      expect(configScope.isTest()).toBe(true)
    })
  })
})
