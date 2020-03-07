# Maintenance Genie
## Summary
Maintenance Genie is a tool to help landlords, workers, and tenants manage their maintenance needs! Whether it is a broken toaster or a clogged up shower drain, Maintenance Genie is here to help! Tenants simply submit a maintenance request through our online portal, then those maintenance requests enter a queue for service workers to assign to themselves and complete in a timely manner. Once a job has been finished, the ticket is closed and the tenant can see all the jobs that have been completed for their apartment. Furthermore, landlords can verify the users on the site by either designating them as a service worker or a tenant on their home page. Any user on the online system must be verified as either a tenant or a worker before they can login. This is to ensure users that don't live in the building cannot submit bogus requests!

## Install
### Backend
 No installation is required for the backend because the API is hosted by Google Cloud at https://us-central1-maintenance-genie.cloudfunctions.net/api/. Our frontend code accesses the backend API by making either GET or POST requests to https://us-central1-maintenance-genie.cloudfunctions.net/api/<api-endpoint>.

### Frontend
 In order to run our frontend application, first navigate to ./frontend. You will need to install [Node Package Manager](https://www.npmjs.com/get-npm) on your machine. Then run the commands `npm install` and `npm i react-scripts` to install all the relevant JavaScript packages. Finally, run `npm start` and navigate to http://localhost:3000/ in your Google Chrome browser in order to login.

## Default Accounts
In order to utilize any of the functionality of our app, you will have to be logged in. Here are some of the default logins to help get you started.

### Tenant Credentials
email: chris@email.com
password: ilovepups!

### Worker Credentials
email: johnny@worker.net
password: ilovetools!

### Landlord Credentials
email: elisa@landlord.net
password: password1

## Usage
Once you are logged in, you can modify the contents of the respective user accounts in whatever way you would like. As a tenant, you can submit tickets, see your ticket history, and edit your profile. As a worker you can assign tickets to yourself by clicking on one of the tickets on the "Pending Tickets" page. You can close the tickets by clicking on them in the "Assigned Tickets" page and you can also edit your account. As a landlord, you can either verify a tenant under "Assign Tenants", verify a worker under "Assign Workers", or edit your account information.
