import requests

external_author_url = "https://cmput404-vgt-socialdist.herokuapp.com/service/author/a5c98286-f639-4419-a6d0-3b7910bee61b"
local_author_url = input("Local author url: ")

split = local_author_url.split('/')
api_url = split[0] + '//' + '/'.join(split[2:(split.index('api'))])
author_id = split[split.index('author') + 1]

payload = {
  "summary": "Mike wants to follow Muhammad",
  "type":"Follow",
  "object": {
    "type": "author",
    "id": local_author_url,
    "url": local_author_url,
    "host": api_url,
    "displayName": "Muhammad",
    "github": "https://github.com/Exanut",
    "profileImage": "https://avatars.githubusercontent.com/u/83198532?v=4"
  },
  "actor": {
    "type":"author",
    "id":external_author_url,
    "url":external_author_url,
    "host":"https://cmput404-vgt-socialdist.herokuapp.com/",
    "displayName":"Mike",
    "github":None,
    "profileImage":None
  }
}

resp = requests.post(f'{api_url}/api/v1/author/{author_id}/inbox/', auth=('admin', 'NewConnectionAdmin'), json = payload)
print(resp.status_code)
print(resp.json())
