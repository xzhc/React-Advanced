import { useId, useState } from "react";

export function SignupForm() {
  //生成基础ID
  const formId = useId();

  //为不同字段创建唯一ID
  const nameId = `${formId}-name`;
  const emailId = `${formId}-email`;
  const passwordId = `${formId}-password`;
  const errorId = `${formId}-error`;

  const [hasError, setHasError] = useState(false);

  return (
    <form>
      <h2>注册账号</h2>
      {/*使用生成的Id关联label和input */}
      <div>
        <label htmlFor={nameId}>用户名</label>
        <input
          id={nameId}
          type="text"
          aria-activedescendant={hasError ? errorId : undefined}
        />

        <div>
          <label htmlFor={emailId}>邮箱</label>
          <input
            id={emailId}
            type="email"
            aria-activedescendant={hasError ? errorId : undefined}
          />

          <div>
            <label htmlFor={passwordId}>密码</label>
            <input
              id={passwordId}
              type="password"
              aria-activedescendant={hasError ? errorId : undefined}
            />
          </div>

          {/* 错误信息区域  使用 aria-describedby 关联 */}
          <div>
            {hasError && (
              <div id={errorId} role="alert" style={{ color: "red" }}>
                请检查表单填写是否正确
              </div>
            )}
          </div>

          <button type="submit">注册</button>
        </div>
      </div>
    </form>
  );
}
