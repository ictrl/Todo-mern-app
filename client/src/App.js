import React, { useState } from "react";
import { gql } from "apollo-boost";
import { useQuery, useMutation } from "@apollo/react-hooks";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import TextField from "@material-ui/core/TextField";

const GET_TODO = gql`
  {
    todos {
      text
      id
      complete
    }
  }
`;

const UPDATE_TODO = gql`
  mutation updateTodo($id: ID!, $complete: Boolean!) {
    updateTodo(id: $id, complete: $complete)
  }
`;

const DELETE_TODO = gql`
  mutation deleteTodo($id: ID!) {
    removeTodo(id: $id)
  }
`;

const ADD_TODO = gql`
  mutation createTodo($text: String!) {
    createTodo(text: $text) {
      text
      complete
      id
    }
  }
`;

function App() {
  const { loading, error, data } = useQuery(GET_TODO);
  const [updateTodo] = useMutation(UPDATE_TODO, {
    refetchQueries: mutationResult => [{ query: GET_TODO }]
  });
  const [deleteTodo] = useMutation(DELETE_TODO, {
    refetchQueries: mutationResult => [{ query: GET_TODO }]
  });
  const [addTodo] = useMutation(ADD_TODO, {
    refetchQueries: mutationResult => [{ query: GET_TODO }]
  });
  const [state, setState] = useState("");

  const inputHandle = e => {
    setState(e.target.value);
  };
  const inputHandleKey = e => {
    if (e.key === "Enter") {
      addTodo({ variables: { text: state } });
      setState("");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div style={{ display: "flex" }}>
      <div style={{ margin: "auto", width: 400 }}>
        <Paper elevation={1}>
          <TextField
            id="standard-name"
            label="Todo..."
            fullWidth
            value={state}
            onChange={inputHandle}
            onKeyDown={inputHandleKey}
            margin="normal"
          />
          <List>
            {data.todos.map(todo => {
              return (
                <ListItem key={todo.id} role={undefined} dense button>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={todo.complete}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ "aria-labelledby": "labelId" }}
                      onClick={() => {
                        updateTodo({
                          variables: { id: todo.id, complete: !todo.complete }
                        });
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText id={todo.id} primary={todo.text} />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="comments"
                      onClick={() => {
                        deleteTodo({
                          variables: { id: todo.id }
                        });
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        </Paper>
      </div>
    </div>
  );
}

export default App;
