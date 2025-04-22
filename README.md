# react-progressive-callback

*A React hook for tracking the state of async actions*

Once the state of an async callback (whether it's pending or settled) becomes relevant, the `useProgressiveCallback()` hook comes in as a handy replacement for the React's `useCallback()`:

```diff
- let fetchUsers = useCallback(async () => {
+ let [loading, fetchUsers, error] = useProgressiveCallback(async () => {
      let response = await fetch('/users');
      return await response.json();
  }, []);
```

## Example

The example below shows a typical use case for the `useProgressiveCallback()` hook: showing a process indicator as long as the async function hasn't resolved, and an error message in case of its failure.

```jsx
import {useState, useEffect} from 'react';
import {useProgressiveCallback} from 'react-progressive-callback';

export const UserList = () => {
    let [users, setUsers] = useState();

    let [loading, fetchUsers, error] = useProgressiveCallback(async () => {
        let response = await fetch('/users');
        return await response.json();
    }, []);

    useEffect(() => {
        fetchUsers().then(users => {
            setUsers(users);
        });
    }, [fetchUsers]);

    if (loading)
        return 'Loading...';

    if (error)
        return 'Failed to fetch user list';

    return (
        <ul>
            {users.map(({id, name}) => <li key={id}>{name}</li>)}
        </ul>
    );
};
```
