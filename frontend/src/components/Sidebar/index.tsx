export interface SideBarRoute {
  label: string
  path: string
}

export interface SideBarProps {
  route: SideBarRoute[]
}

export default function SideBar({ route }: SideBarProps) {
  return (
    <ul>
      {route.map((value, index) => (
        <li key={index}>{value.label}</li>
      ))}
    </ul>
  )
}
