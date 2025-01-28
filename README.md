# module-3-final-project-trinity-belen
 
## How to Run the Project
1. Open the command prompt/terminal
2. Clone project 
```
git clone https://github.com/TriBellCat/module-3-final-project-trinity-belen.git
```
3. Go to the project folder 
```
cd module-3-final-project-trinity-belen/book-recommendation-app
```
4. Install the requirements by entering this command in the terminal
```
npm run dev
```
5. If you haven't gotten a Google Books API, please do so before continuing to the next step. Instructions on how to do so is [[#How to Get a Google Books API|here]].
6. Create an .env file in the book-recommendation-app folder and open it up to put **VITE_Api_Key="INSERT_YOUR_API_HERE"** on the first line.

## How to Get a Google Books API
1. Head to the [Google Cloud Platform](https://console.developers.google.com/apis/credentials)
2. Click on the Credentials tab
3. Create project by clicking on "Create Project"
4. When the project is finished creating, select that project
5. Click on "+ Create Credentials" and then click on "API Key"
6. Copy and paste the generated API key to VITE_Api_Key
