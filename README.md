![image](https://github.com/user-attachments/assets/b47b1513-e121-42ab-b610-b1d472706237)to perferm transaction user need to register so to register here is the api 


/////////////////////////////////////////////////////////////////////////////API FOR REGISTER\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
https://transaction-8d7j.onrender.com/api/user/register


Request Body
{
    "email":"user@gmail.com",
    "userName":"user",
    "password":"user"
}

Response 
{
    "message": "User successfully Registere",
    "success": true,
    "user": {
        "userName": "user",
        "email": "user@gmail.com",
        "password": "$2b$10$6ht1XDNwz0xthrsUHlBNUu77By3IhrXYLKUHmK1ln5UXc2CJ5W93G",
        "_id": "673f02fee68864b51cd217ab",
        "createdAt": "2024-11-21T09:53:02.195Z",
        "updatedAt": "2024-11-21T09:53:02.195Z",
        "__v": 0
    }
}


////////////////////////////////////////////////////////////////////////////////////////API FOR LOGIN\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\


https://transaction-8d7j.onrender.com/api/user/login

Request Body

{
"email":"alok@gmail.com",
"password":"alok"


}



Response

{
    "message": "Welcome back alok",
    "success": true
}



/////////////////////////////////////////////////////////////////////////////CREATE TRANSACTION\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\



https://transaction-8d7j.onrender.com/api/transaction

Request Body

{

    "amount":"3500000",
    "transaction_type":"DEPOSIT"


}

Response

{
    "message": "Transaction successfully added",
    "success": true,
    "transaction": {
        "user": "673eb7f6bb22301dd0b8787a",
        "amount": 3500000,
        "transaction_type": "DEPOSIT",
        "status": "PENDING",
        "_id": "673f0431bdb605f29e18de21",
        "timestamp": "2024-11-21T09:58:09.983Z",
        "createdAt": "2024-11-21T09:58:09.986Z",
        "updatedAt": "2024-11-21T09:58:09.986Z",
        "__v": 0
    }
}

///////////////////////////////////////////////////////////////////////////GET ALL  TRANSACTION \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\


https://transaction-8d7j.onrender.com/api/transaction

Request Body
 Nothing 

 Response

 {
    "message": "Successfully retrieved all transactions of user",
    "success": true,
    "transactions": [
        {
            "_id": "673ec2a543ab96e1b25c604a",
            "user": "673eb7f6bb22301dd0b8787a",
            "amount": 300,
            "transaction_type": "DEPOSIT",
            "status": "COMPLETED",
            "timestamp": "2024-11-21T05:18:29.530Z",
            "createdAt": "2024-11-21T05:18:29.533Z",
            "updatedAt": "2024-11-21T05:33:55.585Z",
            "__v": 0
        },
        {
            "_id": "673ec2ca43ab96e1b25c604c",
            "user": "673eb7f6bb22301dd0b8787a",
            "amount": 100,
            "transaction_type": "WITHDRAWAL",
            "status": "PENDING",
            "timestamp": "2024-11-21T05:19:06.355Z",
            "createdAt": "2024-11-21T05:19:06.356Z",
            "updatedAt": "2024-11-21T05:19:06.356Z",
            "__v": 0
        },
        {
            "_id": "673ec3c61faecd0f319ba3a4",
            "user": "673eb7f6bb22301dd0b8787a",
            "amount": 100,
            "transaction_type": "WITHDRAWAL",
            "status": "PENDING",
            "timestamp": "2024-11-21T05:23:18.657Z",
            "createdAt": "2024-11-21T05:23:18.660Z",
            "updatedAt": "2024-11-21T05:23:18.660Z",
            "__v": 0
        },
        {
            "_id": "673ec3ec1faecd0f319ba3a6",
            "user": "673eb7f6bb22301dd0b8787a",
            "amount": 1000,
            "transaction_type": "DEPOSIT",
            "status": "PENDING",
            "timestamp": "2024-11-21T05:23:56.449Z",
            "createdAt": "2024-11-21T05:23:56.450Z",
            "updatedAt": "2024-11-21T05:23:56.450Z",
            "__v": 0
        },
        {
            "_id": "673ec6fede010c4e264f60d4",
            "user": "673eb7f6bb22301dd0b8787a",
            "amount": 500,
            "transaction_type": "WITHDRAWAL",
            "status": "PENDING",
            "timestamp": "2024-11-21T05:37:02.696Z",
            "createdAt": "2024-11-21T05:37:02.699Z",
            "updatedAt": "2024-11-21T05:37:02.699Z",
            "__v": 0
        },
        {
            "_id": "673ecd0cf9a2937504d29237",
            "user": "673eb7f6bb22301dd0b8787a",
            "amount": 400,
            "transaction_type": "DEPOSIT",
            "status": "COMPLETED",
            "timestamp": "2024-11-21T06:02:52.335Z",
            "createdAt": "2024-11-21T06:02:52.339Z",
            "updatedAt": "2024-11-21T06:03:46.538Z",
            "__v": 0
        },
        {
            "_id": "673ed4637295cb319ffc6e2a",
            "user": "673eb7f6bb22301dd0b8787a",
            "amount": 30000,
            "transaction_type": "DEPOSIT",
            "status": "PENDING",
            "timestamp": "2024-11-21T06:34:11.554Z",
            "createdAt": "2024-11-21T06:34:11.580Z",
            "updatedAt": "2024-11-21T06:34:11.580Z",
            "__v": 0
        },
        {
            "_id": "673ed4b97295cb319ffc6e2c",
            "user": "673eb7f6bb22301dd0b8787a",
            "amount": 300000,
            "transaction_type": "DEPOSIT",
            "status": "COMPLETED",
            "timestamp": "2024-11-21T06:35:37.928Z",
            "createdAt": "2024-11-21T06:35:37.929Z",
            "updatedAt": "2024-11-21T06:36:03.108Z",
            "__v": 0
        },
        {
            "_id": "673ed5c67295cb319ffc6e31",
            "user": "673eb7f6bb22301dd0b8787a",
            "amount": 3500000,
            "transaction_type": "DEPOSIT",
            "status": "COMPLETED",
            "timestamp": "2024-11-21T06:40:06.973Z",
            "createdAt": "2024-11-21T06:40:06.974Z",
            "updatedAt": "2024-11-21T06:40:32.629Z",
            "__v": 0
        },
        {
            "_id": "673f0431bdb605f29e18de21",
            "user": "673eb7f6bb22301dd0b8787a",
            "amount": 3500000,
            "transaction_type": "DEPOSIT",
            "status": "PENDING",
            "timestamp": "2024-11-21T09:58:09.983Z",
            "createdAt": "2024-11-21T09:58:09.986Z",
            "updatedAt": "2024-11-21T09:58:09.986Z",
            "__v": 0
        }
    ]
}



///////////////////////////////////////////////////////// API FOR UPDATE TRANSACTION\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\


https://transaction-8d7j.onrender.com/api/transaction/673f0431bdb605f29e18de21

Request Body

{
    "status":"COMPLETED"
}

Response


{
    "message": "Successfully updated transaction",
    "success": true,
    "transaction": {
        "_id": "673f0431bdb605f29e18de21",
        "user": "673eb7f6bb22301dd0b8787a",
        "amount": 3500000,
        "transaction_type": "DEPOSIT",
        "status": "COMPLETED",
        "timestamp": "2024-11-21T09:58:09.983Z",
        "createdAt": "2024-11-21T09:58:09.986Z",
        "updatedAt": "2024-11-21T10:00:51.438Z",
        "__v": 0
    }
}


////////////////////////////////////////////////////////////////////////////////////////////get transaction by id \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

https://transaction-8d7j.onrender.com/api/transaction/673f0431bdb605f29e18de21


Request Body 
empty

Response 

{
    "message": "Successfully retrieved the transaction",
    "success": true,
    "transaction": {
        "_id": "673f0431bdb605f29e18de21",
        "user": "673eb7f6bb22301dd0b8787a",
        "amount": 3500000,
        "transaction_type": "DEPOSIT",
        "status": "COMPLETED",
        "timestamp": "2024-11-21T09:58:09.983Z",
        "createdAt": "2024-11-21T09:58:09.986Z",
        "updatedAt": "2024-11-21T10:00:51.438Z",
        "__v": 0
    }
}
 
