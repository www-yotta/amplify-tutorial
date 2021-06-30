import React, { useEffect, FC } from "react";
import Amplify, { API, graphqlOperation } from "aws-amplify";
import { updateTodo, deleteTodo } from "./graphql/mutations";
import { getTodo } from "./graphql/queries";
import { withAuthenticator } from "@aws-amplify/ui-react";

import awsExports from "./aws-exports";
Amplify.configure(awsExports);

const Detail: FC = () => {
  useEffect(() => {
    getDetail();
  }, []);

  async function getDetail() {
    try {
      const oneTodo1 = await API.graphql({
        query: getTodo,
        variables: { id: "6612b" },
      });
      const oneTodo2 = await API.graphql(
        graphqlOperation(getTodo, { id: "1" })
      );
      console.log("oneTodo1", oneTodo1);
      console.log("oneTodo2", oneTodo2);
    } catch (err) {
      console.log("error", err);
      console.log("error fetching todos");
    }
  }

  const handleUpdate = async () => {
    const updatedTodo = await API.graphql(
      graphqlOperation(updateTodo, {
        input: { id: 1, name: "ぐらふーー", flag: false },
      })
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
      <button onClick={handleUpdate}>update!!</button>
      <button onClick={handleDelete}>delete!!</button>
    </div>
  );
};

export default withAuthenticator(Detail);
