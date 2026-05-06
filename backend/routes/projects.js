const express = require('express');
const { 
  createProject, getProjects, getProjectById, 
  updateProject, deleteProject, addMember 
} = require('../controllers/projectController');
const protect = require('../middleware/auth');
const authorize = require('../middleware/role');

const router = express.Router();

router.use(protect); // All routes protected

router.route('/')
  .get(getProjects)
  .post(createProject);

router.route('/:id')
  .get(getProjectById)
  .put(updateProject)
  .delete(deleteProject);

router.post('/:id/members', addMember);

module.exports = router;