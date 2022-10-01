# react-progressive-callback

*A React hook for tracking the state of async actions*

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
