## 登录

### 基本信息

- 请求URL：`http://xx.com/api/login`
- 请求方式：POST

### 请求参数

| 参数名   | 必选 | 类型   | 说明   |
| -------- | ---- | ------ | ------ |
| username | 是   | string | 用户名 |
| password | 是   | string | 密码   |

### 返回参数

| 参数名     | 类型   | 说明                       |
| ---------- | ------ | -------------------------- |
| returnData | object | 返回数据                   |
| returnCode | int    | 返回标识，0：成功，1：失败 |
| returnDesc | string | 返回描述                   |
| username   | string | 用户名                     |

### 示例

请求示例：

```json
{
	'username': 'jack',
	'password': '123456'
}
```

返回示例：

```json
{
    'returnData':{
        'username':'jack'
    },
    'returnCode':0,
    'returnDesc':'密码正确'
}
```

