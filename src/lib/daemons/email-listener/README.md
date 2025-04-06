Setting this daemon up will require the following steps:
### 1. Install dependencies
Make sure the dependencies are up to date.
```bash
npm install
```
### 2. Set up an app password
For this to work for a Gmail account with 2FA, you will need to set up an [app password](https://myaccount.google.com/apppasswords).
### 3. Set up environment variables
Add the following environment variables to your root `.env` file:
```dotenv
EMAIL_ADDRESS=user@gmail.com
EMAIL_PASSWORD=APP_PASSWORD
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
TEMPLATES_DIR=./src/lib/daemons/email-listener/templates
```
### 4. Set up users file
Create a `users.json` in the root project folder with the following content for each whitelisted email account:
```json
[
  {
    "email": "user@gmail.com",
    "name": "John"
  }
]
```
### 5. Run the application
```bash
npm run dev:email-listener
```