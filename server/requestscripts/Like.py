import requests

external_author_url = "https://cmput404-vgt-socialdist.herokuapp.com/service/author/a5c98286-f639-4419-a6d0-3b7910bee61b"
post_url = input("Post url: ")

payload = {
  "summary": "Mike likes your post",
  "@context": "https://cmput404-vgt-socialdist.herokuapp.com/",
  "type":"Like",
  "object":post_url,
  "author": {
    "type":"author",
    "id":external_author_url,
    "url":external_author_url,
    "host":"https://cmput404-vgt-socialdist.herokuapp.com/",
    "displayName":"Mike",
    "github":None,
    "profileImage":None
  }
}

split = post_url.split('/')
api_url = split[0] + '//' + '/'.join(split[2:(split.index('api'))])
author_id = split[split.index('author') + 1]

resp = requests.post(f'{api_url}/api/v1/author/{author_id}/inbox/', auth=('admin', 'NewConnectionAdmin'), json = payload)
print(resp.status_code)
print(resp.json())

