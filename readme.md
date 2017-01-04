## Description
This is the backend of another project that is design to help train people on accepting/Rejecting golden images.
The node module do not create the DB, but could easily later. The schema of the DB is inside a folder for reference/backup.

Multiple level:
Security: The Node app will only display the login section if the user is not login.
API level: Some routes are for information and some other routes are the Data itself.
The app will be loaded when the Node pass the security layer.

Pre-requisite: Having Postgress running with the DB (dump of it in the dbStructureData or you can easily create it directly.)
Starting Postgress: "pg_ctl -D /usr/local/var/postgres -l /usr/local/var/postgres/server.log start"
- To Stop it: "pg_ctl -D /usr/local/var/postgres stop -s -m fast"
Running: $ node app.js
Testing: $ jasmine-node test

## Build flow:
Step1: (done)
	- Security
	- Multiple API routes protected
	- Query to the DB
	- Testing

Step2: (next after building the Front-end)
	- Re-check with Heather for Needed analytics.
	- Add a Random row selector that exclude the user last "100/Good/bad" inspection. --> Customisable???
	- Adding roles system and security that only certain role have access to certain query.

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
Calendar view of his progress (% success vs NbrPer day D3?)

### Trainer Analytics:
Success rate on Bad images.
Success rate on Good images.
Images that is mostly mistaken.
Images that were Contested by trainee + All reason listed of all user. --> need username + Text + All missing or extra item.
Reason that fail the most.
Average time for inspection per user.
Total system Good img vs Bad img.
Total system Nbr Error 1, 2, 3, 4...
Calendar view of all user progress (% success vs NbrPer day D3?).

## TODO: Scripts
- Reset of the Postgres DB of Golden Images.
-

## Debug
some error after seting up postgres: http://dba.stackexchange.com/questions/83984/connect-to-postgresql-server-fatal-no-pg-hba-conf-entry-for-host
