# Social-Media :-

documentation :-
https://docs.imagekit.io/api-reference/upload-file-api/server-side-file-upload

## * **Schemas** :-

       * user-Schema 
       * post-Schema
       * comment-Schema 
       * reply-Schema
       * chat-Schema
       * message-Schema 

## * **Router** :- 
     1. user-Route
     2. post-Route
     3. comment-Route
     4. reply-Route
     5. chat-Route
     6. message-Route

### * **Router** :-

     1.user-Route :- 
          * POST User Register
          * POST User Login (user Auth)
          * GET User get
          * PATCH User update
          * DELETE User delete
          * PUT User follow (another user)
          * PUT User unFollow 
    
    2.post-Route :-
          * Post create (POST)
          * Post Get(get the post) (GET)
          * Post update (PUT)
          * Post delete (DELETE)
          * Post LIke(UnLike) (PUT)
          * Post  Timeline (GET) 
    
    3.Comment-Route :-
           * POST Add comment on post
           * GET comments
           * Update comment(Auth)
           * DELETE comment
    
    4.Reply-Route :-
           * Create Reply on comment (POST)
           * GET Reply (GET)
           * Update Reply (PUT)

    5. Chat-Route :-
           * we are create the chat , when we create the message
           * GET user all chat 
           * GET the particular chat .

    6. Message-Route :-
           * POST create message .
           * GET message . 



