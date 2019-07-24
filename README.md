  # Reactapp
  DigiFi's Core React Application for its Loan Origination System
  
  ## Installation

  ### Installing the module into a project

  * Run `npm i @digifi-los/reactapp` in your application

  ### Running the module locally
  
  #### Setup (Follow these steps):
  * Clone or download the zip file from this repository
  * Run `npm i` in the root level
  * If running Node v10+, run `npm rebuild bcrypt --build-from-source` (known issue with bcrypt and different node versions)
  * `cd adminclient` 
  * Run `npm i` in the adminclient folder

  #### Other Commands:
  * Run `npm start` (in the adminclient directory) to run locally
  * Run `npm run build` (in the adminclient directory) to build files into the adminclient public folder
  * Run `npm run package` (in the root directory) to build files into the adminclient public folder and copy those files into the root public folder (this is generally done when pushing new reactapp changes to github)
  
  ### Uninstalling the Module

  Run `npm uninstall @digifi-los/reactapp` from your application 