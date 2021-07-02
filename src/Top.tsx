import React, { useEffect, useState, FC } from "react";
import { Link } from "react-router-dom";
import Amplify, { API, graphqlOperation } from "aws-amplify";
import { createTodo } from "./graphql/mutations";
import { listTodos, searchTodos } from "./graphql/queries";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { useForm } from "react-hook-form";

import awsExports from "./aws-exports";
Amplify.configure(awsExports);

const Top: FC = () => {
  const [todos, setTodos] = useState<any>([]);

  const { register, handleSubmit } = useForm();

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    try {
      // TODO: 型定義がうまくいかないから一旦any
      const todoData: any = await API.graphql(graphqlOperation(listTodos));
      console.log("todoData", todoData);

      const todos = todoData.data.listTodos.items;
      setTodos(todos);
    } catch (err) {
      console.log("error", err);
      console.log("error fetching todos");
    }
  }

  async function addTodo({ search, ...values }: any) {
    try {
      const addedTodo: any = await API.graphql(
        graphqlOperation(createTodo, { input: values })
      );
      console.log("addedTodo", addedTodo.data.createTodo);
      setTodos([...todos, addedTodo.data.createTodo]);
    } catch (err) {
      console.log("error creating todo:", err);
    }
  }

  const handleSearch = async ({ search }: any) => {
    const result: any = await API.graphql(
      graphqlOperation(searchTodos, {
        filter: { name: { wildcard: `*${search}*` } },
      })
    );
    setTodos(result.data.searchTodos.items);
    console.log("result", result);
  };

  return (
    <div>
      <h2>Amplify Todos</h2>
      <input {...register("search")} placeholder="検索" />
      <button onClick={handleSubmit(handleSearch)}>検索</button>
      <input {...register("name")} placeholder="Name" />
      <input {...register("description")} placeholder="Description" />
      <input {...register("flag")} type="checkbox" />
      <button onClick={handleSubmit(addTodo)}>Create Todo</button>
      {todos.map((todo: any, index: number) => (
        <div key={todo?.id ? todo?.id : index}>
          <Link to={`detail/${todo.id}`}>
            <p>{todo.name}</p>
            <p>{todo.description}</p>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default withAuthenticator(Top);
