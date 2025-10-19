# Translation Service API Examples

## 🎯 Retrieve Translated Text

### Endpoint
```
POST /translation/translate
```

### Basic Example (Minimal Required Data)
```json
{
  "text": "my text",
  "targetLanguage": "en"
}
```

### Response (From Cache)
```json
{
  "translatedText": "mi texto",
  "fromCache": true
}
```

### Response (New Translation)
```json
{
  "translatedText": "mi texto",
  "fromCache": false
}
```

---

## 📋 Complete Examples

### Example 1: Simple Translation
**Request:**
```bash
curl -X POST http://localhost:3005/translation/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello World",
    "targetLanguage": "es"
  }'
```

**Request Body:**
```json
{
  "text": "Hello World",
  "targetLanguage": "es"
}
```

**Response:**
```json
{
  "translatedText": "Hola Mundo",
  "fromCache": false
}
```

**What Happens:**
1. Generates MD5 key: `MD5("Hello World_es")` → `"abc123def456..."`
2. Checks database for existing translation
3. If not found, performs translation and saves it
4. Returns translated text

---

### Example 2: Translation with Source Language
**Request:**
```json
{
  "text": "Bonjour",
  "targetLanguage": "en",
  "sourceLanguage": "fr"
}
```

**Response:**
```json
{
  "translatedText": "Hello",
  "fromCache": true
}
```

---

### Example 3: Translation with Context (Full Data)
**Request:**
```json
{
  "text": "Save",
  "targetLanguage": "es",
  "sourceLanguage": "en",
  "context": {
    "category": "ui",
    "module": "customer-management",
    "component": "save-button",
    "field": "label"
  }
}
```

**Response:**
```json
{
  "translatedText": "Guardar",
  "fromCache": true
}
```

**Context Usage:**
- Helps differentiate translations (e.g., "Save" as verb vs. "Save" as noun)
- Useful for organizing translations by module/component
- Can be used for filtering and searching translations

---

### Example 4: Multiple Languages
**Spanish:**
```json
{
  "text": "Welcome to our application",
  "targetLanguage": "es"
}
```
Response: `{ "translatedText": "Bienvenido a nuestra aplicación", "fromCache": false }`

**French:**
```json
{
  "text": "Welcome to our application",
  "targetLanguage": "fr"
}
```
Response: `{ "translatedText": "Bienvenue dans notre application", "fromCache": false }`

**German:**
```json
{
  "text": "Welcome to our application",
  "targetLanguage": "de"
}
```
Response: `{ "translatedText": "Willkommen in unserer Anwendung", "fromCache": false }`

---

## 🔄 Batch Translation

### Endpoint
```
POST /translation/translate/batch
```

### Example: Translate Multiple Texts
**Request:**
```json
{
  "texts": [
    "Hello",
    "Goodbye",
    "Thank you"
  ],
  "targetLanguage": "es",
  "sourceLanguage": "en"
}
```

**Response:**
```json
{
  "translations": [
    {
      "text": "Hello",
      "translatedText": "Hola",
      "fromCache": true
    },
    {
      "text": "Goodbye",
      "translatedText": "Adiós",
      "fromCache": true
    },
    {
      "text": "Thank you",
      "translatedText": "Gracias",
      "fromCache": false
    }
  ]
}
```

---

## 🗄️ How It Works (Behind the Scenes)

### Step-by-Step Flow

1. **Receive Request**
```json
POST /translation/translate
{
  "text": "my text",
  "targetLanguage": "en"
}
```

2. **Validate Input**
- Check text is not empty
- Validate language code format (ISO 639-1)

3. **Find Target Language**
```sql
SELECT * FROM languages WHERE code = 'en' AND status = 'active'
```

4. **Generate MD5 Key**
```typescript
keyData = "my text_en"  // Combine text + languageCode
key = MD5(keyData)      // "7f8b9e4a3c2d1e0f9a8b7c6d5e4f3a2b"
```

5. **Check Cache (Database)**
```sql
SELECT * FROM language_values 
WHERE `key` = '7f8b9e4a3c2d1e0f9a8b7c6d5e4f3a2b' 
  AND languageCode = 'en'
```

6. **Return Result**

   **A. If Found (Cache Hit):**
   ```typescript
   // Increment usage
   UPDATE language_values 
   SET usageCount = usageCount + 1, 
       lastUsedAt = NOW() 
   WHERE id = 123;
   
   // Return
   {
     "translatedText": "mi texto",
     "fromCache": true
   }
   ```

   **B. If Not Found (Cache Miss):**
   ```typescript
   // Perform translation (API call/service)
   translatedText = translateAPI("my text", "en");
   
   // Save to database
   INSERT INTO language_values (
     `key`, original, destination, languageCode, 
     isApproved, usageCount, createdAt, updatedAt
   ) VALUES (
     '7f8b9e4a3c2d1e0f9a8b7c6d5e4f3a2b',
     'my text',
     'mi texto',
     'en',
     FALSE,
     0,
     NOW(),
     NOW()
   );
   
   // Return
   {
     "translatedText": "mi texto",
     "fromCache": false
   }
   ```

---

## 📊 Database Structure

### Created Record Example
After first translation request, the database contains:

**languages table:**
```
+------+----------+-----------+--------+------+-----------+
| code | name     | localName | status | flag | isDefault |
+------+----------+-----------+--------+------+-----------+
| en   | English  | English   | active | 🇺🇸  | true      |
| es   | Spanish  | Español   | active | 🇪🇸  | false     |
+------+----------+-----------+--------+------+-----------+
```

**language_values table:**
```
+----+----------------------------------+---------+-------------+--------------+------------+------------+
| id | key                              | original| destination | languageCode | isApproved | usageCount |
+----+----------------------------------+---------+-------------+--------------+------------+------------+
| 1  | 7f8b9e4a3c2d1e0f9a8b7c6d5e4f3a2b | my text | mi texto    | en           | false      | 0          |
+----+----------------------------------+---------+-------------+--------------+------------+------------+
```

---

## 🔍 Query Translation Statistics

### Get Statistics for a Language
**Endpoint:** `GET /translation/translate/stats/:languageCode`

**Request:**
```bash
curl http://localhost:3005/translation/translate/stats/en
```

**Response:**
```json
{
  "languageCode": "en",
  "totalTranslations": 150,
  "approvedTranslations": 120,
  "pendingTranslations": 30,
  "cacheHitRate": 80.0
}
```

---

## 🌍 Available Languages

### Get All Active Languages
**Endpoint:** `GET /translation/languages/active`

**Response:**
```json
[
  {
    "code": "en",
    "name": "English",
    "localName": "English",
    "status": "active",
    "flag": "🇺🇸",
    "isDefault": true
  },
  {
    "code": "es",
    "name": "Spanish",
    "localName": "Español",
    "status": "active",
    "flag": "🇪🇸",
    "isDefault": false
  },
  {
    "code": "fr",
    "name": "French",
    "localName": "Français",
    "status": "active",
    "flag": "🇫🇷",
    "isDefault": false
  }
]
```

---

## ⚠️ Error Examples

### Invalid Language Code
**Request:**
```json
{
  "text": "Hello",
  "targetLanguage": "invalid"
}
```

**Response (404):**
```json
{
  "statusCode": 404,
  "message": "Language invalid not found",
  "error": "Not Found"
}
```

### Empty Text
**Request:**
```json
{
  "text": "",
  "targetLanguage": "en"
}
```

**Response (400):**
```json
{
  "statusCode": 400,
  "message": "Text must be a non-empty string",
  "error": "Bad Request"
}
```

### Missing Required Field
**Request:**
```json
{
  "targetLanguage": "en"
}
```

**Response (400):**
```json
{
  "statusCode": 400,
  "message": [
    "text must be a string",
    "text should not be empty"
  ],
  "error": "Bad Request"
}
```

---

## 🧪 Testing with Postman/cURL

### Postman Collection
Import the collection: `Fullstack-Project-API.postman_collection.json`

### cURL Examples

**Basic Translation:**
```bash
curl -X POST http://localhost:3005/translation/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"my text","targetLanguage":"en"}'
```

**With Context:**
```bash
curl -X POST http://localhost:3005/translation/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Save",
    "targetLanguage": "es",
    "context": {
      "category": "ui",
      "module": "customer-management"
    }
  }'
```

**Batch Translation:**
```bash
curl -X POST http://localhost:3005/translation/translate/batch \
  -H "Content-Type: application/json" \
  -d '{
    "texts": ["Hello", "Goodbye", "Thank you"],
    "targetLanguage": "es"
  }'
```

---

## 📝 Request Body Schema

### TranslateTextDto
```typescript
{
  text: string;              // Required: Text to translate
  targetLanguage: string;    // Required: Target language code (e.g., 'en', 'es')
  sourceLanguage?: string;   // Optional: Source language code
  context?: {                // Optional: Translation context
    category?: string;       // e.g., 'ui', 'email', 'notification'
    module?: string;         // e.g., 'customer-management'
    component?: string;      // e.g., 'save-button'
    field?: string;          // e.g., 'label'
  };
}
```

### Validation Rules
- `text`: Must be non-empty string, max 5000 characters
- `targetLanguage`: Must be valid ISO 639-1 code (2 letters)
- `sourceLanguage`: Optional, must be valid ISO 639-1 code if provided
- `context`: Optional object with string properties

---

**Service URL:** `http://localhost:3005/translation`  
**API Version:** v1  
**Last Updated:** October 19, 2025
