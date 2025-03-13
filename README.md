# PulseVM-JS

JavaScript, TypeScript SDK for PulseVM.

## Constructing a transaction

```javascript
const key = parsePrivateKey(
    'frqNAoTevNse58hUoJMDzPXDbfNicjCGjNz5VDgqqHJbhBBG9',
);

const tx = new Transaction(
    // Unsigned transaction
    new BaseTransaction(
        // Blockchain ID, used to prevent replay attacks on other chains
        // Should be the ID of the chain this VM is running in
        Id.fromString('28fJD1hMz2PSRJKJt7YT41urTPR37rUNUcdeJ8daoiwP6DGnAR'),
        // Array of actions
        [
            new Action(
                // Account name
                new Name('pulse'),
                // Action name
                new Name('newaccount'),
                // Hex encoded action data
                new Bytes(new Uint8Array()),
                // Array of provided authorizations
                [
                    new PermissionLevel(new Name('pulse'), new Name('active'))
                ],
            ),
        ]
    ),
    // Empty array of signatures
    [],
);

// Sign the transaction with your private key
await tx.sign(key);
```