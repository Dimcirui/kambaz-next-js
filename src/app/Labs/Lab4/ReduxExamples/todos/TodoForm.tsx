import { ListGroupItem, Button } from "react-bootstrap";
import { FormControl } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { addTodo, updateTodo, setTodo } from "./todosReducer";

export default function TodoForm(
//   { todo, setTodo, addTodo, updateTodo }
//   : {
//   todo: { id: string; title: string };
//   setTodo: (todo: { id: string; title: string }) => void;
//   addTodo: (todo: { id: string; title: string }) => void;
//   updateTodo: (todo: { id: string; title: string }) => void;
// }
) {
  const { todo } = useSelector((state: any) => state.todosReducer);
  const dispatch = useDispatch();
  return (
    <ListGroupItem>
      <Button onClick={() => dispatch(addTodo(todo))}
              id="wd-add-todo-click"> Add </Button>
      <Button onClick={() => dispatch(updateTodo(todo))}
              id="wd-update-todo-click"> Update </Button>
      <FormControl value={todo.title}
        onChange={ (e) => dispatch(setTodo({ ...todo, title: e.target.value })) }/>
    </ListGroupItem>
);}
