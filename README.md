# react-progressive-callback

*React hook for tracking the status of async actions and pollings*

## Example

```jsx
import {useState, useEffect} from 'react';
import {useProgressiveCallback} from 'react-progressive-callback';

async function fetchUsers() {
    let response = await fetch('/users');
    return await response.json();
}

export const UserList = () => {
    let [users, setUsers] = useState();

    // this hook returns the state of the async callback
    let [state, getUsers] = useProgressiveCallback(fetchUsers);

    useEffect(() => {
        getUsers().then(users => {
            // it doesn't really matter for this example, but
            // the user list can be stored in an external store
            // instead of a local state
            setUsers(users);
        });
    }, [getUsers]);

    if (state === undefined || state === 'pending')
        return <Loader/>;

    if (state === 'rejected')
        return <Error/>;

    return (
        <ul>
            {users.map(({id, name}) => <li key={id}>{name}</li>)}
        </ul>
    );
};
```

Apart from tracking regular async actions, this hook can also be used for tracking the status of a polling built on a certain async action.

```jsx
import {useEffect} from 'react';
import {useProgressiveCallback} from 'react-progressive-callback';

async function fetchStatus() {
    let response = await fetch('/status');
    return await response.json();
}

export const Status = () => {
    let [state, getStatus] = useProgressiveCallback(fetchStatus, {
        // can be a single number for a constant polling,
        // or a function for a non-constant polling
        timeout: (value, iteration) => {
            return iteration < 5 ? 1000 : 3000;
        },
        // can be a fixed number setting the maximum iteration count,
        // or a function telling whether to proceed or not
        repeat: (value, iteration) => {
            return value !== 'completed' && iteration < 10;
        }
    });

    useEffect(() => {
        getStatus();
    }, [getStatus]);

    if (state === undefined || state === 'pending')
        return '⌛';

    return state === 'rejected' ? '❌' : '✔️';
};
```
