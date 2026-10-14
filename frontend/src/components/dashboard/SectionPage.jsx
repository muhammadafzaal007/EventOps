import EmptyState from './EmptyState'
import PageHeader from './PageHeader'
import SectionCard from './SectionCard'

// Generic placeholder page driven by a navigation config item.
function SectionPage({ item }) {
  return (
    <>
      <PageHeader title={item.title} subtitle={item.description} actionLabel={item.actionLabel} actionTo={item.actionTo} />
      <SectionCard title={item.title}>
        <EmptyState icon={item.icon} title={item.emptyTitle} message={item.emptyMessage} />
      </SectionCard>
    </>
  )
}

export default SectionPage
