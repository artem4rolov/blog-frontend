import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchAuth = createAsyncThunk("auth/fetchAuth", async (params) => {
  // получаем данные с формы заполнения логина и пароля при входе
  const { data } = await axios.post("/auth/login", params);
  // возвращаем объект с информацией о пользователе
  console.log(data);
  return data;
});

const initialState = {
  data: null,
  status: "loading",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  extraReducers: {
    // авторизация
    // в то время, когда происходит загрузка данных пользователя
    [fetchAuth.pending]: (state) => {
      // данных о пользователе пока нет
      state.data = null;
      // меняем текст сообщения
      state.status = "loading";
    },
    // в то время, когда всё загрузилось
    [fetchAuth.fulfilled]: (state, action) => {
      // данных о пользователе получены
      state.data = action.payload;
      // меняем текст сообщения
      state.status = "loaded";
    },
    // в то время, когда произошла ошибка
    [fetchAuth.rejected]: (state) => {
      // данных о пользователе нет
      state.data = null;
      // меняем текст сообщения
      state.status = "error";
    },
  },
});

// делаем обозначение наличия данных о пользователе в state
export const selectIsAuth = (state) => Boolean(state.auth.data);

export const authReducer = authSlice.reducer;