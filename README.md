# react-progressive-callback

*React hook for tracking the status of async actions and pollings*

## Example

```jsx
import {useState, useEffect} from 'react';
import {useProgressiveCallback} from 'react-progressive-callback';

export const UserList = () => {
    let [users, setUsers] = useState();

    // this hook returns the state of the async callback
    let [state, fetchUsers] = useProgressiveCallback(async () => {
        let response = await fetch('/users');
        return await response.json();
    });

    useEffect(() => {
        fetchUsers().then(users => {
            // it doesn't really matter for this example, but
            // the user list can be stored in an external store
            // instead of a local state
            setUsers(users);
        });
    }, [fetchUsers]);

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

Apart from tracking regular async actions, this hook can also be used for tracking the status of a polling built on an async action.

```jsx
import {useEffect} from 'react';
import {useProgressiveCallback} from 'react-progressive-callback';

const callbackOptions = {
    // can be a single number for a constant polling,
    // or a function for a non-constant polling
    timeout: (value, iteration) => {
        return iteration < 5 ? 1000 : 5000;
    },
    // can be a fixed number setting the maximum iteration count,
    // or a function telling whether to proceed or not
    repeat: (value, iteration) => {
        if (iteration > 10) throw new Error('timed out');
        return value !== 'completed';
    }
};

export const Status = () => {
    let [state, pollStatus] = useProgressiveCallback(async () => {
        let response = await fetch('/status');
        return await response.json();
    }, callbackOptions);

    useEffect(() => {
        pollStatus()
            .catch(error => console.warn(error.message));
    }, [pollStatus]);

    if (state === undefined || state === 'pending')
        return <span>⌛</span>;

    return <span>{state === 'rejected' ? '❌' : '✔️'}</span>;
};
```
