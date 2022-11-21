package migrations

import (
	"encoding/json"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/daos"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/models"
)

// Auto generated migration with the most recent collections configuration.
func init() {
	m.Register(func(db dbx.Builder) error {
		jsonData := `[
			{
				"id": "systemprofiles0",
				"created": "2022-11-16 23:32:33.890",
				"updated": "2022-11-16 23:32:33.890",
				"name": "profiles",
				"system": true,
				"schema": [
					{
						"system": true,
						"id": "pbfielduser",
						"name": "userId",
						"type": "user",
						"required": true,
						"unique": true,
						"options": {
							"maxSelect": 1,
							"cascadeDelete": true
						}
					},
					{
						"system": false,
						"id": "pbfieldname",
						"name": "name",
						"type": "text",
						"required": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "pbfieldavatar",
						"name": "avatar",
						"type": "file",
						"required": false,
						"unique": false,
						"options": {
							"maxSelect": 1,
							"maxSize": 5242880,
							"mimeTypes": [
								"image/jpg",
								"image/jpeg",
								"image/png",
								"image/svg+xml",
								"image/gif"
							],
							"thumbs": null
						}
					}
				],
				"listRule": "userId = @request.user.id",
				"viewRule": "userId = @request.user.id",
				"createRule": "userId = @request.user.id",
				"updateRule": "userId = @request.user.id",
				"deleteRule": null
			},
			{
				"id": "c0y26dhmzatl320",
				"created": "2022-11-16 23:40:38.488",
				"updated": "2022-11-16 23:45:32.317",
				"name": "projects",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "5hfkz0ts",
						"name": "name",
						"type": "text",
						"required": true,
						"unique": true,
						"options": {
							"min": 10,
							"max": 100,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "zmgzzqyl",
						"name": "archived",
						"type": "bool",
						"required": false,
						"unique": false,
						"options": {}
					},
					{
						"system": false,
						"id": "vu9oa0tb",
						"name": "user",
						"type": "relation",
						"required": true,
						"unique": false,
						"options": {
							"maxSelect": 1,
							"collectionId": "systemprofiles0",
							"cascadeDelete": false
						}
					}
				],
				"listRule": "",
				"viewRule": "",
				"createRule": "",
				"updateRule": "",
				"deleteRule": ""
			},
			{
				"id": "5x3ym4z6g9tl8w1",
				"created": "2022-11-16 23:50:57.125",
				"updated": "2022-11-18 04:23:45.510",
				"name": "expense",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "gdinafz3",
						"name": "project",
						"type": "relation",
						"required": true,
						"unique": false,
						"options": {
							"maxSelect": 1,
							"collectionId": "c0y26dhmzatl320",
							"cascadeDelete": false
						}
					},
					{
						"system": false,
						"id": "o4pjnpzy",
						"name": "name",
						"type": "text",
						"required": true,
						"unique": false,
						"options": {
							"min": 10,
							"max": 200,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "emxtmxmw",
						"name": "cost",
						"type": "number",
						"required": true,
						"unique": false,
						"options": {
							"min": 0,
							"max": null
						}
					},
					{
						"system": false,
						"id": "lahxdsci",
						"name": "tags",
						"type": "text",
						"required": false,
						"unique": false,
						"options": {
							"min": 0,
							"max": 200,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "h7hefpz9",
						"name": "files",
						"type": "file",
						"required": false,
						"unique": false,
						"options": {
							"maxSelect": 1,
							"maxSize": 5242880,
							"mimeTypes": [
								"application/pdf",
								"application/msword",
								"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
								"application/vnd.ms-excel",
								"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
								"image/jpg",
								"image/jpeg",
								"image/png",
								"image/svg+xml",
								"image/gif"
							],
							"thumbs": []
						}
					}
				],
				"listRule": "",
				"viewRule": "",
				"createRule": "",
				"updateRule": "",
				"deleteRule": ""
			}
		]`

		collections := []*models.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collections); err != nil {
			return err
		}

		return daos.New(db).ImportCollections(collections, true, nil)
	}, func(db dbx.Builder) error {
		// no revert since the configuration on the environment, on which
		// the migration was executed, could have changed via the UI/API
		return nil
	})
}
