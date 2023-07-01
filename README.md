# frontend-config-scope

Config management for the frontend

## Basic example

```ts
import { ConfigScope } from "frontend-config-scope";

const envVars = {
	...import.meta.env,
};

const config = new ConfigScope(envVars);

export const SOME_API_URL = config.getMandatory("API_URL"); // this will throw an error if not set
export const BUGSNAG_API_KEY = config.getOptional("VITE_BUGSNAG_API_KEY", ""); // this will use default value if not set
export const ENV = config.getMandatoryOneOf("VITE_ENV", ["local", "development", "production"]); // this will throw an error if not one of the supported values
```
