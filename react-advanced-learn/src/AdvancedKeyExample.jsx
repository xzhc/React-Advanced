import { useState } from "react";

export function AdvancedKeyExample() {
  const [users, setUsers] = useState([
    { id: "a1", name: "张三", active: true },
    { id: "a2", name: "李四", active: false },
    { id: "a3", name: "王五", active: false },
  ]);

  const [filter, setFilter] = useState("all");

  const addUser = () => {
    const newId = `a${Date.now()}`;
    setUsers([...users, { id: newId, name: `新用户${newId}`, active: true }]);
  };

  const removeUser = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const toggleUser = (id) => {
    setUsers(
      users.map((user) =>
        user.id === id ? { ...user, active: !user.active } : user
      )
    );
  };

  const moveUserUp = (index) => {
    if (index === 0) {
      return;
    }
    const newUsers = [...users];
    [newUsers[index], newUsers[index - 1]] = [
      newUsers[index - 1],
      newUsers[index],
    ];
    setUsers(newUsers);
  };

  //根据条件筛选用户
  const getFilteredUsers = () => {
    switch (filter) {
      case "active":
        return users.filter((user) => user.active === true);
      case "inactive":
        return users.filter((user) => user.active === false);
      default:
        return users;
    }
  };

  const filteredUsers = getFilteredUsers();

  return (
    <div className="user-manager">
      <div className="controls">
        <button onClick={addUser}>添加用户</button>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">全部</option>
          <option value="active">活跃</option>
          <option value="inactive">不活跃</option>
        </select>
      </div>

      <ul className="user-list">
        {filteredUsers.map((user, index) => {
          return (
            <li key={user.id} className={user.active ? "active" : "inactive"}>
              <span> {user.name}</span>
              <span>{user.active ? "活跃" : "非活跃"}</span>
              <div className="actions">
                <button onClick={() => toggleUser(user.id)}>
                  {user.active ? "设为非活跃" : "设为活跃"}
                </button>
                <button onClick={() => removeUser(user.id)}>删除</button>
                {index > 0 && (
                  <button onClick={() => moveUserUp(index)}>上移</button>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {filteredUsers.length === 0 && (
        <p className="no-users">没有符合条件的用户</p>
      )}
    </div>
  );
}
