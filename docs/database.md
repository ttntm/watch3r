# Database Data Model

This application is currently using Fauna for data storage.

Only titles added to either watchlist or tracklist are stored in the database. 

Recommendations are obtained from TMDb and stored in LocalStorage until the user logs out of the application.

## Collections

Collections hold documents, they're Fauna's equivalent of tables.

Fauna documentation: 

- https://docs.fauna.com/fauna/current/learn/understanding/collections
- https://docs.fauna.com/fauna/current/learn/understanding/documents?lang=javascript

### Remarks

`image` -> path to a movie poster, obtained from OMDb API

`ref['@ref'].id` -> unique ID for Fauna records

`refId` in `data: {}` -> created when reading items from the database ([here](https://github.com/ttntm/watch3r/blob/master/src/store/modules/list.js#L119)), persisted only for tracklist records if they're created based on items in the watchlist (_NB: this should probably be corrected at some point, but it doesn't cause any issues_)

`type` -> can be either `movie` or `series`

`user` -> GUID obtained from Netlify Identity via [gotrue-js](https://github.com/netlify/gotrue-js)

`watching` -> see: #52; added to enable marking watchlist items as "currently watching" - automatically removed from titles when they move to the tracklist

### Watchlist

Stores the titles that users want to watch after their information has been obtained from the OMDb API.

#### Watchlist Schema

```json
{
  "ref": {
    "@ref": {
      "id": "279819220725793281",
      "collection": {
        "@ref": {
          "id": "watchlist",
          "collection": {
            "@ref": {
              "id": "collections"
            }
          }
        }
      }
    }
  },
  "ts": 1606403294870000,
  "data": {
    "genre": "Horror, Sci-Fi",
    "id": "tt0078748",
    "image": "https://media.url/img.jpg",
    "imdbRating": "8.4",
    "plot": "After a space merchant vessel receives an unknown transmission as a distress call, one of the crew is attacked by a mysterious life form and they soon realize that its life cycle has merely begun.",
    "title": "Alien",
    "type": "movie",
    "user": "6237ad60-9999-0000-1111-dfbdd8bdc811",
    "watching": "false",
    "year": "1979"
  }
}
```

### Tracklist

The movie journal data, it stores the titles that users have watched.

Records can end up here in two ways:

- Moved from the watchlist (no additional content API request)
- Added directly to the tracklist (information obtained from the OMDb API)

#### Tracklist Schema

```json
{
  "ref": {
    "@ref": {
      "id": "279266784836583942",
      "collection": {
        "@ref": {
          "id": "tracklist",
          "collection": {
            "@ref": {
              "id": "collections"
            }
          }
        }
      }
    }
  },
  "ts": 1606403221310000,
  "data": {
    "genre": "Action, Adventure, Thriller",
    "id": "tt0088944",
    "image": "https://media.url/img.jpg",
    "imdbRating": "6.7",
    "plot": "A retired Special Forces colonel tries to save his daughter, who was abducted by his former subordinate.",
    "title": "Commando",
    "type": "movie",
    "user": "6237ad60-9999-0000-1111-dfbdd8bdc811",
    "year": "1985",
    "refId": "279266784836583942",
    "userRating": "7.3",
    "userDateWatched": "2000-01-01",
    "userNotes": "Classic action movie with tons of explosions, one liners that became famous later and Arnold in badass shape. A movie I could watch once a year and still be entertained every single time."
  }
}
```