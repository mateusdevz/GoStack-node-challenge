const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");


const app = express();

app.use(express.json());
app.use(cors());

let repositories = [];

app.get("/repositories", (request, response) => {
  response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response
    .status(201)
    .json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { url, title, techs } = request.body;

  const repoIndex = repositories
    .findIndex(repo => repo.id === id);
  

  if(repoIndex < 0) {
    response
      .status(400)
      .json({ err: 'Repository not found.' });
  }

  const repo = {
    id,
    url,
    title,
    techs
  };

  repositories[repoIndex] = { ...repositories[repoIndex], ...repo };

  const updatedRepo = repositories[repoIndex];

  response.json(updatedRepo);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  
  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if(repoIndex < 0) {
    response
      .status(400)
      .json({ err: 'Repository not found.' });
  }

  repositories.splice(repoIndex, 1);

  response
    .status(204)
    .send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if(repoIndex < 0) {
    return response
      .status(400)
      .json({ err: 'Repository not found' })
  }
  
  const repo = repositories[repoIndex];
  const newLikes = repo.likes++;
  const updatedRepo = { likes: newLikes, ...repo };
  
  repositories[repoIndex] = updatedRepo;

  return response.json(updatedRepo);
});

module.exports = app;
