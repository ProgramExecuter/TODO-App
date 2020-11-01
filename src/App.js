import React, {useState, useEffect} from 'react';
import './App.css';
import {Button, Input, InputLabel, FormControl} from '@material-ui/core'
import Todo from './Todo';
import './Todo.css';
import db from './firebase';
import firebase from 'firebase';

console.log(db.collection('todos'));

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  //When the app loads, we need to listen to database
  //and fetch new todos as they get added/removed
  useEffect(() => {
    //this code here, fires when app.js loads

    db.collection('todos').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setTodos(snapshot.docs.map(doc => ({
        id: doc.id,  
        todo: doc.data().todo
        }))
      );
    });

  }, []);

  const addTodo = (event) => {
    //This will stop the REFRESH
    event.preventDefault();
    
    db.collection('todos').add({
      todo: input,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    setTodos([...todos, input]);
    setInput('');
  };

  return (
    <div className="App">
      <h1>Hello Programmers </h1>

      <form>
        <FormControl>
          <InputLabel>Write a TODO</InputLabel>
          <Input value={input} onChange={event => setInput(event.target.value)}></Input>
        </FormControl>
        <Button disabled={!input} type="submit" onClick={addTodo} variant="contained" color="primary">
          Add TODO
        </Button>
      </form>

      <ul>
        {todos.map(todo => (
          <Todo todo={todo} />
        ))}
      </ul>
    </div>
  );
}

export default App;