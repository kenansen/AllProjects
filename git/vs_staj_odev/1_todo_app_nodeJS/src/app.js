const express = require('express');
const swaggerUi = require('swagger-ui-express');
const todoRoutes = require('./routes/todo.routes');

const app = express();
app.use(express.json());

// Swagger Dökümantasyonu (JSON Nesnesi Olarak)
const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Todo API',
    version: '1.0.0',
    description: 'Node.js Todo CRUD API Assignment',
  },
  paths: {
    '/todo-list': {
      get: {
        summary: 'Tüm görevleri getirir',
        responses: { 200: { description: 'Başarılı' } }
      },
      post: {
        summary: 'Yeni görev oluşturur',
        responses: { 201: { description: 'Oluşturuldu' } }
      }
    },
    '/todo-list/{id}': {
      put: {
        summary: 'Görevi günceller',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Güncellendi' } }
      },
      delete: {
        summary: 'Görevi siler',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Silindi' } }
      }
    }
  }
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/todo-list', todoRoutes);

module.exports = app;