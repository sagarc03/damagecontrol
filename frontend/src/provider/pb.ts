import React from 'react'
import PocketBase from 'pocketbase'

const PocketBaseContext = React.createContext<PocketBase>(new PocketBase())

export const usePocketBase = () => React.useContext(PocketBaseContext)

export const PocketBaseProvider = PocketBaseContext.Provider
