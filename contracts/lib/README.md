# Oraclize API

The oraclize API is encapsulated in the `usingOraclize` contract. This contract
can be retrieved from [github](https://github.com/oraclize/ethereum-api) via

```
git clone https://github.com/oraclize/ethereum-api.git
```

## Using the API With Truffle And Solidity > 0.4
Solidity 0.4 introduced breaking changes to the language. Thus, a new version of
the oraclize API has been provided. To use this API do:

 1. Copy the `oraclizeAPI_0.4.sol` to a convenient location,
    such as `$(PROJECT)/lib`.
 1. Rename the file: `mv oraclizeAPI_0.4.sol usingOraclize.sol`.
 1. Import it into your contract: `import ../lib/usingOraclize.sol`.
 1. Let your contract inherit from *usingOraclize*:
    ```
    import '../lib/usingOraclize.sol';

    contract myContract is usingOraclize {
        ...
    }
    ```
