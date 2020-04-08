const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;
  const newRepository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(newRepository);

  return response.json(newRepository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs, likes } = request.body;

  if (likes) {
    return response.json({likes:0});
  }

  const repIndex = repositories.findIndex(repository => repository.id === id);

  if (repIndex < 0) {
    return response.status(400).json({error: "Repository not found"});
  }

  const repository = {
    id,
    title,
    url,
    techs
  };

  repositories[repIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;

  const repIndex = repositories.findIndex(repository => repository.id === id);

  if (repIndex < 0) {
    return res.status(400).json({error: "Repository not found"});
  }

  repositories.splice(repIndex, 1);

  return res.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repIndex = repositories.findIndex(repository => repository.id === id);

  if (repIndex < 0) {
    return response.status(400).json({error: "Repository not found"});
  }

  repositories[repIndex].likes++;

  return response.json(repositories[repIndex]);

});

module.exports = app;
