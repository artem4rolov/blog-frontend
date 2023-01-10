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

// удаление поста
export const fetchRemovePost = createAsyncThunk(
  "posts/fetchRemovePost",
  async (id) => {
    await axios.delete(`/posts/${id}`);
  }
);

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
    // ПОЛУЧЕНИЕ СТАТЬИ
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
    // ПОЛУЧЕНИЕ ТЕГОВ
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
    // УДАЛЕНИЕ СТАТЬИ
    [fetchRemovePost.pending]: (state, action) => {
      // удаляем статью из стейта
      state.posts.items = state.posts.items.filter(
        (obj) => obj._id !== action.meta.arg
      );
    },
  },
});

export const postsReducer = postsSlice.reducer;
