# Book Reading List App
 
## How to Run the Project
1. Open the command prompt/terminal
2. Clone project 
module 3
```
git clone https://github.com/TriBellCat/module-3-final-project-trinity-belen.git
```
module 4
```
git clone --branch module-4 https://github.com/TriBellCat/module-3-final-project-trinity-belen.git
```
### Frontend

3. Go to the project folder 
```
cd module-3-final-project-trinity-belen/book-recommendation-app
```
4. Install the requirements by entering this command in the terminal
```
npm install
```
5. If you haven't gotten a Google Books API, please do so before continuing to the next step. Instructions on how to do so is at the "How to Get a Google Books API" section.
6. Create an .env file in the book-recommendation-app folder and open it up to put **VITE_Api_Key="INSERT_YOUR_API_HERE"** on the first line.
7. Run this command in terminal to run the project
```
npm run dev
```
### Backend
2. Clone project 
```
git clone --branch https://github.com/TriBellCat/module-3-final-project-trinity-belen.git
```
4. Install the requirements by entering this command in the terminal
```
npm install
```
5. If you haven't gotten a Google Books API, please do so before continuing to the next step. Instructions on how to do so is at the "How to Get a Google Books API" section.
6. Create an .env file in the same location as server.js with this in it (and you have to change the values to yours accordingly).
   ```
   PORT=3001
   DB_HOST=MySQL Host Name
   DB_USER=MySQL Username
   DB_PASSWORD=MySQL Password
   DB_NAME=Database Name
   JWT_KEY=JWT Key
   VITE_Api_Key="Google Books API key (needs to be in quotation marks)"
   ```
7. Run the schema.sql file in MYSQL
8. Run this command in terminal to run the project
```
node server.js
```
## How to Get a Google Books API
1. Head to the [Google Cloud Platform](https://console.developers.google.com/apis/credentials)
2. Click on the Credentials tab
3. Create project by clicking on "Create Project"
4. When the project is finished creating, select that project
5. Click on "+ Create Credentials" and then click on "API Key"
6. Copy and paste the generated API key as mentioned in step 6 on How to Run the Project

## Other 
Other information pertaining to the code's structure and the API and libraries used is in this [document](https://docs.google.com/document/d/1ervU2UGccMAh6cDOnvskbUd97rN3S7KTtbWg6xhDhIw/edit?usp=sharing)
