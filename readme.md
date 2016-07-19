## Description
This is the backend of another project that is design to help train people on accepting/Rejecting golden images.
The node module do not create the DB, but could easily. The schema of the DB is inside a folder for reference/backup.

Multiple level:
Security: The Node app will only display the login section if the user is not login.
API level: Some routes are for information and some other routes are the Data itself.
The app will be loaded when the Node pass the security layer.


Running it: $ node app.js
Testing it: $ jasmine-node test/app-spec.js

## Build flow:
Step1: (done)
Add following routes so we can connect the front-end all the way to the DB.
	- Post new Golden Sample '/golden/'
	- Post new User '/users/'
	- Post new result with user X. '/result/'

Step2: 
	- Re-check with Heather for Needed analytics.
	- Add a Random row selector that exclude the user last "100/Good/bad" inspection. --> Customisable???
	- Add Security/OAuth (to check lotAuth)
	- Check how OAuth can work with Postgres structure.

Step3:
	- Validate DB structure and add the routes/querry needed.
	- Connect the Front-end with new routes.


## Analytics needed by the Front-end. 
### Trainee Analytics (Filtered by user) so Get with param:
Nbr of images checked.
Fail rate on Good & Bad images
Top 3 problematic decision (added or missing).
Average inspection time vs other. 
Graph of success rate split in 100 img since the start.
Calender view of his progress (% succes vs NbrPer day D3?)

### Trainer Analytics:
Success rate on Bad images.
Success rate on Good images.
Images that is mostly mistaked.
Images that were Contested by trainee + All reason listed of all user. --> need username + Text + All missing or extra item.
Reason that fail the most.
Average time for inspection per user.
Total system Good img vs Bad img.
Total system Nbr Error 1, 2, 3, 4... 
Calender view of all user progress (% succes vs NbrPer day D3?).
