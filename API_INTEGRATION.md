# API Integration Guide

The project is configured with Axios and TanStack Query.

## Files

- `src/api/axiosInstance.js` — shared Axios client, base URL, auth header and normalized errors.
- `src/api/endpoints.js` — all API endpoint paths.
- `src/api/queryClient.js` — global TanStack Query configuration.
- `src/context/AuthContext.jsx` — application auth state and current user.
- `src/main.jsx` — provides the Query Client to the React application.
- `.env.example` — required API base URL example.

## Environment setup

Create a local `.env` file in the project root:

```env
VITE_API_BASE_URL=https://api-golflink.maktechgroup.tech
```

Restart the Vite development server after changing an environment variable. Do
not commit the local `.env` file.

If `VITE_API_BASE_URL` is missing, Axios uses `/api`.

## Endpoint configuration

Update `src/api/endpoints.js` when the backend contract is available. Static
paths are strings and paths requiring an ID are functions:

```js
API_ENDPOINTS.auth.login
API_ENDPOINTS.games.details(gameId)
API_ENDPOINTS.joinRequests.accept(requestId)
```

## Axios usage

```js
import axiosInstance from '../api/axiosInstance'
import { API_ENDPOINTS } from '../api/endpoints'

export const getGames = async (params) => {
  const response = await axiosInstance.get(API_ENDPOINTS.games.list, { params })
  return response.data
}

export const createGame = async (payload) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.games.create,
    payload,
  )
  return response.data
}
```

After login, the access token is stored in a browser cookie named
`auth_token`. The Axios request interceptor reads that cookie and sends:

```text
Authorization: Bearer <auth_token>
```

Legacy `accessToken` or `auth_token` values in localStorage are migrated to the
cookie automatically.

## Current authenticated user

`AuthContext` loads the signed-in user with TanStack Query:

```text
GET /api/profile/me
```

Use it from a component:

```jsx
import { useAuth } from '../context/AuthContext'

const Example = () => {
  const { user, isAuthenticated, isLoadingUser, logout } = useAuth()
}
```

The query only runs when an auth token exists. A `401` response clears the
invalid session automatically.

API errors are rejected in this shape:

```js
{
  status,
  message,
  errors,
  data,
  originalError
}
```

## TanStack Query usage

Use `useQuery` for GET requests:

```jsx
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '../api/axiosInstance'
import { API_ENDPOINTS } from '../api/endpoints'

const useGames = (filters) =>
  useQuery({
    queryKey: ['games', filters],
    queryFn: async () => {
      const response = await axiosInstance.get(API_ENDPOINTS.games.list, {
        params: filters,
      })
      return response.data
    },
  })
```

Use `useMutation` for create, update and delete requests. Invalidate related
queries after a successful mutation:

```jsx
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '../api/axiosInstance'
import { API_ENDPOINTS } from '../api/endpoints'

const useCreateGame = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload) => {
      const response = await axiosInstance.post(
        API_ENDPOINTS.games.create,
        payload,
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] })
    },
  })
}
```

## Recommended feature structure

Keep each feature's API functions and hooks close together:

```text
src/
  api/
    axiosInstance.js
    endpoints.js
    queryClient.js
  features/
    games/
      gamesApi.js
      useGames.js
    auth/
      authApi.js
      useLogin.js
```

The current endpoints are initial frontend conventions. Confirm their exact
paths, HTTP methods, request bodies and response shapes against the backend API
before connecting each screen.

## Connected authentication endpoints

Login:

```text
POST /api/auth/login
```

```json
{
  "email": "james@example.com",
  "password": "password123"
}
```

Registration:

```text
POST /api/auth/register
```

```json
{
  "fullName": "James Whitfield",
  "email": "james@example.com",
  "password": "password123",
  "gender": "MALE",
  "age": 38,
  "handicap": 14
}
```

Email verification:

```text
POST /api/auth/verify-email
```

```json
{
  "email": "james@example.com",
  "code": "123456"
}
```

Resend OTP:

```text
POST /api/auth/resend-otp
```

Use `REGISTRATION` while verifying a new account:

```json
{
  "email": "james@example.com",
  "type": "REGISTRATION"
}
```

Use `PASSWORD_RESET` during the forgot-password flow:

```json
{
  "email": "james@example.com",
  "type": "PASSWORD_RESET"
}
```

Request password reset:

```text
POST /api/auth/forgot-password
```

```json
{
  "email": "james@example.com"
}
```

Verify password-reset OTP:

```text
POST /api/auth/verify-reset-otp
```

```json
{
  "email": "james@example.com",
  "code": "109146"
}
```

Read `data.resetToken` from the successful response. This is a reset token, not
an authentication refresh token.

Set the new password:

```text
POST /api/auth/set-new-password
```

```json
{
  "resetToken": "<reset token returned by OTP verification>",
  "newPassword": "newpassword123"
}
```
