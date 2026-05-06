import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/api';

export const fetchTasks = createAsyncThunk('tasks/fetchAll', async (projectId = null) => {
  const url = projectId ? `/tasks?project=${projectId}` : '/tasks';
  const res = await API.get(url);
  return res.data;
});

export const createTask = createAsyncThunk('tasks/create', async (taskData) => {
  const res = await API.post('/tasks', taskData);
  return res.data;
});

export const updateTask = createAsyncThunk('tasks/update', async ({ id, ...data }) => {
  const res = await API.put(`/tasks/${id}`, data);
  return res.data;
});

export const updateTaskStatus = createAsyncThunk(
  'tasks/updateStatus',
  async ({ id, status }) => {
    const res = await API.patch(`/tasks/${id}/status`, { status }); 
    return res.data;
  }
);

export const deleteTask = createAsyncThunk('tasks/delete', async (id) => {
  await API.delete(`/tasks/${id}`);
  return id;
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState: { 
    tasks: [], 
    loading: false,
    error: null 
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => { state.loading = true; })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.unshift(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(t => t._id === action.payload._id);
        if (index !== -1) state.tasks[index] = action.payload;
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(t => t._id === action.payload._id);
        if (index !== -1) state.tasks[index] = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(t => t._id !== action.payload);
      });
  }
});

export default taskSlice.reducer;