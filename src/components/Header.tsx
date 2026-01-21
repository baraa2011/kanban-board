type Props = {
  title: string
}

export const Header = ({ title }: Props) => {
  return (
    <header className="board__header flex items-baseline justify-between">
      <h1 className="text-2xl font-semibold">{title}</h1>
    </header>
  )
}
