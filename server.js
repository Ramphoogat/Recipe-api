const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
require('dotenv').config();

const recipes = require('./recipes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const API_KEYS = {
    'demo-key-123': { name: 'Demo User', active: true },
    'recipe-api-456': { name: 'Default User', active: true }
};

function generateApiKey() {
    return 'rapi_' + crypto.randomBytes(16).toString('hex');
}

function validateApiKey(req, res, next) {
    const apiKey = req.headers['x-api-key'] || req.query.api_key;
    
    if (!apiKey) {
        return res.status(401).json({
            success: false,
            error: 'API key required. Include in header as "x-api-key" or query parameter "api_key"'
        });
    }
    
    if (!API_KEYS[apiKey] || !API_KEYS[apiKey].active) {
        return res.status(403).json({
            success: false,
            error: 'Invalid or inactive API key'
        });
    }
    
    req.apiUser = API_KEYS[apiKey];
    next();
}

app.get('/', (req, res) => {
    res.json({
        message: 'Recipe API Server',
        version: '1.0.0',
        documentation: 'Use /api endpoints with valid API key',
        endpoints: {
            'GET /api/recipes': 'Get all recipes',
            'GET /api/recipes/:id': 'Get recipe by ID',
            'GET /api/recipes/search': 'Search recipes by name (?name=)',
            'GET /api/recipes/cuisine/:cuisine': 'Filter by cuisine',
            'GET /api/recipes/time': 'Filter by cooking time (?max=)',
            'GET /api/recipes/ingredient': 'Search by ingredient (?name=)',
            'GET /api/random': 'Get random recipes (?count=)',
            'GET /api/cuisines': 'Get all available cuisines'
        },
        authentication: 'Include API key in header "x-api-key" or query parameter "api_key"',
        demo_keys: ['demo-key-123', 'recipe-api-456']
    });
});

app.get('/api/recipes', validateApiKey, (req, res) => {
    res.json({
        success: true,
        count: recipes.length,
        data: recipes
    });
});

app.get('/api/recipes/search', validateApiKey, (req, res) => {
    const { name } = req.query;
    
    if (!name) {
        return res.status(400).json({
            success: false,
            error: 'Name parameter is required'
        });
    }
    
    const results = recipes.filter(recipe => 
        recipe.name.toLowerCase().includes(name.toLowerCase())
    );
    
    res.json({
        success: true,
        count: results.length,
        query: name,
        data: results
    });
});

app.get('/api/recipes/cuisine/:cuisine', validateApiKey, (req, res) => {
    const { cuisine } = req.params;
    
    const results = recipes.filter(recipe => 
        recipe.cuisine.toLowerCase() === cuisine.toLowerCase()
    );
    
    res.json({
        success: true,
        count: results.length,
        cuisine: cuisine,
        data: results
    });
});

app.get('/api/recipes/time', validateApiKey, (req, res) => {
    const { max } = req.query;
    
    if (!max || max <= 0) {
        return res.status(400).json({
            success: false,
            error: 'Valid max parameter is required'
        });
    }
    
    const results = recipes.filter(recipe => 
        recipe.cookingTime <= parseInt(max)
    );
    
    res.json({
        success: true,
        count: results.length,
        maxTime: parseInt(max),
        data: results
    });
});

app.get('/api/recipes/ingredient', validateApiKey, (req, res) => {
    const { name } = req.query;
    
    if (!name) {
        return res.status(400).json({
            success: false,
            error: 'Ingredient name parameter is required'
        });
    }
    
    const results = recipes.filter(recipe => 
        recipe.ingredients.some(ing => 
            ing.toLowerCase().includes(name.toLowerCase())
        )
    );
    
    res.json({
        success: true,
        count: results.length,
        ingredient: name,
        data: results
    });
});

app.get('/api/recipes/:id', validateApiKey, (req, res) => {
    const { id } = req.params;
    
    const recipe = recipes.find(recipe => recipe.id === id);
    
    if (!recipe) {
        return res.status(404).json({
            success: false,
            error: 'Recipe not found'
        });
    }
    
    res.json({
        success: true,
        data: recipe
    });
});

app.get('/api/random', validateApiKey, (req, res) => {
    const count = parseInt(req.query.count) || 3;
    const maxCount = Math.min(count, recipes.length);
    
    const shuffled = [...recipes].sort(() => 0.5 - Math.random());
    
    res.json({
        success: true,
        count: maxCount,
        data: shuffled.slice(0, maxCount)
    });
});

app.get('/api/cuisines', validateApiKey, (req, res) => {
    const cuisines = [...new Set(recipes.map(r => r.cuisine))];
    
    res.json({
        success: true,
        count: cuisines.length,
        data: cuisines
    });
});

app.post('/api/generate-key', (req, res) => {
    const { name } = req.body;
    
    if (!name) {
        return res.status(400).json({
            success: false,
            error: 'Name is required to generate API key'
        });
    }
    
    const newKey = generateApiKey();
    API_KEYS[newKey] = { name, active: true };
    
    res.json({
        success: true,
        message: 'API key generated successfully',
        api_key: newKey,
        name: name
    });
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found'
    });
});

app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

app.listen(PORT, () => {
    console.log(`🍳 Recipe API Server running on port ${PORT}`);
    console.log(`📖 Documentation: http://localhost:${PORT}`);
    console.log(`🔑 Demo API Keys: demo-key-123, recipe-api-456`);
});