# ATM Transactions

## Header


## Create a new account with initial balance


### Request method
    POST

### Request URL
    
    http://localhost:3055/api/accounts


### Query Parameters
    
    

### Request body

{
    "balance":<"initial balance">
}

### Response:

{
    "accountId": "64dcbbd6d615e4bb753e0e3c"
}



## Credit balance


### Request method
    POST

### Request URL
    
    http://localhost:3055/api/accounts/:accountId/credit


### Query Parameters
    
    - accountId

### Request body

{
    "amount":<"amount to add">
}

### Response:

{
    "message": "Credit transaction successful",
    "account": {
        "_id": "64da6151caf5cb8b171e6a1c",
        "balance": 6554,
        "transactions": [
            {
                "type": "credit",
                "amount": 2000,
                "timestamp": "2023-08-16T10:18:33.198Z"
            }
        ]
    }
}


## Debit balance

### Request method
    POST

### Request URL
    
    http://localhost:3055/api/accounts/:accountId/debit


### Query Parameters
    
    - accountId

### Request body

{
    "amount":<"amount to withdraw">
}

### Response:

{
    "message": "Debit transaction successful",
    "account": {
        "_id": "64da6151caf5cb8b171e6a1c",
        "balance": 8554,
        "transactions": [
            {
                "type": "debit",
                "amount": 2000,
                "timestamp": "2023-08-16T11:49:35.707Z"
            }
        ]
    }
}


## Get balance


### Request method
    GET

### Request URL
    
    http://localhost:3055/api/accounts/:accountId/balance


### Query Parameters
    
    - accountId

### Request body



### Response:

{
    "balance": 4554
}
