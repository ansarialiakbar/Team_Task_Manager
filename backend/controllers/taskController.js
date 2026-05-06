const Task = require('../models/Task');
const Project = require('../models/Project');

const isProjectMember = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) return false;
  return project.members.some(m => m.user.toString() === userId) || 
         project.owner.toString() === userId;
};

// Get Tasks (User's tasks or by project)
exports.getTasks = async (req, res) => {
  try {
    const { project } = req.query;
    let query = {};

    if (project) {
      query.project = project;
      const isMember = await isProjectMember(project, req.user.id);
      if (!isMember) return res.status(403).json({ message: 'Access denied' });
    } else {
      // Get all tasks assigned to user
      query.assignedTo = req.user.id;
    }

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .populate('project', 'name');

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { project } = req.body;
    const isMember = await isProjectMember(project, req.user.id);

    if (!isMember) return res.status(403).json({ message: 'Access denied' });

    const task = await Task.create({
      ...req.body,
      assignedTo: req.body.assignedTo || req.user.id
    });

    const populated = await task.populate('assignedTo', 'name email');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const isMember = await isProjectMember(task.project, req.user.id);
    if (!isMember) return res.status(403).json({ message: 'Access denied' });

    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('assignedTo', 'name email');

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const isMember = await isProjectMember(task.project, req.user.id);
    if (!isMember) return res.status(403).json({ message: 'Access denied' });

    task.status = status;
    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const isMember = await isProjectMember(task.project, req.user.id);
    if (!isMember) return res.status(403).json({ message: 'Access denied' });

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};