export const SimulationPageClient = ({
  id,
}: {
  id: string
}) => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Simulação {id}</h1>
    </div>
  )
}
