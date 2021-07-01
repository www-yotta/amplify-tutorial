import React, { useEffect, FC, useState } from "react";
import { useParams } from "react-router-dom";
import Amplify, { API, graphqlOperation } from "aws-amplify";
import { updateTodo, deleteTodo } from "./graphql/mutations";
import { getTodo } from "./graphql/queries";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { useForm } from "react-hook-form";

import awsExports from "./aws-exports";
Amplify.configure(awsExports);

const Detail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    getDetail();
  }, []);

  async function getDetail() {
    try {
      const oneTodo2: any = await API.graphql(
        graphqlOperation(getTodo, { id })
      );
      setValue("name", oneTodo2.data.getTodo.name);
      setValue("description", oneTodo2.data.getTodo.description);
      setValue("flag", oneTodo2.data.getTodo.flag);
      console.log("oneTodo2", oneTodo2);
    } catch (err) {
      console.log("error", err);
      console.log("error fetching todos");
    }
  }

  const handleUpdate = async (input: any) => {
    const updatedTodo = await API.graphql(
      graphqlOperation(updateTodo, { input })
    );
    console.log("updatedTodo", updatedTodo);
  };

  const handleDelete = async () => {
    const deletedTodo = await API.graphql(
      graphqlOperation(deleteTodo, {
        input: { id: 1 },
      })
    );
    console.log("deletedTodo", deletedTodo);
  };

  return (
    <div>
      <h2>Amplify Todo Detail</h2>
      <input {...register("id")} type="hidden" defaultValue={id} />
      <input {...register("name")} placeholder="Name" />
      <input {...register("description")} placeholder="Description" />
      <input {...register("flag")} type="checkbox" />
      <button onClick={handleSubmit(handleUpdate)}>update!!</button>
      <button onClick={handleSubmit(handleDelete)}>delete!!</button>
    </div>
  );
};

export default withAuthenticator(Detail);
