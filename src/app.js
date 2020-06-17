const express = require('express');
const cors = require('cors');
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function verifyUUID(req, res, next) {
  if (!isUuid(req.params.id)) {
    return res.status(400).json({ error: 'Is not a valid UUID!' });
  }

  return next();
}

app.get('/repositories', (req, res) => {
  return res.json(repositories);
});

app.post('/repositories', (req, res) => {
  const { title, url, techs } = req.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs: techs.split(',').map((tech) => tech.trim()),
    likes: 0,
  };

  if (!isUuid(repository.id))
    return res.status(400).json({ error: 'Is not a valid UUID!' });

  repositories.push(repository);

  return res.status(201).json(repository);
});

app.put('/repositories/:id', verifyUUID, (req, res) => {
  const { id } = req.params;
  const { title, url, techs } = req.body;

  if (req.body.likes) {
    return res.json({ likes: 0 });
  }

  const repositoryIndex = repositories.findIndex((r) => r.id === id);

  if (repositoryIndex < 0) {
    return res.status(400).json({ error: 'Repository is not exists!' });
  }

  const repository = repositories.find((r) => r.id === id);

  const newRepository = {
    id,
    title,
    url,
    techs: techs.split(',').map((tech) => tech.trim()),
    likes: repository.likes,
  };

  repositories[repositoryIndex] = newRepository;

  return res.json(newRepository);
});

app.delete('/repositories/:id', verifyUUID, (req, res) => {
  const { id } = req.params;

  const repositoryIndex = repositories.findIndex((r) => r.id === id);

  if (repositoryIndex < 0) {
    return res.status(400).json({ error: 'Repository is not exists!' });
  }

  repositories.splice(repositoryIndex, 1);

  return res.status(204).send();
});

app.post('/repositories/:id/like', verifyUUID, (req, res) => {
  const { id } = req.params;

  const repository = repositories.find((r) => r.id === id);

  if (!repository) {
    return res.status(400).json({ error: 'Repository is not exists!' });
  }

  repository.likes += 1;

  return res.json({ likes: repository.likes });
});

module.exports = app;
