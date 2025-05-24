#### NodeJS master project with ExpressJS and MongoDB

```bash
# Repository URL : 
https://github.com/prasenjit1011/insuredmine

# Command to start server :
pm2 start app.js --name app

# Monitor CPU status
pm2 monit

# API List with UI at public folder
http://localhost:3000/

```

#### API List ( Task1 )
```bash
# 1. Upload CSV File
Api URL : http://localhost:3000/upload
Method  : POST
Param   : file

# 2. Policy search by user id / email
Api URL : http://localhost:3000/policy/details?username=maikelnai@msn.com
Method  : GET

# 3. Policy search by policy number
Api URL : http://localhost:3000/policy/items?policy_number=YEEX9MOIBU7X
Method  : GET

# 4. Agent List
Api URL : http://localhost:3000/agents
Method  : GET

# 5. Carrier / Company List
Api URL : http://localhost:3000/carrier
Method  : GET

# 6. User List
Api URL : http://localhost:3000/users
Method  : GET

# 7. Policy List
Api URL : http://localhost:3000/policy/list
Method  : GET

# 8. Policy List with details
Api URL : http://localhost:3000/policy/details
Method  : GET

```

#### API List ( Task2 )
```bash
# 9. Track real-time CPU utilization of the node server and on 70% usage restart the server.
Monitor Server : pm2 monit

# 10. Create a post-service that takes the message, day, and time in body parameters and it inserts that message into DB at that particular day and time.
Api URL : http://localhost:3000/messageboard
Method  : POST
Param   : message (string), msgdtd(date), msgtime (time)

```

