import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

// получаем все посты с бэка
export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const { data } = await axios.get("/posts");
  return data;
});

// получаем все тэги с бэка
export const fetchTags = createAsyncThunk("posts/fetchTags", async () => {
  const { data } = await axios.get("/tags");
  return data;
});

const initialState = {
  posts: {
    items: [],
    status: "loading",
  },
  tags: {
    items: [],
    status: "loading",
  },
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: {
    // отлавливаем состояния загрузки постов с бэка
    // в то время, когда происходит загрузка
    [fetchPosts.pending]: (state) => {
      // обнуляем массив с постами
      state.posts.items = [];
      // меняем текст сообщения
      state.posts.status = "loading";
    },
    // в то время, когда всё загрузилось
    [fetchPosts.fulfilled]: (state, action) => {
      // пихаем полученные при запросе посты в state
      state.posts.items = action.payload;
      state.posts.status = "loaded";
    },
    // в то время, когда произошла ошибка
    [fetchPosts.rejected]: (state) => {
      // обнуляем массив с постами
      state.posts.items = [];
      state.posts.status = "error";
    },
    // Теги
    [fetchTags.pending]: (state) => {
      state.tags.items = [];
      state.tags.status = "loading";
    },

    [fetchTags.fulfilled]: (state, action) => {
      state.tags.items = action.payload;
      state.tags.status = "loaded";
    },

    [fetchTags.rejected]: (state) => {
      state.tags.items = [];
      state.tags.status = "error";
    },
  },
});

export const postsReducer = postsSlice.reducer;
