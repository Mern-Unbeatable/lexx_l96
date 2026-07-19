# API Integration Guide

The project is configured with Axios and TanStack Query.

## Files

- `src/api/axiosInstance.js` — shared Axios client, base URL, auth header and normalized errors.
- `src/api/endpoints.js` — all API endpoint paths.
- `src/api/queryClient.js` — global TanStack Query configuration.
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

The Axios request interceptor reads the token from:

```js
localStorage.setItem('accessToken', token)
```

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
