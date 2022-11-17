package main

import (
	"log"

	"github.com/pocketbase/pocketbase"
)

func main() {
	app := pocketbase.New()
	// Create databse
	// Register routes
	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
