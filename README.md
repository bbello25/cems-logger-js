# Cems logger

Error logging and vizualization

## Installation

```npm
npm i @bbellovic/cems-logger-js
```

## Usage

### UMD Modules

```html
<script src='./node_modules/@bbellovic/cems-logger-js/dist/umd/CemsLogger.js'></script>
```

### ES2015 Modules

```javascript
import { CemsLogger } from '@bbellovic/cems-logger-js/dist/es2015/CemsLogger';
```

Esm and cjs builds can be found in `dist/` folder

### Example with setup

```typescript
const logger = CemsLogger.initLogger({
  apiKey: '<YOUR API KEY>'
})
try {
  throw new Error('Demo app')
} catch (e) {
  logger.sendLog(e)
}
```

A logger accepts the following parameters:

| Name          | Default                    | Description                                                                 |
| ------------- | -------------------------- | --------------------------------------------------------------------------- |
| `apiKey`      | `''`                       | API key for authentication against end point                                |
| `endPointUrl` | `'http://localhost:5000/'` | CEMS Api URL                                                                |
| `email`       | `''`                       | (currently doesn't have any usage)                                          |
| `appName`     | `'unknown'`                | app of your name under which will be logs displayed in cems web applicaiton |