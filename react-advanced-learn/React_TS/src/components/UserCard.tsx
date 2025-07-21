import type { FC } from "react";

//使用接口定义UserCard的props
interface UserCardProps {
  name: string;
  age: number;
  email?: string;
  role: "admin" | "user" | "guest";
}

export const UserCard: FC<UserCardProps> = ({ name, age, email, role }) => {
  return (
    <div>
      <h2>{name}</h2>
      <p>Age: {age}</p>
      <p>Email: {email}</p>
      <p>Role: {role}</p>
    </div>
  );
};
