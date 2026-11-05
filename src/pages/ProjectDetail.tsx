import { useParams } from 'react-router'
import PageStub from '../components/PageStub'
import { routeLabel } from '../lib/routes'

export default function ProjectDetail() {
  const { slug } = useParams()
  return <PageStub title={routeLabel(`/work/${slug}`)} />
}
