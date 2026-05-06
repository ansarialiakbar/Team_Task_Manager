const Project = require('../models/Project');
const User = require('../models/User');

// Create Project
exports.createProject = async (req, res) => {
  try {
    const project = await Project.create({
      ...req.body,
      owner: req.user.id,
      members: [{ user: req.user.id, role: 'Admin' }]
    });

    const populated = await project.populate('members.user', 'name email role');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All Projects for User
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { owner: req.user.id },
        { 'members.user': req.user.id }
      ]
    }).populate('members.user', 'name email')
      .populate('owner', 'name email');

    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Single Project
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('members.user', 'name email')
      .populate('owner', 'name email');

    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Check if user is member
    const isMember = project.members.some(m => m.user._id.toString() === req.user.id);
    if (!isMember && project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add Member to Project (Admin Only)
exports.addMember = async (req, res) => {
  try {
    const { userId, role = 'Member' } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Check if requester is Admin in project
    const isAdmin = project.members.some(m => 
      m.user.toString() === req.user.id && m.role === 'Admin'
    );

    if (!isAdmin) return res.status(403).json({ message: 'Only Admins can add members' });

    const userExists = await User.findById(userId);
    if (!userExists) return res.status(404).json({ message: 'User not found' });

    // Check if already member
    if (project.members.some(m => m.user.toString() === userId)) {
      return res.status(400).json({ message: 'User is already a member' });
    }

    project.members.push({ user: userId, role });
    await project.save();

    const updated = await project.populate('members.user', 'name email');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update & Delete Project (Admin Only)
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const isAdmin = project.members.some(m => 
      m.user.toString() === req.user.id && m.role === 'Admin'
    );

    if (!isAdmin) return res.status(403).json({ message: 'Access denied' });

    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const isAdmin = project.members.some(m => 
      m.user.toString() === req.user.id && m.role === 'Admin'
    );

    if (!isAdmin) return res.status(403).json({ message: 'Access denied' });

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};