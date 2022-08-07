# react-progressive-callback

*A React hook for tracking the state of an async action or a polling*

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
    });

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

Apart from tracking regular async actions, this hook can also be used for tracking the state of a polling based on an async action.

```jsx
import {useEffect} from 'react';
import {useProgressiveCallback} from 'react-progressive-callback';

const pollingOptions = {
    // can be a single number for a constant polling,
    // or a function for a non-constant polling
    delay: (value, iteration) => {
        return iteration < 5 ? 1000 : 5000;
    },
    // can be a fixed number setting the maximum iteration count,
    // or a function telling whether to proceed or not
    repeat: (value, iteration) => {
        if (iteration > 10)
            throw new Error('too many iterations');
        return value !== 'completed';
    }
};

export const Status = () => {
    let [state, pollStatus] = useProgressiveCallback(async () => {
        let response = await fetch('/status');
        return await response.json();
    }, pollingOptions);

    useEffect(() => {
        pollStatus()
            .catch(error => console.warn(error.message));
    }, [pollStatus]);

    if (state === 'rejected')
        return <span>❌</span>;

    return <span>{state === 'fulfilled' ? '✔️' : '⌛'}</span>;
};
```
