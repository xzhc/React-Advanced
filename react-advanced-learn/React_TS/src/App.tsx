import { Button } from "./components/Button";
import { UserCard } from "./components/UserCard";
import { LoginForm } from "./components/LoginForm";
import { List } from "./components/List";
import { TodoApp } from "./components/todo/TodoApp";

interface User {
  name: string;
  id: number;
}
function App() {
  const users: User[] = [
    { id: 1, name: "John" },
    { id: 2, name: "Jane" },
    { id: 3, name: "Jim" },
  ];
  return (
    <>
      <h1>Hello World</h1>
      <UserCard name="John" age={25} email="john@example.com" role="admin" />
      <Button
        label="Click me"
        onClick={() => alert("Button clicked")}
        variant="primary"
      />
      <LoginForm
        onSubmit={(data) => alert(`${data.username}Login successful`)}
      />
      <List items={users} renderItem={(user) => <div>{user.name}</div>} />
      <TodoApp title="Todo App" initialTodos={[]} />
    </>
  );
}

export default App;
