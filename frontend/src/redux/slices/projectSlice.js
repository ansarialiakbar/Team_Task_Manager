import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/api';

export const fetchProjects = createAsyncThunk('projects/fetchAll', async () => {
  const res = await API.get('/projects');
  return res.data;
});

export const createProject = createAsyncThunk('projects/create', async (projectData) => {
  const res = await API.post('/projects', projectData);
  return res.data;
});

const projectSlice = createSlice({
  name: 'projects',
  initialState: { projects: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => { state.loading = true; })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.unshift(action.payload);
      });
  }
});

export default projectSlice.reducer;