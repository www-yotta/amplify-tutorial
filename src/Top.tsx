import React, { useEffect, useState, FC } from "react";
import Amplify, { API, graphqlOperation } from "aws-amplify";
import { createTodo } from "./graphql/mutations";
import { listTodos } from "./graphql/queries";
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
      const todoData = await API.graphql(graphqlOperation(listTodos));
      console.log("todoData", todoData);
      // TODO: 型定義がうまくいかない
      // const todos = todoData.data.listTodos.items;
      // setTodos(todos);
    } catch (err) {
      console.log("error", err);
      console.log("error fetching todos");
    }
  }

  async function addTodo(values: any) {
    try {
      console.log("values", values);
      setTodos([...todos, values]);
      await API.graphql(graphqlOperation(createTodo, { input: values }));
    } catch (err) {
      console.log("error creating todo:", err);
    }
  }

  return (
    <div>
      <h2>Amplify Todos</h2>
      <input {...register("name")} placeholder="Name" />
      <input {...register("description")} placeholder="Description" />
      <input {...register("flag")} type="checkbox" />
      <button onClick={handleSubmit(addTodo)}>Create Todo</button>
      {todos.map((todo: any, index: number) => (
        <div key={todo?.id ? todo?.id : index}>
          <p>{todo.name}</p>
          <p>{todo.description}</p>
        </div>
      ))}
    </div>
  );
};

export default withAuthenticator(Top);
