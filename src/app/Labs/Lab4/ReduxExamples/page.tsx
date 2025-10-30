import HelloRedux from "./HelloRedux/page";
import CounterRedux from "../ReduxExamples/CounterRedux/page";
import AddRedux from "./AddRedux/page";
import TodoList from "./todos/TodoList";

export default function ReduxExamples() {
  return(
    <div>
      <h2>Redux Examples</h2>
      <HelloRedux />
      <CounterRedux />
      <AddRedux />
      <TodoList />
    </div>
  );
};
