package main

import (
	"net/http"

	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
)

func RegisterRoutes(app *pocketbase.PocketBase) {
	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.AddRoute(echo.Route{
			Method: http.MethodGet,
			Path:   "/api/report",
			Handler: func(c echo.Context) error {
				return c.String(200, "Hello World!")
			},
			Middlewares: []echo.MiddlewareFunc{
				apis.RequireUserAuth(),
			},
			Name: "",
		})
		return nil
	})
}
