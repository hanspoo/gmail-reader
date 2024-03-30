# Read google emails

Build to explore google emails using oauth

In the need to custom process massive information from banks and other organizations.

## Obey but block up

At least in Chile, the banks and the government itself, obey the law, but block up until
they can the access to data, in particular they make it very hard the massive access to data.

It's obvious tha if you where able to download a csv with all your movements for the last
ten years, they could be in trouble.

## Cache

Uses a cache in the filesystem of the mails in json format to reduce calls to google.

## credentials.json

You must put here a file with credentials: credentials.json, obtain it from google, something like:

```
{
  "installed": {
    "client_id": "xxx-yyy-.apps.googleusercontent.com",
    "project_id": "xxx-yyy-zzz",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_secret": "aaa-bbb-ccc",
    "redirect_uris": [
      "http://localhost"
    ]
  }
}

```
