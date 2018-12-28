# 登录

```
POST /v1/account/login
```

### 请求

参数|解释|类型|是否必须
:---:|:----:|:----:|:---:
email|邮箱|String|是
password|密码（8-30位，包含字母、数字）|String|是


### 案例

```json
{
  "status" : 200,
  "data": {
    "user": {
      "name": "昵称",
      "fcode": "邀请码/F码",
      "email": "邮箱",
      "token": "身份",
      "avatar": "头像的base64字符串"
    }
  }
}
```