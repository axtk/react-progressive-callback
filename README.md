# react-progressive-callback

*A React hook for tracking the state of async actions*

Once the state of an async callback (whether it's pending or settled) becomes relevant, the `useProgressiveCallback()` hook comes in as a handy replacement for the React's `useCallback()`. We could have started with something like:

```jsx
let fetchUsers = useCallback(async () => {
    let response = await fetch('/users');
    return await response.json();
}, []);
```

and as soon as the state of this callback becomes required, we only have to make a slight change in the code:

```jsx
let [state, fetchUsers] = useProgressiveCallback(async () => {
    let response = await fetch('/users');
    return await response.json();
}, []);
```

As a typical use case, the state of an async callback can be used in the component to render an error message if it's `'rejected'` or a process indicator unless it's `'fulfilled'`, as shown in the example below.

## Example

```jsx
import {useState, useEffect} from 'react';
import {useProgressiveCallback} from 'react-progressive-callback';

export const UserList = () => {
    let [users, setUsers] = useState();

    // the `state` value reflects the state of the async callback
    let [state, fetchUsers] = useProgressiveCallback(async () => {
        let response = await fetch('/users');
        return await response.json();
    }, []);
    // the second parameter of the hook is an array of dependencies
    // serving the same purpose as in the React's `useCallback()` hook

    useEffect(() => {
        fetchUsers().then(users => {
            // in this example, the result is stored in a local state,
            // but it could as well be stored in an external store
            setUsers(users);
        });
    }, [fetchUsers]);

    if (state === 'rejected')
        return <Error/>;

    if (state !== 'fulfilled') // 'pending' or undefined
        return <Loader/>;

    return (
        <ul>
            {users.map(({id, name}) => <li key={id}>{name}</li>)}
        </ul>
    );
};
```
