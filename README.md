# Recipe API 🍳

A REST API for accessing recipe data with authentication. Built with Node.js and Express.

## Quick Start

```bash
# Install dependencies
npm install

# Start server
npm start

# Development mode with auto-reload
npm run dev
```

The server runs on `http://localhost:3000`

## Authentication

All API endpoints require authentication using an API key. Include your API key in requests using either:

**Header (Recommended):**
```
x-api-key: your-api-key-here
```

**Query Parameter:**
```
?api_key=your-api-key-here
```

### Demo API Keys
- `demo-key-123`
- `recipe-api-456`

### Generate New API Key

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"name":"Your Project Name"}' \
  http://localhost:3000/api/generate-key
```

## API Endpoints

### Get All Recipes
```
GET /api/recipes
```

### Search Recipes by Name
```
GET /api/recipes/search?name=pizza
```

### Filter by Cuisine
```
GET /api/recipes/cuisine/italian
```

### Filter by Cooking Time
```
GET /api/recipes/time?max=30
```

### Search by Ingredient
```
GET /api/recipes/ingredient?name=chicken
```

### Get Recipe by ID
```
GET /api/recipes/spaghetti-carbonara
```

### Get Random Recipes
```
GET /api/random?count=3
```

### Get All Cuisines
```
GET /api/cuisines
```

## Example Usage

### JavaScript/Node.js
```javascript
const apiKey = 'your-api-key';
const baseUrl = 'http://localhost:3000';

// Get all recipes
const response = await fetch(`${baseUrl}/api/recipes`, {
  headers: {
    'x-api-key': apiKey
  }
});
const data = await response.json();
console.log(data);
```

### Python
```python
import requests

api_key = 'your-api-key'
base_url = 'http://localhost:3000'

headers = {'x-api-key': api_key}
response = requests.get(f'{base_url}/api/recipes', headers=headers)
data = response.json()
print(data)
```

### cURL
```bash
curl -H "x-api-key: demo-key-123" \
  http://localhost:3000/api/recipes/search?name=curry
```

## Available Cuisines
- Italian
- Asian  
- Mexican
- French
- Indian
- American
- Mediterranean
- Desserts

## Recipe Data Structure

```json
{
  "id": "spaghetti-carbonara",
  "name": "Spaghetti Carbonara",
  "cuisine": "italian",
  "description": "A traditional Roman pasta dish...",
  "cookingTime": 20,
  "serves": 4,
  "ingredients": [
    "400g spaghetti",
    "200g pancetta or guanciale, diced"
  ],
  "instructions": [
    "Bring a large pot of salted water to boil",
    "In a large bowl, whisk together eggs..."
  ]
}
```

## Response Format

All API responses follow this format:

```json
{
  "success": true,
  "count": 1,
  "data": [...],
  "query": "search term (if applicable)"
}
```

## Error Handling

Error responses include:

```json
{
  "success": false,
  "error": "Error message description"
}
```

## Deployment

### Environment Variables
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)

### Docker (Optional)
```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## Recipe Collection

The API includes 220+ recipes across 8 cuisines:

### Italian (2 recipes)
- Spaghetti Carbonara, Margherita Pizza

### Asian (2 recipes)  
- Chicken Fried Rice, Beef Teriyaki

### Mexican (2 recipes)
- Chicken Tacos, Guacamole

### French (2 recipes)
- Coq au Vin, French Onion Soup

### American (2 recipes)
- Classic Hamburger, Apple Pie

### Mediterranean (2 recipes)
- Greek Moussaka, Hummus

### Desserts (3 recipes)
- Chocolate Chip Cookies, Tiramisu, Crème Brûlée

### Indian (200+ recipes)
**Curries & Main Dishes**: Butter Chicken, Chicken Biryani, Dal Tadka, Palak Paneer, Chole Bhature, Rajma, Mutton Rogan Josh, Fish Curry, Paneer Butter Masala, Kadai Chicken, Mutton Keema, Bengali Fish Curry, Hyderabadi Haleem, Kashmiri Rogan Josh

**Street Food & Snacks**: Samosa, Vada Pav, Pani Puri, Bhel Puri, Aloo Tikki, Pav Bhaji, Misal Pav, Papdi Chaat, Dal Kachori, Dhokla

**South Indian Specialties**: Dosa, Idli Sambar, Medu Vada, Uttapam, Appam, Puttu, Rasam, Coconut Chutney, Kerala Fish Fry, Goan Prawn Curry

**Breads & Rice**: Aloo Paratha, Naan Bread

**Breakfast Items**: Poha, Upma

**Sweets & Desserts**: Gulab Jamun, Rasgulla, Kheer, Kulfi, Jalebi, Mysore Pak, Gajar Halwa, Rava Kesari

**Beverages**: Mango Lassi, Masala Chai

**Regional Specialties**: Rajasthani Dal Baati Churma, Gujarati Dhokla, Tandoori Chicken, Seekh Kebab, Chicken 65

*And many more authentic Indian recipes from various regions including North Indian, South Indian, Bengali, Gujarati, Rajasthani, Kashmiri, Hyderabadi, Goan, and Maharashtrian cuisines.*

## License

Open source - feel free to use for your projects!