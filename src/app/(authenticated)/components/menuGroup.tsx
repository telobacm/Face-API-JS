import { ReactNode, useState } from 'react'

interface menuGroupProps {
  children: (handleClick: () => void, open: boolean) => ReactNode
  activeCondition: boolean
}

const MenuGroup = ({ children, activeCondition }: menuGroupProps) => {
  const [open, setOpen] = useState<boolean>(activeCondition)

  const handleClick = () => {
    setOpen(!open)
  }

  return <li>{children(handleClick, open)}</li>
}

export default MenuGroup
